import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const label = el.label;
  const options: Array<{ label: string; value: string }> = el.options || [];
  const selected = el.value;
  const direction = el.direction || 'vertical';
  const circleRadius = 8;
  const gap = 8;
  const itemSpacing = direction === 'vertical' ? 28 : 0;

  let currentY = box.y;
  let currentX = box.x;

  // Group label
  if (label) {
    canvas.drawText(label, box.x, currentY, {
      font: getFontString('label'),
      color: colors['text-secondary'],
      maxWidth: box.width,
    });
    currentY += 22;
  }

  for (const opt of options) {
    const isSelected = opt.value === selected;
    const cx = currentX + circleRadius;
    const cy = currentY + circleRadius;

    // Outer circle
    canvas.drawCircle(cx, cy, circleRadius, {
      stroke: isSelected ? colors['accent'] : colors['border-strong'],
      strokeWidth: 1.5,
    });

    // Inner dot if selected
    if (isSelected) {
      canvas.drawCircle(cx, cy, circleRadius * 0.45, {
        fill: colors['accent'],
      });
    }

    // Option label
    canvas.drawText(opt.label || opt.value, currentX + circleRadius * 2 + gap, currentY + circleRadius - 7, {
      font: getFontString('body-sm'),
      color: colors['text'],
      maxWidth: box.width - circleRadius * 2 - gap,
    });

    if (direction === 'vertical') {
      currentY += itemSpacing;
    } else {
      const textWidth = canvas.measureText(opt.label || opt.value, getFontString('body-sm')).width;
      currentX += circleRadius * 2 + gap + textWidth + 20;
    }
  }
}
