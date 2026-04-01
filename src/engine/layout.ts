import { LayoutBox, LayoutConstraints } from '../types/layout';
import { RissElement, BlockUsage, isBlockUsage } from '../types/riss';
import { resolveSpacing, resolvePaddingXY, resolveSize } from './theme/tokens';
import { estimateElementHeight, measureTextWidth, measureWrappedText } from './measure';
import { getFontString, getLineHeight } from './theme/typography';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Compute positioned LayoutBoxes for a list of top-level children that fill
 * the given viewport.  The root is treated as a vertical stack.
 */
export function computeLayout(
  children: (RissElement | BlockUsage)[],
  availableWidth: number,
  availableHeight: number,
): LayoutBox[] {
  // Create a synthetic root stack element
  const rootElement: RissElement = {
    type: 'stack',
    children,
  };

  const rootBox = layoutElement(rootElement, {
    availableWidth,
    availableHeight,
    parentDirection: 'stack',
  });

  return rootBox.children;
}

// ---------------------------------------------------------------------------
// Core recursive layout
// ---------------------------------------------------------------------------

/**
 * Layout a single element (and its children, if any) within the given
 * constraints.  Returns a fully positioned LayoutBox.
 */
function layoutElement(
  element: RissElement | BlockUsage,
  constraints: LayoutConstraints,
): LayoutBox {
  const { availableWidth, availableHeight } = constraints;

  // Resolve explicit dimensions (-1 = auto)
  const explicitW = isBlockUsage(element)
    ? -1
    : resolveSize(element.width, availableWidth);
  const explicitH = isBlockUsage(element)
    ? -1
    : resolveSize(element.height, availableHeight);

  // Resolve spacing
  const el = element as RissElement;
  const { x: paddingX, y: paddingY } = resolvePaddingXY(el.padding, el['padding-x'], el['padding-y']);
  const marginX = resolveSpacing(el['margin-x'] ?? el.margin);
  const marginY = resolveSpacing(el['margin-y'] ?? el.margin);
  const gap = resolveSpacing(el.gap);

  // Outer box width: explicit or fill parent minus margins
  const outerWidth =
    explicitW >= 0 ? explicitW : availableWidth - marginX * 2;
  const contentWidth = Math.max(0, outerWidth - paddingX * 2);
  const contentHeight = Math.max(
    0,
    (explicitH >= 0 ? explicitH : availableHeight) - paddingY * 2,
  );

  // Determine direction
  const direction = resolveDirection(element);

  // Recursively layout children
  const children = getChildren(element);
  let childBoxes: LayoutBox[] = [];
  let childrenHeight = 0;
  let childrenWidth = 0;

  if (children.length > 0) {
    switch (direction) {
      case 'row':
        childBoxes = layoutRow(element, children, contentWidth, contentHeight, gap);
        break;
      case 'grid':
        childBoxes = layoutGrid(element, children, contentWidth, contentHeight, gap);
        break;
      case 'stack':
      default:
        childBoxes = layoutStack(element, children, contentWidth, contentHeight, gap);
        break;
    }

    // Measure total children extent
    for (const cb of childBoxes) {
      childrenHeight = Math.max(childrenHeight, cb.y + cb.height);
      childrenWidth = Math.max(childrenWidth, cb.x + cb.width);
    }
  }

  // Compute final box height
  let boxHeight: number;
  if (explicitH >= 0) {
    boxHeight = explicitH;
  } else if (children.length > 0) {
    boxHeight = childrenHeight + paddingY * 2;
  } else {
    boxHeight = estimateElementHeight(element, contentWidth) + paddingY * 2;
  }

  const boxWidth = outerWidth;

  // Apply alignment to children (relative to content area)
  if (childBoxes.length > 0) {
    applyAlignment(el, childBoxes, contentWidth, contentHeight, childrenHeight, direction);
  }

  // Offset children by padding
  for (const cb of childBoxes) {
    cb.x += paddingX;
    cb.y += paddingY;
  }

  const clipContent = el.overflow === 'hidden' || el.overflow === 'scroll';

  return {
    x: marginX,
    y: marginY,
    width: boxWidth,
    height: boxHeight,
    element,
    children: childBoxes,
    clipContent,
    scrollDirection:
      el.overflow === 'scroll'
        ? direction === 'row'
          ? 'horizontal'
          : 'vertical'
        : undefined,
  };
}

// ---------------------------------------------------------------------------
// Stack (vertical) layout
// ---------------------------------------------------------------------------

