import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const items: Array<{ label: string }> = el.items || el.tabs || [];
  const active = el.active ?? 0;
  const variant = el.variant || 'underline';
  const tabHeight = 40;

  if (items.length === 0) return;

  // Bottom line for underline variant
  if (variant === 'underline') {
    canvas.drawLine(box.x, box.y + tabHeight, box.x + box.width, box.y + tabHeight, {
      color: colors['border'],
      width: 1,
    });
  }

  const tabWidth = Math.min(box.width / items.length, 120);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const isActive = i === active;
    const tx = box.x + tabWidth * i;
    const label = item.label || String(item);

    switch (variant) {
      case 'underline':
        canvas.drawText(label, tx + tabWidth / 2, box.y + (tabHeight - 14) / 2, {
          font: getFontString(isActive ? 'h6' : 'body-sm'),
          color: isActive ? colors['accent'] : colors['text-secondary'],
          align: 'center',
          maxWidth: tabWidth - 8,
        });
        if (isActive) {
          canvas.drawLine(tx + 4, box.y + tabHeight, tx + tabWidth - 4, box.y + tabHeight, {
            color: colors['accent'],
            width: 2,
          });
        }
        break;

      case 'filled':
        if (isActive) {
          canvas.drawRect(tx + 2, box.y + 4, tabWidth - 4, tabHeight - 8, {
            fill: colors['surface'],
            radius: 6,
          });
        }
        canvas.drawText(label, tx + tabWidth / 2, box.y + (tabHeight - 14) / 2, {
          font: getFontString(isActive ? 'h6' : 'body-sm'),
          color: isActive ? colors['text'] : colors['text-secondary'],
          align: 'center',
          maxWidth: tabWidth - 12,
        });
        break;

      case 'pill':
        if (isActive) {
          canvas.drawRect(tx + 2, box.y + 6, tabWidth - 4, tabHeight - 12, {
            fill: colors['accent'],
            radius: (tabHeight - 12) / 2,
          });
        }
        canvas.drawText(label, tx + tabWidth / 2, box.y + (tabHeight - 14) / 2, {
          font: getFontString(isActive ? 'h6' : 'body-sm'),
          color: isActive ? '#FFFFFF' : colors['text-secondary'],
          align: 'center',
          maxWidth: tabWidth - 12,
        });
        break;
    }
  }
}
