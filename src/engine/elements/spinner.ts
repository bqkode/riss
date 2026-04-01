import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const color = el.color ? (colors[el.color] || el.color) : colors['accent'];
  const size = Math.min(box.width, box.height);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const radius = size / 2 - 2;
  const lineWidth = Math.max(2, size * 0.1);

  const rawCtx = canvas.ctx;
  rawCtx.save();

  // Background circle (faint)
  rawCtx.beginPath();
  rawCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  rawCtx.strokeStyle = colors['placeholder'] || '#E5E7EB';
  rawCtx.lineWidth = lineWidth;
  rawCtx.stroke();

  // 3/4 arc (static spinner)
  rawCtx.beginPath();
  rawCtx.arc(cx, cy, radius, -Math.PI / 2, Math.PI);
  rawCtx.strokeStyle = color;
  rawCtx.lineWidth = lineWidth;
  rawCtx.lineCap = 'round';
  rawCtx.stroke();

  rawCtx.restore();
}
