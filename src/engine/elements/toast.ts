import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

const VARIANT_COLORS: Record<string, string> = {
  'info': 'accent',
  'success': 'success',
  'warning': 'warning',
  'error': 'error',
};

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const message = el.message || el.content || '';
  const variant = el.variant || 'info';
  const action = el.action;
  const radius = 8;

  const accentToken = VARIANT_COLORS[variant] || 'accent';
  const accentColor = colors[accentToken] || accentToken;

  // Toast background
  canvas.drawRect(box.x, box.y, box.width, box.height, {
    fill: colors['surface-raised'] || colors['background'],
    radius,
    shadow: 'md',
  });

  // Left accent strip
  canvas.drawRect(box.x, box.y, 3, box.height, {
    fill: accentColor,
  });

  // Message text
  const textMaxWidth = action ? box.width - 100 : box.width - 24;
  canvas.drawText(message, box.x + 16, box.y + (box.height - 14) / 2, {
    font: getFontString('body-sm'),
    color: colors['text'],
    maxWidth: textMaxWidth,
  });

  // Action button
  if (action) {
    const actionLabel = typeof action === 'string' ? action : action.label || 'Action';
    canvas.drawText(actionLabel, box.x + box.width - 16, box.y + (box.height - 14) / 2, {
      font: `600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
      color: accentColor,
      align: 'right',
    });
  }
}
