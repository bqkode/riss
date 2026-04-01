import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const min = Number(el.min) || 0;
  const max = Number(el.max) || 100;
  const value = Math.max(min, Math.min(max, Number(el.value) || 0));
  const label = el.label;
  const showValue = el['show-value'] === true;
  const color = el.color ? (colors[el.color] || el.color) : colors['accent'];

  const trackHeight = 4;
  const thumbRadius = 8;
  let currentY = box.y;

  // Label
  if (label) {
    const labelStr = showValue ? `${label}: ${value}` : label;
    canvas.drawText(labelStr, box.x, currentY, {
      font: getFontString('caption'),
      color: colors['text-secondary'],
      maxWidth: box.width,
    });
    currentY += 20;
  } else if (showValue) {
    canvas.drawText(String(value), box.x, currentY, {
      font: getFontString('caption'),
      color: colors['text-secondary'],
    });
    currentY += 20;
  }

  const trackY = currentY + thumbRadius - trackHeight / 2;
  const trackWidth = box.width;

  // Background track
  canvas.drawRect(box.x, trackY, trackWidth, trackHeight, {
    fill: colors['placeholder'],
    radius: trackHeight / 2,
  });

  // Filled portion
  const ratio = (value - min) / (max - min);
  const filledWidth = ratio * trackWidth;
  if (filledWidth > 0) {
    canvas.drawRect(box.x, trackY, filledWidth, trackHeight, {
      fill: color,
      radius: trackHeight / 2,
    });
  }

  // Thumb circle
  const thumbCx = box.x + filledWidth;
  const thumbCy = trackY + trackHeight / 2;
  canvas.drawCircle(thumbCx, thumbCy, thumbRadius, {
    fill: color,
  });
  canvas.drawCircle(thumbCx, thumbCy, thumbRadius - 2, {
    fill: '#FFFFFF',
  });
  canvas.drawCircle(thumbCx, thumbCy, thumbRadius - 4, {
    fill: color,
  });
}
