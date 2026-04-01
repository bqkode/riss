import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const checked = el.checked === true || el.value === true;
  const label = el.label || '';
  const trackWidth = 44;
  const trackHeight = 24;
  const thumbRadius = 10;
  const gap = 10;

  const trackY = box.y + (box.height - trackHeight) / 2;

  // Track
  const trackColor = checked ? colors['accent'] : (colors['border-strong'] || '#9CA3AF');
  canvas.drawRect(box.x, trackY, trackWidth, trackHeight, {
    fill: trackColor,
    radius: trackHeight / 2,
  });

  // Thumb
  const thumbCx = checked
    ? box.x + trackWidth - thumbRadius - 2
    : box.x + thumbRadius + 2;
  const thumbCy = trackY + trackHeight / 2;
  canvas.drawCircle(thumbCx, thumbCy, thumbRadius, {
    fill: '#FFFFFF',
  });

  // Label
  if (label) {
    canvas.drawText(label, box.x + trackWidth + gap, box.y + (box.height - 14) / 2, {
      font: getFontString('body-sm'),
      color: colors['text'],
      maxWidth: box.width - trackWidth - gap,
    });
  }
}
