import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { resolveRadius } from '../theme/tokens';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const bg = el.background ? (colors[el.background] || el.background) : undefined;
  const radius = resolveRadius(el.rounded);

  if (bg) {
    canvas.drawRect(box.x, box.y, box.width, box.height, {
      fill: bg,
      radius,
    });
  }

  // Draw scroll indicator
  const direction = el.direction || 'vertical';
  const indicatorColor = colors['border-strong'] || '#9CA3AF';
  const indicatorThickness = 3;
  const indicatorLength = Math.min(box.height * 0.3, 60);

  if (direction === 'vertical') {
    // Right-side scroll bar
    const barX = box.x + box.width - indicatorThickness - 2;
    const barY = box.y + 4;
    canvas.drawRect(barX, barY, indicatorThickness, indicatorLength, {
      fill: indicatorColor,
      radius: indicatorThickness / 2,
    });
  } else {
    // Bottom scroll bar
    const barX = box.x + 4;
    const barY = box.y + box.height - indicatorThickness - 2;
    const hLength = Math.min(box.width * 0.3, 60);
    canvas.drawRect(barX, barY, hLength, indicatorThickness, {
      fill: indicatorColor,
      radius: indicatorThickness / 2,
    });
  }
}
