import { ELEVATION_SHADOWS } from './theme/tokens';

interface RectOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed';
  radius?: number;
  shadow?: string; // key from ELEVATION_SHADOWS or raw shadow string
}

interface TextOptions {
  font: string;
  color: string;
  align?: 'left' | 'center' | 'right';
  maxWidth?: number;
  maxLines?: number;
  lineHeight?: number;
}

interface LineOptions {
  color: string;
  width?: number;
  style?: 'solid' | 'dashed';
}

interface CircleOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

/**
 * Parse a CSS-like shadow string into canvas shadow properties.
 * Supports: "offsetX offsetY blur rgba(...)" or "offsetX offsetY blur spread rgba(...)"
 * For multi-shadow strings (comma-separated), only the first shadow is used.
 */
function parseShadow(shadow: string): {
  offsetX: number;
  offsetY: number;
  blur: number;
  color: string;
} {
  if (!shadow || shadow === 'none') {
    return { offsetX: 0, offsetY: 0, blur: 0, color: 'transparent' };
  }

  // Take the first shadow if comma-separated
  const firstShadow = shadow.split(/,(?![^(]*\))/).map((s) => s.trim())[0];

  // Extract rgba/rgb color
  const colorMatch = firstShadow.match(/rgba?\([^)]+\)/);
  const color = colorMatch ? colorMatch[0] : 'rgba(0,0,0,0.1)';

  // Remove the color to parse numeric values
  const numericPart = firstShadow.replace(/rgba?\([^)]+\)/, '').trim();
  const nums = numericPart.split(/\s+/).map(parseFloat).filter((n) => !isNaN(n));

  return {
    offsetX: nums[0] ?? 0,
    offsetY: nums[1] ?? 0,
    blur: nums[2] ?? 0,
    color,
  };
}

export class RissCanvas {
  public ctx: CanvasRenderingContext2D;
  private dpr: number;

  constructor(canvas: HTMLCanvasElement) {
    this.dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D canvas context');
    this.ctx = ctx;
  }

  /**
   * Setup canvas for HiDPI rendering.
   * Sets the canvas buffer to logical size * DPR and scales the context.
   */
  setupSize(width: number, height: number): void {
    const canvas = this.ctx.canvas;
    canvas.width = width * this.dpr;
    canvas.height = height * this.dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(this.dpr, this.dpr);
  }

