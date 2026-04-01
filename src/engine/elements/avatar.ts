import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const radius = Math.min(box.width, box.height) / 2;
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const bg = el.color ? (colors[el.color] || el.color) : colors['accent'];
  const initials = el.initials || el.content || '?';

  // Circle background
  canvas.drawCircle(cx, cy, radius, {
    fill: bg,
  });

  // Initials centered
  const fontSize = Math.round(radius * 0.8);
  canvas.drawText(initials.slice(0, 2).toUpperCase(), cx, cy - fontSize * 0.55, {
    font: `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
    color: '#FFFFFF',
    align: 'center',
  });
}
