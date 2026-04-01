import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';
import { drawIcon } from './icon';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const variant = el.variant || 'outlined';
  const label = el.label;
  const placeholder = el.placeholder || '';
  const value = el.value || '';
  const helper = el.helper;
  const error = el.error;
  const required = el.required === true;
  const iconLeading = el['icon-leading'];
  const iconTrailing = el['icon-trailing'];

  let currentY = box.y;
  const inputHeight = 44;
  const radius = 8;

  // Label
  if (label) {
    const labelText = required ? `${label} *` : label;
    canvas.drawText(labelText, box.x, currentY, {
      font: getFontString('label'),
      color: error ? colors['error'] : colors['text-secondary'],
      maxWidth: box.width,
    });
    currentY += 20;
  }

  // Input field
  const borderColor = error ? colors['error'] : colors['border'];

  switch (variant) {
    case 'outlined':
      canvas.drawRect(box.x, currentY, box.width, inputHeight, {
        stroke: borderColor,
        strokeWidth: 1,
        radius,
      });
      break;

    case 'filled':
      canvas.drawRect(box.x, currentY, box.width, inputHeight, {
        fill: colors['surface'],
        radius,
      });
      break;

    case 'underline':
      canvas.drawLine(box.x, currentY + inputHeight, box.x + box.width, currentY + inputHeight, {
        color: borderColor,
        width: 1,
      });
      break;
  }

  // Leading icon
  let textStartX = box.x + 12;
  if (iconLeading) {
    drawIcon(canvas, iconLeading, box.x + 24, currentY + inputHeight / 2, 18, colors['text-secondary']);
    textStartX = box.x + 42;
  }

  // Value or placeholder text
  const displayText = value || placeholder;
  const textColor = value ? colors['text'] : colors['text-disabled'];
  canvas.drawText(displayText, textStartX, currentY + (inputHeight - 14) / 2, {
    font: getFontString('body-sm'),
    color: textColor,
    maxWidth: box.width - (textStartX - box.x) - (iconTrailing ? 36 : 12),
  });

  // Trailing icon
  if (iconTrailing) {
    drawIcon(canvas, iconTrailing, box.x + box.width - 24, currentY + inputHeight / 2, 18, colors['text-secondary']);
  }

  currentY += inputHeight + 4;

  // Helper or error text
  if (error) {
    canvas.drawText(error, box.x, currentY, {
      font: getFontString('caption'),
      color: colors['error'],
      maxWidth: box.width,
    });
  } else if (helper) {
    canvas.drawText(helper, box.x, currentY, {
      font: getFontString('caption'),
      color: colors['text-secondary'],
      maxWidth: box.width,
    });
  }
}
