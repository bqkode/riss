import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const variant = el.variant || 'filled';
  const label = el.label || el.content || '';
  const removable = el.removable === true;
  const radius = box.height / 2;
  const chipColor = el.color ? (colors[el.color] || el.color) : colors['accent'];

  if (variant === 'outlined') {
    canvas.drawRect(box.x, box.y, box.width, box.height, {
      stroke: chipColor,
      strokeWidth: 1,
      radius,
    });
    canvas.drawText(label, box.x + 12, box.y + (box.height - 12) / 2, {
      font: getFontString('caption'),
      color: chipColor,
      maxWidth: box.width - (removable ? 32 : 24),
    });
  } else {
    canvas.drawRect(box.x, box.y, box.width, box.height, {
      fill: chipColor,
      radius,
    });
    canvas.drawText(label, box.x + 12, box.y + (box.height - 12) / 2, {
      font: getFontString('caption'),
      color: '#FFFFFF',
      maxWidth: box.width - (removable ? 32 : 24),
    });
  }

  // Remove icon
  if (removable) {
    const xPos = box.x + box.width - 18;
    const yPos = box.y + box.height / 2 - 5;
    const textColor = variant === 'outlined' ? chipColor : '#FFFFFF';
    canvas.drawText('\u00D7', xPos, yPos, {
      font: `400 14px -apple-system, sans-serif`,
      color: textColor,
    });
  }
}
