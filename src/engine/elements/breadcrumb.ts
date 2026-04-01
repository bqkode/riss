import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const items: string[] = el.items || [];
  const separator = el.separator || '/';

  if (items.length === 0) return;

  let currentX = box.x;
  const font = getFontString('body-sm');
  const boldFont = getFontString('h6');
  const sepFont = getFontString('body-sm');
  const textY = box.y + (box.height - 14) / 2;

  for (let i = 0; i < items.length; i++) {
    const isLast = i === items.length - 1;
    const itemFont = isLast ? boldFont : font;
    const itemColor = isLast ? colors['text'] : colors['text-secondary'];

    const measured = canvas.measureText(items[i], itemFont);
    canvas.drawText(items[i], currentX, textY, {
      font: itemFont,
      color: itemColor,
    });
    currentX += measured.width;

    if (!isLast) {
      const sepMeasured = canvas.measureText(` ${separator} `, sepFont);
      canvas.drawText(` ${separator} `, currentX, textY, {
        font: sepFont,
        color: colors['text-disabled'],
      });
      currentX += sepMeasured.width;
    }
  }
}
