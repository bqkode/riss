import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  if (el.title) {
    canvas.drawText(el.title, box.x, box.y, {
      font: getFontString('label'),
      color: colors['text-secondary'],
      maxWidth: box.width,
    });
  }
}
