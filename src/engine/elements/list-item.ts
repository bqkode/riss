import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';
import { drawIcon } from './icon';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const title = el.title || '';
  const subtitle = el.subtitle || '';
  const leading = el.leading;
  const trailing = el.trailing;
  const size = el.size || 'md';

  const sizeHeights: Record<string, number> = { 'sm': 40, 'md': 52, 'lg': 68 };
  const itemHeight = sizeHeights[size] || 52;

  let contentX = box.x + 16;
  const centerY = box.y + itemHeight / 2;

  // Leading area
  if (leading && typeof leading === 'string') {
    const leadingSize = 40;

    if (leading === 'avatar') {
      // Draw avatar circle placeholder
      const avatarR = size === 'sm' ? 14 : 18;
      canvas.drawCircle(box.x + 16 + avatarR, centerY, avatarR, {
        fill: colors['placeholder'],
      });
      contentX = box.x + 16 + avatarR * 2 + 12;
    } else if (leading.startsWith('icon:')) {
      const iconName = leading.slice(5);
      drawIcon(canvas, iconName, box.x + 28, centerY, 20, colors['text-secondary']);
      contentX = box.x + 52;
    } else if (leading === 'checkbox') {
      const cbSize = 18;
      canvas.drawRect(box.x + 16, centerY - cbSize / 2, cbSize, cbSize, {
        stroke: colors['border-strong'],
        strokeWidth: 1.5,
        radius: 3,
      });
      contentX = box.x + 46;
    } else if (leading === 'image') {
      const imgSize = size === 'lg' ? 48 : 40;
      canvas.drawRect(box.x + 16, centerY - imgSize / 2, imgSize, imgSize, {
        fill: colors['placeholder'],
        radius: 4,
      });
      contentX = box.x + 16 + imgSize + 12;
    }
  }

  // Title and subtitle
  const trailingWidth = trailing ? 60 : 16;
  const maxTextWidth = box.x + box.width - contentX - trailingWidth;

  if (subtitle) {
    const titleY = centerY - 18;
    canvas.drawText(title, contentX, titleY, {
      font: getFontString('body-sm'),
      color: colors['text'],
      maxWidth: maxTextWidth,
    });
    canvas.drawText(subtitle, contentX, titleY + 20, {
      font: getFontString('caption'),
      color: colors['text-secondary'],
      maxWidth: maxTextWidth,
    });
  } else {
    canvas.drawText(title, contentX, centerY - 7, {
      font: getFontString('body-sm'),
      color: colors['text'],
      maxWidth: maxTextWidth,
    });
  }

  // Trailing area
  if (trailing && typeof trailing === 'string') {
    if (trailing.startsWith('icon:')) {
      const iconName = trailing.slice(5);
      drawIcon(canvas, iconName, box.x + box.width - 24, centerY, 18, colors['text-secondary']);
    } else if (trailing === 'toggle') {
      const trackW = 36;
      const trackH = 20;
      const tx = box.x + box.width - 16 - trackW;
      const ty = centerY - trackH / 2;
      canvas.drawRect(tx, ty, trackW, trackH, {
        fill: colors['border-strong'],
        radius: trackH / 2,
      });
      canvas.drawCircle(tx + 10, centerY, 8, {
        fill: '#FFFFFF',
      });
    } else if (trailing.startsWith('badge:')) {
      const badgeText = trailing.slice(6);
      canvas.drawBadge(badgeText, box.x + box.width - 16 - 24, centerY - 9, colors['accent']);
    } else if (trailing.startsWith('text:')) {
      const textValue = trailing.slice(5);
      canvas.drawText(textValue, box.x + box.width - 16, centerY - 7, {
        font: getFontString('body-sm'),
        color: colors['text-secondary'],
        align: 'right',
      });
    }
  }
}