  /**
   * Draw a filled/stroked rectangle with optional border radius and shadow.
   */
  drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    options: RectOptions,
  ): void {
    const ctx = this.ctx;
    const {
      fill,
      stroke,
      strokeWidth = 1,
      strokeStyle = 'solid',
      radius = 0,
      shadow,
    } = options;

    ctx.save();

    // Apply shadow
    if (shadow) {
      const resolved = ELEVATION_SHADOWS[shadow] ?? shadow;
      const s = parseShadow(resolved);
      ctx.shadowOffsetX = s.offsetX;
      ctx.shadowOffsetY = s.offsetY;
      ctx.shadowBlur = s.blur;
      ctx.shadowColor = s.color;
    }

    // Build path (rounded or plain rect)
    ctx.beginPath();
    if (radius > 0) {
      this.roundedRectPath(x, y, w, h, radius);
    } else {
      ctx.rect(x, y, w, h);
    }

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    // Reset shadow before stroke so it doesn't double-apply
    if (shadow) {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
    }

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      if (strokeStyle === 'dashed') {
        ctx.setLineDash([4, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  /**
   * Draw text with font, color, alignment, optional wrapping and truncation.
   * Returns the measured bounding box of the rendered text.
   */
  drawText(
    text: string,
    x: number,
    y: number,
    options: TextOptions,
  ): { width: number; height: number } {
    const ctx = this.ctx;
    const {
      font,
      color,
      align = 'left',
      maxWidth,
      maxLines,
      lineHeight: lhOverride,
    } = options;

    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';

    // Parse line height from font if not overridden
    const fontSize = parseFontSize(font);
    const lineHeight = lhOverride ?? Math.round(fontSize * 1.5);

    // If no max width, draw single line
    if (!maxWidth) {
      ctx.fillText(text, x, y);
      const m = ctx.measureText(text);
      ctx.restore();
      return { width: m.width, height: lineHeight };
    }

    // Word wrap
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
        if (maxLines && lines.length >= maxLines) {
          break;
        }
      } else {
        currentLine = testLine;
      }
    }

    // Handle remaining text
    if (maxLines && lines.length >= maxLines) {
      // Truncate last line with ellipsis
      const lastLine = lines[lines.length - 1];
      lines[lines.length - 1] = truncateWithEllipsis(ctx, lastLine, maxWidth);
    } else if (currentLine) {
      lines.push(currentLine);
    }

    // If we hit maxLines exactly and there was remaining text, truncate last line
    if (maxLines && lines.length === maxLines && currentLine && lines[lines.length - 1] !== currentLine) {
      lines[lines.length - 1] = truncateWithEllipsis(ctx, lines[lines.length - 1], maxWidth);
    }

    let maxW = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];
      ctx.fillText(lineText, x, y + i * lineHeight, maxWidth);
      maxW = Math.max(maxW, ctx.measureText(lineText).width);
    }

    ctx.restore();
    return { width: Math.min(maxW, maxWidth), height: lines.length * lineHeight };
  }

  /**
   * Draw a straight line.
   */
  drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    options: LineOptions,
  ): void {
    const ctx = this.ctx;
    const { color, width = 1, style = 'solid' } = options;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    if (style === 'dashed') {
      ctx.setLineDash([4, 4]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  /**
   * Draw a circle with optional fill and stroke.
   */
  drawCircle(
    cx: number,
    cy: number,
    radius: number,
    options: CircleOptions,
  ): void {
    const ctx = this.ctx;
    const { fill, stroke, strokeWidth = 1 } = options;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Execute a drawing function clipped to a rectangular region.
   */
  clip(x: number, y: number, w: number, h: number, fn: () => void): void {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(x, y, w, h);
    this.ctx.clip();
    fn();
    this.ctx.restore();
  }

  /**
   * Measure the dimensions of a text string for a given font.
   */
  measureText(text: string, font: string): { width: number; height: number } {
    const ctx = this.ctx;
    ctx.save();
    ctx.font = font;
    const m = ctx.measureText(text);
    ctx.restore();
    const fontSize = parseFontSize(font);
    return { width: m.width, height: Math.round(fontSize * 1.5) };
  }

  /**
   * Draw a dashed border rectangle (used for role outlines).
   */
  drawDashedRect(
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    dashPattern: number[] = [6, 3],
  ): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash(dashPattern);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  /**
   * Draw a small badge (pill-shaped label) at the given position.
   */
  drawBadge(text: string, x: number, y: number, bgColor: string): void {
    const ctx = this.ctx;
    const font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.save();
    ctx.font = font;
    const textWidth = ctx.measureText(text).width;
    const paddingX = 6;
    const paddingY = 2;
    const width = textWidth + paddingX * 2;
    const height = 18;
    const radius = height / 2;

    // Draw pill background
    ctx.beginPath();
    this.roundedRectPath(x, y, width, height, radius);
    ctx.fillStyle = bgColor;
    ctx.fill();

    // Draw text centered in pill
    ctx.fillStyle = '#FFFFFF';
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);

    ctx.restore();
  }

  /**
   * Clear a rectangular area and optionally fill with a color.
   */
  clear(x: number, y: number, w: number, h: number, color: string): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.clearRect(x, y, w, h);
    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
    ctx.restore();
  }

  // ---- Private helpers ----

  /**
   * Trace a rounded rectangle path using arcTo.
   */
  private roundedRectPath(
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ): void {
    const ctx = this.ctx;
    const clampedR = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + clampedR, y);
    ctx.arcTo(x + w, y, x + w, y + h, clampedR);
    ctx.arcTo(x + w, y + h, x, y + h, clampedR);
    ctx.arcTo(x, y + h, x, y, clampedR);
    ctx.arcTo(x, y, x + w, y, clampedR);
    ctx.closePath();
  }
}

// ---- Module-level helpers ----

/**
 * Parse the font size (in px) from a CSS font string.
 */
function parseFontSize(font: string): number {
  const match = font.match(/(\d+(?:\.\d+)?)px/);
  return match ? parseFloat(match[1]) : 16;
}

/**
 * Truncate a string so it fits within maxWidth when rendered, appending "...".
 */
function truncateWithEllipsis(
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
