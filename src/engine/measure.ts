import { TYPOGRAPHY_SCALE, getFontString, getLineHeight } from './theme/typography';

let measureCanvas: CanvasRenderingContext2D | null = null;

function getMeasureCtx(): CanvasRenderingContext2D {
  if (!measureCanvas) {
    const c = document.createElement('canvas');
    measureCanvas = c.getContext('2d')!;
  }
  return measureCanvas;
}

/**
 * Measure the pixel width of a text string for a given CSS font.
 */
export function measureTextWidth(text: string, font: string): number {
  const ctx = getMeasureCtx();
  ctx.font = font;
  return ctx.measureText(text).width;
}

/**
 * Measure wrapped text, returning the lines, total width, and total height.
 * Handles word-wrapping, optional maxLines truncation with ellipsis.
 */
export function measureWrappedText(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
  maxLines?: number,
): { width: number; height: number; lines: string[] } {
  const ctx = getMeasureCtx();
  ctx.font = font;

  if (!text) {
    return { width: 0, height: 0, lines: [] };
  }

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      if (maxLines && lines.length >= maxLines) {
        // There's overflow content — truncate the last visible line with ellipsis
        // Append the overflowing word to indicate continuation
        const lastLine = lines[lines.length - 1];
        const combined = lastLine + ' ' + word;
        lines[lines.length - 1] = truncateLineWithEllipsis(ctx, combined, maxWidth);
        currentLine = '';
        break;
      }
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine && (!maxLines || lines.length < maxLines)) {
    lines.push(currentLine);
  }

  let maxW = 0;
  for (const line of lines) {
    maxW = Math.max(maxW, ctx.measureText(line).width);
  }

  return {
    width: maxW,
    height: lines.length * lineHeight,
    lines,
  };
}

/**
 * Estimate the intrinsic height of a RISS element given available width.
 * Used during the measure pass of the layout engine.
 */
export function estimateElementHeight(
  element: any,
  availableWidth: number,
): number {
  const type: string = element.type ?? '';

  switch (type) {
    // --- Text ---------------------------------------------------------------
    case 'text': {
      const variant = element.variant ?? 'body';
      const font = getFontString(variant);
      const lh = getLineHeight(variant);
      const content = element.content ?? element.text ?? '';
      const { height } = measureWrappedText(
        content,
        font,
        availableWidth,
        lh,
        element['max-lines'],
      );
      return Math.max(height, lh);
    }

    // --- Buttons ------------------------------------------------------------
    case 'button': {
      const size = element.size ?? 'md';
      if (size === 'sm') return 36;
      if (size === 'lg') return 52;
      return 44;
    }

    // --- Input / Select / Search -------------------------------------------
    case 'input':
    case 'select':
    case 'search': {
      let h = 0;
      // Label
      if (element.label) {
        h += getLineHeight('label') + 4; // label + gap
      }
      // Field itself
      const size = element.size ?? 'md';
      if (size === 'sm') h += 36;
      else if (size === 'lg') h += 52;
      else h += 44;
      // Helper / Error text
      if (element.helper || element.error) {
        h += getLineHeight('caption') + 4;
      }
      return h;
    }

    // --- Textarea -----------------------------------------------------------
    case 'textarea': {
      let h = 0;
      if (element.label) {
        h += getLineHeight('label') + 4;
      }
      const rows = element.rows ?? 3;
      h += rows * getLineHeight('body');
      if (element.helper || element.error) {
        h += getLineHeight('caption') + 4;
      }
      return h;
    }

    // --- Image --------------------------------------------------------------
    case 'image': {
      if (element.height && typeof element.height === 'number') {
        return element.height;
      }
      const aspect = element['aspect-ratio'] ?? 16 / 9;
      return Math.round(availableWidth / aspect);
    }

    // --- Avatar -------------------------------------------------------------
    case 'avatar': {
      const size = element.size ?? 40;
      return typeof size === 'number' ? size : 40;
    }

    // --- Divider ------------------------------------------------------------
    case 'divider':
      return 1;

    // --- Spacer -------------------------------------------------------------
    case 'spacer': {
      if (element.size && typeof element.size === 'number') return element.size;
      return 16; // default spacer
    }

    // --- Badge --------------------------------------------------------------
    case 'badge':
      return 22;

    // --- Chip ---------------------------------------------------------------
    case 'chip':
      return 32;

    // --- Progress / Slider --------------------------------------------------
    case 'progress':
      return element.height ?? 8;
    case 'slider':
      return 32;

    // --- Checkbox / Radio / Toggle -----------------------------------------
    case 'checkbox':
    case 'radio':
      return 24;
    case 'toggle':
      return 28;

    // --- Card ---------------------------------------------------------------
    case 'card':
      // Cards have children; return a minimum and let layout compute actual
      return 0;

    // --- Navbar / Tabbar / Header ------------------------------------------
    case 'navbar':
    case 'header':
      return 56;
    case 'tabbar':
      return 56;

    // --- Table --------------------------------------------------------------
    case 'table': {
      const headerH = 44;
      const rows = Array.isArray(element.rows) ? element.rows.length : (element.rows ?? 3);
      return headerH + rows * 44;
    }

    // --- List / ListItem ---------------------------------------------------
    case 'list': {
      const items = Array.isArray(element.items) ? element.items.length : 0;
      return items * 52;
    }
    case 'list-item':
      return 52;

    // --- Map / Video / WebView ---------------------------------------------
    case 'map':
    case 'video':
    case 'webview':
      return element.height ?? 200;

    // --- Calendar ----------------------------------------------------------
    case 'calendar':
      return 320;

    // --- Chart -------------------------------------------------------------
    case 'chart':
      return element.height ?? 200;

    // --- Accordion ---------------------------------------------------------
    case 'accordion':
      return 48; // collapsed height per item

    // --- Tabs (content area) -----------------------------------------------
    case 'tabs':
      return 48; // tab bar portion; children add to this

    // --- Bottom sheet / Modal / Dialog (overlays) --------------------------
    case 'bottom-sheet':
    case 'modal':
    case 'dialog':
      return 0; // overlays don't contribute to document flow

    // --- FAB ---------------------------------------------------------------
    case 'fab':
      return 56;

    // --- Skeleton ----------------------------------------------------------
    case 'skeleton':
      return element.height ?? 20;

    // --- Icon --------------------------------------------------------------
    case 'icon':
      return element.size ?? 24;

    // --- Container / Stack / Row / Grid / ScrollView (layout containers) ---
    case 'container':
    case 'stack':
    case 'row':
    case 'grid':
    case 'scroll-view':
      // These are computed from children in the layout pass
      return 0;

    default:
      return 44; // reasonable fallback
  }
}

// ---- Helpers ---------------------------------------------------------------

function truncateLineWithEllipsis(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  const ellipsis = '\u2026';
  if (ctx.measureText(text).width <= maxWidth) return text;

  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >>> 1;
    if (ctx.measureText(text.slice(0, mid) + ellipsis).width <= maxWidth) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return text.slice(0, lo) + ellipsis;
}
