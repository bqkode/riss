import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';
import { drawIcon } from './icon';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const checked = el.checked === true || el.value === true;
  const label = el.label || '';
  const boxSize = 18;
  const gap = 8;

  const checkY = box.y + (box.height - boxSize) / 2;

  if (checked) {
    // Filled box with check
    canvas.drawRect(box.x, checkY, boxSize, boxSize, {
      fill: colors['accent'],
      radius: 3,
    });
    drawIcon(canvas, 'check', box.x + boxSize / 2, checkY + boxSize / 2, boxSize * 0.7, '#FFFFFF');
  } else {
    // Empty border box
    canvas.drawRect(box.x, checkY, boxSize, boxSize, {
      stroke: colors['border-strong'],
      strokeWidth: 1.5,
      radius: 3,
    });
  }

  // Label
  if (label) {
    canvas.drawText(label, box.x + boxSize + gap, box.y + (box.height - 14) / 2, {
      font: getFontString('body-sm'),
      color: colors['text'],
      maxWidth: box.width - boxSize - gap,
    });
  }
}
