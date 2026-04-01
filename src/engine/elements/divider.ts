import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const color = el.color ? (colors[el.color] || el.color) : colors['border'];
  const thickness = el.thickness || 1;
  const direction = el.direction || 'horizontal';

  if (direction === 'vertical') {
    const x = box.x + box.width / 2;
    canvas.drawLine(x, box.y, x, box.y + box.height, {
      color,
      width: thickness,
    });
  } else {
    const y = box.y + box.height / 2;
    canvas.drawLine(box.x, y, box.x + box.width, y, {
      color,
      width: thickness,
    });
  }
}
