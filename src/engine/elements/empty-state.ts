import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';
import { drawIcon } from './icon';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const icon = el.icon;
  const title = el.title || '';
  const message = el.message || '';
  const action = el.action;

  const cx = box.x + box.width / 2;
  let cy = box.y + box.height / 2 - 40;

  // Icon (large, muted)
  if (icon) {
    drawIcon(canvas, icon, cx, cy, 48, colors['text-disabled']);
    cy += 40;
  }

  // Title
  if (title) {
    canvas.drawText(title, cx, cy, {
      font: getFontString('h4'),
      color: colors['text'],
      align: 'center',
      maxWidth: box.width - 48,
    });
    cy += 30;
  }

  // Message
  if (message) {
    canvas.drawText(message, cx, cy, {
      font: getFontString('body-sm'),
      color: colors['text-secondary'],
      align: 'center',
      maxWidth: box.width - 64,
      maxLines: 3,
    });
    cy += 40;
  }

  // Action button
  if (action) {
    const actionLabel = typeof action === 'string' ? action : action.label || 'Action';
    const btnWidth = Math.min(160, box.width - 64);
    const btnHeight = 40;
    const btnX = cx - btnWidth / 2;

    canvas.drawRect(btnX, cy, btnWidth, btnHeight, {
      fill: colors['accent'],
      radius: 8,
    });
    canvas.drawText(actionLabel, cx, cy + (btnHeight - 14) / 2, {
      font: `600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
      color: '#FFFFFF',
      align: 'center',
    });
  }
}
