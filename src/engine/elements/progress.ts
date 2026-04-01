import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const value = Math.max(0, Math.min(100, Number(el.value) || 0));
  const trackHeight = el.height || 6;
  const color = el.color ? (colors[el.color] || el.color) : colors['accent'];
  const label = el.label;

  let trackY = box.y;

  // Label above
  if (label) {
    canvas.drawText(label, box.x, box.y, {
      font: getFontString('caption'),
      color: colors['text-secondary'],
      maxWidth: box.width,
    });
    trackY = box.y + 20;
  }

  // Background track
  canvas.drawRect(box.x, trackY, box.width, trackHeight, {
    fill: colors['placeholder'],
    radius: trackHeight / 2,
  });

  // Filled bar
  const filledWidth = (value / 100) * box.width;
  if (filledWidth > 0) {
    canvas.drawRect(box.x, trackY, filledWidth, trackHeight, {
      fill: color,
      radius: trackHeight / 2,
    });
  }
}