function layoutStack(
  parent: RissElement | BlockUsage,
  children: (RissElement | BlockUsage)[],
  contentWidth: number,
  contentHeight: number,
  gap: number,
): LayoutBox[] {
  const boxes: LayoutBox[] = [];
  let y = 0;

  // First pass: layout all children to determine natural heights
  const measured: LayoutBox[] = [];
  let totalFixedHeight = 0;
  let totalGrow = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childEl = child as RissElement;
    const grow = childEl.grow ?? 0;

    const box = layoutElement(child, {
      availableWidth: contentWidth,
      availableHeight: contentHeight,
      parentDirection: 'stack',
    });

    measured.push(box);
    totalFixedHeight += box.height;
    totalGrow += grow;

    if (i < children.length - 1) {
      totalFixedHeight += gap;
    }
  }

  // Distribute remaining space to grow children
  const remainingSpace = Math.max(0, contentHeight - totalFixedHeight);

  for (let i = 0; i < measured.length; i++) {
    const box = measured[i];
    const childEl = children[i] as RissElement;
    const grow = childEl.grow ?? 0;

    if (totalGrow > 0 && grow > 0) {
      box.height += (grow / totalGrow) * remainingSpace;
    }

    // Cross-axis: children fill width by default in stack
    const childExplicitW = resolveSize(childEl.width, contentWidth);
    if (childExplicitW < 0) {
      box.width = contentWidth;
    }

    box.x = 0;
    box.y = y;
    y += box.height + gap;

    boxes.push(box);
  }

  return boxes;
}

// ---------------------------------------------------------------------------
// Row (horizontal) layout
// ---------------------------------------------------------------------------

function layoutRow(
  parent: RissElement | BlockUsage,
  children: (RissElement | BlockUsage)[],
  contentWidth: number,
  contentHeight: number,
  gap: number,
): LayoutBox[] {
  const boxes: LayoutBox[] = [];

  // First pass: measure all children
  const measured: LayoutBox[] = [];
  let totalFixedWidth = 0;
  let totalGrow = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childEl = child as RissElement;
    const grow = childEl.grow ?? 0;

    // Give each child a proportional initial width estimate
    const estimatedWidth =
      resolveSize(childEl.width, contentWidth) >= 0
        ? resolveSize(childEl.width, contentWidth)
        : grow > 0
          ? 0 // will be distributed later
          : intrinsicSize(child, contentWidth).width;

    const box = layoutElement(child, {
      availableWidth: Math.max(0, estimatedWidth),
      availableHeight: contentHeight,
      parentDirection: 'row',
    });

    box.width = estimatedWidth;
    measured.push(box);
    totalFixedWidth += estimatedWidth;
    totalGrow += grow;

    if (i < children.length - 1) {
      totalFixedWidth += gap;
    }
  }

  // Distribute remaining space to grow children
  const remainingSpace = Math.max(0, contentWidth - totalFixedWidth);

  // Find max height for cross-axis stretching
  let maxHeight = 0;
  for (const box of measured) {
    maxHeight = Math.max(maxHeight, box.height);
  }

  let x = 0;
  for (let i = 0; i < measured.length; i++) {
    const box = measured[i];
    const childEl = children[i] as RissElement;
    const grow = childEl.grow ?? 0;

    if (totalGrow > 0 && grow > 0) {
      const extra = (grow / totalGrow) * remainingSpace;
      box.width += extra;

      // Re-layout with actual width so children adapt
      const relaid = layoutElement(children[i], {
        availableWidth: box.width,
        availableHeight: contentHeight,
        parentDirection: 'row',
      });
      box.height = relaid.height;
      box.children = relaid.children;
      box.clipContent = relaid.clipContent;
      box.scrollDirection = relaid.scrollDirection;
    }

    // Cross-axis stretch: match tallest child unless explicit height
    const explicitH = resolveSize(childEl.height, contentHeight);
    if (explicitH < 0 && maxHeight > 0) {
      box.height = maxHeight;
    }

    box.x = x;
    box.y = 0;
    x += box.width + gap;

    boxes.push(box);
  }

  return boxes;
}

// ---------------------------------------------------------------------------
// Grid layout
// ---------------------------------------------------------------------------

