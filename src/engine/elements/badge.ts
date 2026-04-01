import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const bg = el.color ? (colors[el.color] || el.color) : colors['accent'];
  const content = el.content;

  if (content) {
    // Pill with text
    canvas.drawRect(box.x, box.y, box.width, box.height, {
      fill: bg,
      radius: box.height / 2,
    });
    canvas.drawText(String(content), box.x + box.width / 2, box.y + (box.height - 11) / 2, {
      font: `600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
      color: '#FFFFFF',
      align: 'center',
    });
  } else {
    // Small dot
    const dotSize = 8;
    canvas.drawCircle(box.x + dotSize / 2, box.y + dotSize / 2, dotSize / 2, {
      fill: bg,
    });
  }
}
