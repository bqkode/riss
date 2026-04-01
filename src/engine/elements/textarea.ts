import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString, getLineHeight } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const label = el.label;
  const placeholder = el.placeholder || '';
  const value = el.value || '';
  const helper = el.helper;
  const error = el.error;
  const required = el.required === true;
  const rows = el.rows || 4;
  const lineH = getLineHeight('body-sm');
  const textareaHeight = rows * lineH + 16;
  const radius = 8;

  let currentY = box.y;

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

  // Textarea border
  const borderColor = error ? colors['error'] : colors['border'];
  canvas.drawRect(box.x, currentY, box.width, textareaHeight, {
    stroke: borderColor,
    strokeWidth: 1,
    radius,
  });

  // Value or placeholder
  const displayText = value || placeholder;
  const textColor = value ? colors['text'] : colors['text-disabled'];
  canvas.drawText(displayText, box.x + 12, currentY + 8, {
    font: getFontString('body-sm'),
    color: textColor,
    maxWidth: box.width - 24,
    maxLines: rows,
    lineHeight: lineH,
  });

  currentY += textareaHeight + 4;

  // Helper or error
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
