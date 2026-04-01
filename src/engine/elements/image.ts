import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;
  const radius = el.rounded === 'full' ? Math.min(box.width, box.height) / 2 : (el.rounded ? 8 : 0);

  // Placeholder background
  canvas.drawRect(box.x, box.y, box.width, box.height, {
    fill: colors['placeholder'],
    radius,
  });

  // Mountain/sun icon in center
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const iconSize = Math.min(box.width, box.height, 48) * 0.4;
  const iconColor = colors['text-secondary'];

  // Sun (small circle upper-right of center)
  canvas.drawCircle(cx + iconSize * 0.3, cy - iconSize * 0.4, iconSize * 0.18, {
    fill: iconColor,
  });

  // Mountain (triangle)
  const rawCtx = canvas.ctx;
  rawCtx.save();
  rawCtx.fillStyle = iconColor;
  rawCtx.beginPath();
  rawCtx.moveTo(cx - iconSize * 0.6, cy + iconSize * 0.5);
  rawCtx.lineTo(cx, cy - iconSize * 0.2);
  rawCtx.lineTo(cx + iconSize * 0.6, cy + iconSize * 0.5);
  rawCtx.closePath();
  rawCtx.fill();
  rawCtx.restore();

  // Label text below icon
  const label = el.label || el.alt || '';
  if (label) {
    canvas.drawText(label, cx, cy + iconSize * 0.7, {
      font: getFontString('caption'),
      color: colors['text-secondary'],
      align: 'center',
      maxWidth: box.width - 8,
    });
  }
}