function layoutGrid(
  parent: RissElement | BlockUsage,
  children: (RissElement | BlockUsage)[],
  contentWidth: number,
  contentHeight: number,
  gap: number,
): LayoutBox[] {
  const el = parent as RissElement;
  const columns = el.columns ?? 2;
  const cellWidth = (contentWidth - gap * (columns - 1)) / columns;

  const boxes: LayoutBox[] = [];
  let col = 0;
  let rowY = 0;
  let rowHeight = 0;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const childEl = child as RissElement;
    const span = childEl.span ?? 1;
    const spannedWidth = cellWidth * span + gap * (span - 1);

    // If this child doesn't fit in the current row, wrap
    if (col + span > columns) {
      rowY += rowHeight + gap;
      col = 0;
      rowHeight = 0;
    }

    const box = layoutElement(child, {
      availableWidth: spannedWidth,
      availableHeight: contentHeight - rowY,
      parentDirection: 'grid',
    });

    box.x = col * (cellWidth + gap);
    box.y = rowY;
    box.width = spannedWidth;

    rowHeight = Math.max(rowHeight, box.height);
    col += span;

    // Wrap if row is full
    if (col >= columns) {
      rowY += rowHeight + gap;
      col = 0;
      rowHeight = 0;
    }

    boxes.push(box);
  }

  return boxes;
}

// ---------------------------------------------------------------------------
// Intrinsic size estimation for leaf elements
// ---------------------------------------------------------------------------

function intrinsicSize(
  element: RissElement | BlockUsage,
  maxWidth: number,
): { width: number; height: number } {
  if (isBlockUsage(element)) {
    return { width: maxWidth, height: 44 };
  }

  const el = element;
  const type = el.type ?? '';

  // If explicit dimensions are set, use them
  const explicitW = resolveSize(el.width, maxWidth);
  const explicitH = resolveSize(el.height, 0);

  const height = estimateElementHeight(el, maxWidth);

  switch (type) {
    case 'text': {
      const variant = el.variant ?? 'body';
      const font = getFontString(variant);
      const content = el.content ?? el.text ?? '';
      const textW = measureTextWidth(content, font);
      return {
        width: explicitW >= 0 ? explicitW : Math.min(textW, maxWidth),
        height: explicitH >= 0 ? explicitH : height,
      };
    }

    case 'button': {
      const label = el.label ?? el.text ?? '';
      const font = getFontString('button');
      const textW = measureTextWidth(label, font);
      const iconW = el.icon ? 24 : 0;
      const padX = el.size === 'sm' ? 12 : el.size === 'lg' ? 24 : 16;
      const totalW = textW + iconW + padX * 2 + (iconW > 0 ? 8 : 0);
      return {
        width: explicitW >= 0 ? explicitW : totalW,
        height: explicitH >= 0 ? explicitH : height,
      };
    }

    case 'icon': {
      const size = el.size ?? 24;
      return { width: size, height: size };
    }

    case 'avatar': {
      const size = typeof el.size === 'number' ? el.size : 40;
      return { width: size, height: size };
    }

    case 'badge': {
      const label = el.label ?? el.text ?? '';
      const font = getFontString('caption');
      const textW = measureTextWidth(label, font);
      return { width: textW + 12, height: 22 };
    }

    case 'chip': {
      const label = el.label ?? el.text ?? '';
      const font = getFontString('body-sm');
      const textW = measureTextWidth(label, font);
      return { width: textW + 24, height: 32 };
    }

    case 'divider':
      return { width: maxWidth, height: 1 };

    case 'spacer': {
      const size = typeof el.size === 'number' ? el.size : 16;
      return { width: maxWidth, height: size };
    }

    case 'fab':
      return { width: 56, height: 56 };

    case 'image': {
      const w = explicitW >= 0 ? explicitW : maxWidth;
      const aspect = el['aspect-ratio'] ?? 16 / 9;
      return { width: w, height: explicitH >= 0 ? explicitH : Math.round(w / aspect) };
    }

    case 'checkbox':
    case 'radio':
      return { width: maxWidth, height: 24 };

    case 'toggle':
      return { width: 52, height: 28 };

    case 'progress':
      return { width: maxWidth, height: (typeof el.height === 'number' ? el.height : 8) };

    case 'slider':
      return { width: maxWidth, height: 32 };

    case 'skeleton':
      return { width: maxWidth, height: (typeof el.height === 'number' ? el.height : 20) };

    // Full-width by default for most interactive / container elements
    case 'input':
    case 'textarea':
    case 'select':
    case 'search':
    case 'table':
    case 'list':
    case 'navbar':
    case 'tabbar':
    case 'header':
    case 'tabs':
    case 'accordion':
    case 'calendar':
    case 'chart':
    case 'map':
    case 'video':
    case 'webview':
      return {
        width: explicitW >= 0 ? explicitW : maxWidth,
        height: explicitH >= 0 ? explicitH : height,
      };

    default:
      return {
        width: explicitW >= 0 ? explicitW : maxWidth,
        height: explicitH >= 0 ? explicitH : height,
      };
  }
}

