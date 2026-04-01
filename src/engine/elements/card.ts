import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;
  const variant = el.variant || 'outlined';
  const radius = 8; // md radius

  switch (variant) {
    case 'outlined':
      canvas.drawRect(box.x, box.y, box.width, box.height, {
        fill: colors['background'],
        stroke: colors['border'],
        strokeWidth: 1,
        radius,
      });
      break;

    case 'elevated':
      canvas.drawRect(box.x, box.y, box.width, box.height, {
        fill: colors['surface-raised'] || colors['background'],
        radius,
        shadow: 'md',
      });
      break;

    case 'filled':
      canvas.drawRect(box.x, box.y, box.width, box.height, {
        fill: colors['surface'],
        radius,
      });
      break;

    default:
      canvas.drawRect(box.x, box.y, box.width, box.height, {
        fill: colors['background'],
        stroke: colors['border'],
        strokeWidth: 1,
        radius,
      });
      break;
  }
}
