import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';
import { drawIcon } from './icon';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const color = el.color ? (colors[el.color] || el.color) : colors['placeholder'];
  const label = el.label || '';
  const icon = el.icon;
  const radius = el.rounded ? 8 : 0;

  // Filled rectangle
  canvas.drawRect(box.x, box.y, box.width, box.height, {
    fill: color,
    radius,
  });

  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  // Icon centered
  if (icon) {
    drawIcon(canvas, icon, cx, cy - (label ? 10 : 0), 32, colors['text-secondary']);
  }

  // Label centered below icon
  if (label) {
    canvas.drawText(label, cx, cy + (icon ? 12 : -6), {
      font: getFontString('caption'),
      color: colors['text-secondary'],
      align: 'center',
      maxWidth: box.width - 16,
    });
  }
}
