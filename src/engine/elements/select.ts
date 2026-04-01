import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';
import { drawIcon } from './icon';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const label = el.label;
  const placeholder = el.placeholder || 'Select...';
  const value = el.value;
  const options: Array<{ label: string; value: string }> = el.options || [];
  const error = el.error;
  const radius = 8;
  const inputHeight = 44;

  let currentY = box.y;

  // Label
  if (label) {
    const required = el.required === true;
    const labelText = required ? `${label} *` : label;
    canvas.drawText(labelText, box.x, currentY, {
      font: getFontString('label'),
      color: error ? colors['error'] : colors['text-secondary'],
      maxWidth: box.width,
    });
    currentY += 20;
  }

  // Select box
  const borderColor = error ? colors['error'] : colors['border'];
  canvas.drawRect(box.x, currentY, box.width, inputHeight, {
    stroke: borderColor,
    strokeWidth: 1,
    radius,
  });

  // Selected text or placeholder
  const selectedOption = options.find((o) => o.value === value);
  const displayText = selectedOption ? selectedOption.label : (value || placeholder);
  const textColor = value ? colors['text'] : colors['text-disabled'];

  canvas.drawText(displayText, box.x + 12, currentY + (inputHeight - 14) / 2, {
    font: getFontString('body-sm'),
    color: textColor,
    maxWidth: box.width - 48,
  });

  // Chevron down icon
  drawIcon(canvas, 'chevron-down', box.x + box.width - 24, currentY + inputHeight / 2, 18, colors['text-secondary']);

  currentY += inputHeight + 4;

  // Error text
  if (error) {
    canvas.drawText(error, box.x, currentY, {
      font: getFontString('caption'),
      color: colors['error'],
      maxWidth: box.width,
    });
  }
}
