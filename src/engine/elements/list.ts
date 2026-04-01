import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { resolveRadius } from '../theme/tokens';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const bg = el.background ? (colors[el.background] || el.background) : undefined;
  const radius = resolveRadius(el.rounded);
  const dividers = el.dividers !== false; // default true
  const inset = el.inset === true;

  if (bg) {
    canvas.drawRect(box.x, box.y, box.width, box.height, {
      fill: bg,
      radius,
    });
  }

  // Draw dividers between children
  if (dividers && box.children.length > 1) {
    for (let i = 0; i < box.children.length - 1; i++) {
      const child = box.children[i];
      const dividerY = child.y + child.height;
      const dividerX = inset ? box.x + 52 : box.x;
      const dividerW = inset ? box.width - 52 : box.width;

      canvas.drawLine(dividerX, dividerY, dividerX + dividerW, dividerY, {
        color: colors['border'],
        width: 1,
      });
    }
  }
}
