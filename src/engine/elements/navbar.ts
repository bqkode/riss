import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';
import { drawIcon } from './icon';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const title = el.title || '';
  const bg = el.background ? (colors[el.background] || el.background) : colors['background'];
  const barHeight = 56;

  // Background
  canvas.drawRect(box.x, box.y, box.width, barHeight, {
    fill: bg,
  });

  // Bottom border
  canvas.drawLine(box.x, box.y + barHeight, box.x + box.width, box.y + barHeight, {
    color: colors['border'],
    width: 1,
  });

  // Leading element
  const leading = el.leading;
  if (leading && typeof leading === 'string') {
    const iconMatch = leading.match(/^icon:(.+)$/);
    if (iconMatch) {
      drawIcon(canvas, iconMatch[1], box.x + 24, box.y + barHeight / 2, 22, colors['text']);
    } else {
      canvas.drawText(leading, box.x + 16, box.y + (barHeight - 14) / 2, {
        font: getFontString('body-sm'),
        color: colors['text'],
      });
    }
  }

  // Title centered
  if (title) {
    canvas.drawText(title, box.x + box.width / 2, box.y + (barHeight - 18) / 2, {
      font: getFontString('h5'),
      color: colors['text'],
      align: 'center',
      maxWidth: box.width - 120,
    });
  }

  // Trailing element
  const trailing = el.trailing;
  if (trailing && typeof trailing === 'string') {
    const iconMatch = trailing.match(/^icon:(.+)$/);
    if (iconMatch) {
      drawIcon(canvas, iconMatch[1], box.x + box.width - 24, box.y + barHeight / 2, 22, colors['text']);
    } else {
      canvas.drawText(trailing, box.x + box.width - 16, box.y + (barHeight - 14) / 2, {
        font: getFontString('body-sm'),
        color: colors['accent'],
        align: 'right',
      });
    }
  }
}
