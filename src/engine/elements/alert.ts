import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';
import { drawIcon } from './icon';

const VARIANT_CONFIG: Record<string, { icon: string; colorToken: string; bgAlpha: string }> = {
  'info':    { icon: 'info',    colorToken: 'accent',  bgAlpha: '15' },
  'success': { icon: 'check',   colorToken: 'success', bgAlpha: '15' },
  'warning': { icon: 'warning', colorToken: 'warning', bgAlpha: '15' },
  'error':   { icon: 'error',   colorToken: 'error',   bgAlpha: '15' },
};

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const variant = el.variant || 'info';
  const config = VARIANT_CONFIG[variant] || VARIANT_CONFIG['info'];
  const title = el.title || '';
  const message = el.message || el.content || '';
  const showIcon = el.icon !== false;
  const dismissable = el.dismissable === true;

  const variantColor = colors[config.colorToken] || config.colorToken;
  // Tinted background (use hex + alpha)
  const bgColor = variantColor + config.bgAlpha;
  const radius = 8;

  // Background
  canvas.drawRect(box.x, box.y, box.width, box.height, {
    fill: bgColor,
    radius,
  });

  // Left accent bar
  canvas.drawRect(box.x, box.y, 3, box.height, {
    fill: variantColor,
    radius: 0,
  });

  let contentX = box.x + 12;

  // Icon
  if (showIcon) {
    drawIcon(canvas, config.icon, box.x + 24, box.y + 20, 18, variantColor);
    contentX = box.x + 44;
  }

  // Title
  let textY = box.y + 12;
  if (title) {
    canvas.drawText(title, contentX, textY, {
      font: getFontString('h6'),
      color: colors['text'],
      maxWidth: box.width - (contentX - box.x) - (dismissable ? 36 : 12),
    });
    textY += 22;
  }

  // Message
  if (message) {
    canvas.drawText(message, contentX, textY, {
      font: getFontString('body-sm'),
      color: colors['text-secondary'],
      maxWidth: box.width - (contentX - box.x) - (dismissable ? 36 : 12),
      maxLines: 3,
    });
  }

  // Dismiss button
  if (dismissable) {
    canvas.drawText('\u00D7', box.x + box.width - 24, box.y + 10, {
      font: `400 18px -apple-system, sans-serif`,
      color: colors['text-secondary'],
    });
  }
}
