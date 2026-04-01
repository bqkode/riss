import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { resolveRadius } from '../theme/tokens';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const bg = el.background ? (colors[el.background] || el.background) : undefined;
  const radius = resolveRadius(el.rounded);

  if (bg) {
    canvas.drawRect(box.x, box.y, box.width, box.height, {
      fill: bg,
      radius,
    });
  }

  if (el.border) {
    const borderColor = typeof el.border === 'object' && el.border.color
      ? (colors[el.border.color] || el.border.color)
      : colors['border'];
    const borderWidth = typeof el.border === 'object' ? (el.border.width ?? 1) : 1;

    canvas.drawRect(box.x, box.y, box.width, box.height, {
      stroke: borderColor,
      strokeWidth: borderWidth,
      radius,
    });
  }
}