// ---------------------------------------------------------------------------
// Alignment helpers
// ---------------------------------------------------------------------------

/**
 * Adjust child positions according to align (cross-axis) and justify
 * (main-axis) properties on the parent.
 */
function applyAlignment(
  parent: RissElement,
  childBoxes: LayoutBox[],
  contentWidth: number,
  contentHeight: number,
  childrenHeight: number,
  direction: 'stack' | 'row' | 'grid',
): void {
  const align = parent.align ?? 'stretch';
  const justify = parent.justify ?? 'start';

  if (direction === 'stack') {
    // Main axis = vertical, cross axis = horizontal
    applyCrossAxisAlignment(childBoxes, align, contentWidth, 'horizontal');
    applyMainAxisJustification(childBoxes, justify, childrenHeight, contentHeight, 'vertical');
  } else if (direction === 'row') {
    // Main axis = horizontal, cross axis = vertical
    const maxH = childBoxes.reduce((m, b) => Math.max(m, b.height), 0);
    applyCrossAxisAlignment(childBoxes, align, maxH, 'vertical');

    const totalChildWidth = childBoxes.reduce((sum, b) => sum + b.width, 0);
    applyMainAxisJustification(childBoxes, justify, totalChildWidth, contentWidth, 'horizontal');
  }
  // Grid alignment is handled per-cell already
}

function applyCrossAxisAlignment(
  boxes: LayoutBox[],
  align: string,
  crossSize: number,
  axis: 'horizontal' | 'vertical',
): void {
  for (const box of boxes) {
    const childEl = box.element as RissElement;
    const selfAlign = childEl['align-self'] ?? align;

    if (axis === 'horizontal') {
      switch (selfAlign) {
        case 'center':
          box.x = (crossSize - box.width) / 2;
          break;
        case 'end':
          box.x = crossSize - box.width;
          break;
        case 'stretch':
          box.width = crossSize;
          break;
        // 'start' is default (x = 0)
      }
    } else {
      switch (selfAlign) {
        case 'center':
          box.y += (crossSize - box.height) / 2;
          break;
        case 'end':
          box.y += crossSize - box.height;
          break;
        case 'stretch':
          box.height = crossSize;
          break;
      }
    }
  }
}

function applyMainAxisJustification(
  boxes: LayoutBox[],
  justify: string,
  childrenExtent: number,
  containerExtent: number,
  axis: 'vertical' | 'horizontal',
): void {
  if (justify === 'start' || containerExtent <= childrenExtent) return;

  const remaining = containerExtent - childrenExtent;
  const prop = axis === 'horizontal' ? 'x' : 'y';

  switch (justify) {
    case 'center': {
      const offset = remaining / 2;
      for (const box of boxes) {
        (box as any)[prop] += offset;
      }
      break;
    }
    case 'end': {
      for (const box of boxes) {
        (box as any)[prop] += remaining;
      }
      break;
    }
    case 'space-between': {
      if (boxes.length <= 1) break;
      const gap = remaining / (boxes.length - 1);
      for (let i = 0; i < boxes.length; i++) {
        (box_at(boxes, i) as any)[prop] += gap * i;
      }
      break;
    }
    case 'space-around': {
      const gap = remaining / boxes.length;
      for (let i = 0; i < boxes.length; i++) {
        (box_at(boxes, i) as any)[prop] += gap * (i + 0.5);
      }
      break;
    }
    case 'space-evenly': {
      const gap = remaining / (boxes.length + 1);
      for (let i = 0; i < boxes.length; i++) {
        (box_at(boxes, i) as any)[prop] += gap * (i + 1);
      }
      break;
    }
  }
}

function box_at(boxes: LayoutBox[], i: number): LayoutBox {
  return boxes[i];
}

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

/**
 * Determine the layout direction for an element.
 */
function resolveDirection(
  element: RissElement | BlockUsage,
): 'stack' | 'row' | 'grid' {
  if (isBlockUsage(element)) return 'stack';

  const type = element.type;
  // Explicit layout property
  if (element.layout === 'row' || type === 'row') return 'row';
  if (element.layout === 'grid' || type === 'grid') return 'grid';

  // Row-like types
  if (type === 'navbar' || type === 'tabbar' || type === 'header') return 'row';

  return 'stack';
}

/**
 * Extract children from an element or block usage.
 */
function getChildren(
  element: RissElement | BlockUsage,
): (RissElement | BlockUsage)[] {
  if (isBlockUsage(element)) return [];
  return element.children ?? [];
}
