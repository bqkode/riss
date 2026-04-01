import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';
import { drawIcon } from './icon';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const items: Array<{ label: string; icon?: string }> = el.items || [];
  const active = el.active ?? 0;
  const barHeight = 56;
  const bg = el.background ? (colors[el.background] || el.background) : colors['background'];

  // Background
  canvas.drawRect(box.x, box.y, box.width, barHeight, {
    fill: bg,
  });

  // Top border
  canvas.drawLine(box.x, box.y, box.x + box.width, box.y, {
    color: colors['border'],
    width: 1,
  });

  if (items.length === 0) return;

  const itemWidth = box.width / items.length;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isActive = i === active;
    const color = isActive ? colors['accent'] : colors['text-secondary'];
    const cx = box.x + itemWidth * i + itemWidth / 2;

    // Icon
    if (item.icon) {
      drawIcon(canvas, item.icon, cx, box.y + 18, 20, color);
    }

    // Label
    if (item.label) {
      canvas.drawText(item.label, cx, box.y + (item.icon ? 32 : 20), {
        font: `500 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
        color,
        align: 'center',
        maxWidth: itemWidth - 8,
      });
    }
  }
}
