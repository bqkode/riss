import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

/** Simple icon drawing using common icon shapes. */
const ICON_SHAPES: Record<string, (ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) => void> = {
  'arrow-left': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.moveTo(cx + s * 0.4, cy - s * 0.4); ctx.lineTo(cx - s * 0.3, cy); ctx.lineTo(cx + s * 0.4, cy + s * 0.4); ctx.stroke();
  },
  'arrow-right': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.moveTo(cx - s * 0.4, cy - s * 0.4); ctx.lineTo(cx + s * 0.3, cy); ctx.lineTo(cx - s * 0.4, cy + s * 0.4); ctx.stroke();
  },
  'chevron-down': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.moveTo(cx - s * 0.3, cy - s * 0.15); ctx.lineTo(cx, cy + s * 0.15); ctx.lineTo(cx + s * 0.3, cy - s * 0.15); ctx.stroke();
  },
  'chevron-right': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.moveTo(cx - s * 0.15, cy - s * 0.3); ctx.lineTo(cx + s * 0.15, cy); ctx.lineTo(cx - s * 0.15, cy + s * 0.3); ctx.stroke();
  },
  'close': (ctx, cx, cy, s) => {
    const d = s * 0.3;
    ctx.beginPath(); ctx.moveTo(cx - d, cy - d); ctx.lineTo(cx + d, cy + d); ctx.moveTo(cx + d, cy - d); ctx.lineTo(cx - d, cy + d); ctx.stroke();
  },
  'check': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.moveTo(cx - s * 0.3, cy); ctx.lineTo(cx - s * 0.05, cy + s * 0.25); ctx.lineTo(cx + s * 0.35, cy - s * 0.2); ctx.stroke();
  },
  'plus': (ctx, cx, cy, s) => {
    const d = s * 0.3;
    ctx.beginPath(); ctx.moveTo(cx, cy - d); ctx.lineTo(cx, cy + d); ctx.moveTo(cx - d, cy); ctx.lineTo(cx + d, cy); ctx.stroke();
  },
  'minus': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.moveTo(cx - s * 0.3, cy); ctx.lineTo(cx + s * 0.3, cy); ctx.stroke();
  },
  'search': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.arc(cx - s * 0.08, cy - s * 0.08, s * 0.25, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + s * 0.12, cy + s * 0.12); ctx.lineTo(cx + s * 0.35, cy + s * 0.35); ctx.stroke();
  },
  'menu': (ctx, cx, cy, s) => {
    const d = s * 0.3;
    for (const offset of [-d, 0, d]) {
      ctx.beginPath(); ctx.moveTo(cx - d, cy + offset); ctx.lineTo(cx + d, cy + offset); ctx.stroke();
    }
  },
  'home': (ctx, cx, cy, s) => {
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.35, cy); ctx.lineTo(cx, cy - s * 0.35); ctx.lineTo(cx + s * 0.35, cy);
    ctx.stroke();
    ctx.strokeRect(cx - s * 0.22, cy, s * 0.44, s * 0.3);
  },
  'heart': (ctx, cx, cy, s) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.3);
    ctx.bezierCurveTo(cx - s * 0.5, cy - s * 0.1, cx - s * 0.25, cy - s * 0.4, cx, cy - s * 0.1);
    ctx.bezierCurveTo(cx + s * 0.25, cy - s * 0.4, cx + s * 0.5, cy - s * 0.1, cx, cy + s * 0.3);
    ctx.stroke();
  },
  'star': (ctx, cx, cy, s) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const method = i === 0 ? 'moveTo' : 'lineTo';
      ctx[method](cx + Math.cos(angle) * s * 0.35, cy + Math.sin(angle) * s * 0.35);
    }
    ctx.closePath(); ctx.stroke();
  },
  'info': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.35, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.05); ctx.lineTo(cx, cy + s * 0.2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy - s * 0.18, 1.5, 0, Math.PI * 2); ctx.fill();
  },
  'warning': (ctx, cx, cy, s) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - s * 0.35); ctx.lineTo(cx + s * 0.35, cy + s * 0.3); ctx.lineTo(cx - s * 0.35, cy + s * 0.3);
    ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.08); ctx.lineTo(cx, cy + s * 0.1); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy + s * 0.2, 1.5, 0, Math.PI * 2); ctx.fill();
  },
  'error': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.35, 0, Math.PI * 2); ctx.stroke();
    const d = s * 0.2;
    ctx.beginPath(); ctx.moveTo(cx - d, cy - d); ctx.lineTo(cx + d, cy + d); ctx.moveTo(cx + d, cy - d); ctx.lineTo(cx - d, cy + d); ctx.stroke();
  },
  'settings': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.15, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.35, 0, Math.PI * 2); ctx.stroke();
  },
  'user': (ctx, cx, cy, s) => {
    ctx.beginPath(); ctx.arc(cx, cy - s * 0.12, s * 0.18, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy + s * 0.45, s * 0.32, Math.PI + 0.3, -0.3); ctx.stroke();
  },
  'bell': (ctx, cx, cy, s) => {
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.3, cy + s * 0.15);
    ctx.quadraticCurveTo(cx - s * 0.3, cy - s * 0.35, cx, cy - s * 0.35);
    ctx.quadraticCurveTo(cx + s * 0.3, cy - s * 0.35, cx + s * 0.3, cy + s * 0.15);
    ctx.lineTo(cx - s * 0.3, cy + s * 0.15);
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - s * 0.35, cy + s * 0.15); ctx.lineTo(cx + s * 0.35, cy + s * 0.15); ctx.stroke();
  },
};

export function drawIcon(
  canvas: RissCanvas,
  name: string,
  cx: number,
  cy: number,
  size: number,
  color: string,
): void {
  const rawCtx = canvas.ctx;
  rawCtx.save();
  rawCtx.strokeStyle = color;
  rawCtx.fillStyle = color;
  rawCtx.lineWidth = 1.5;
  rawCtx.lineCap = 'round';
  rawCtx.lineJoin = 'round';

  const shapeFn = ICON_SHAPES[name];
  if (shapeFn) {
    shapeFn(rawCtx, cx, cy, size);
  } else {
    // Fallback: draw small square with name
    rawCtx.strokeRect(cx - size * 0.35, cy - size * 0.35, size * 0.7, size * 0.7);
    rawCtx.restore();
    canvas.drawText(name, cx, cy - 4, {
      font: `400 8px -apple-system, sans-serif`,
      color,
      align: 'center',
      maxWidth: size,
    });
    return;
  }

  rawCtx.restore();
}

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const name = el.name || el.icon || 'info';
  const size = typeof el.size === 'number' ? el.size : 24;
  const color = el.color ? (colors[el.color] || el.color) : colors['text'];

  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  drawIcon(canvas, name, cx, cy, size, color);
}
