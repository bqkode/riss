import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { drawIcon } from './icon';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const variant = el.variant || 'primary';
  const size = el.size || 'md';
  const label = el.label || el.content || '';
  const disabled = el.disabled === true;

  // Size config
  const sizeMap: Record<string, { fontSize: number }> = {
    'sm': { fontSize: 12 },
    'md': { fontSize: 14 },
    'lg': { fontSize: 16 },
  };
  const sc = sizeMap[size] || sizeMap['md'];
  const font = `600 ${sc.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  const radius = 8;

  // Save for opacity
  const rawCtx = canvas.ctx;
  rawCtx.save();
  if (disabled) {
    rawCtx.globalAlpha = 0.4;
  }

  const iconLeading = el.icon || el['icon-leading'];
  const iconTrailing = el['icon-trailing'];
  const iconSize = sc.fontSize + 2;

  let textX = box.x + box.width / 2;
  let textColor: string;

  switch (variant) {
    case 'primary':
      canvas.drawRect(box.x, box.y, box.width, box.height, {
        fill: colors['accent'],
        radius,
      });
      textColor = '#FFFFFF';
      break;

    case 'secondary':
      canvas.drawRect(box.x, box.y, box.width, box.height, {
        fill: colors['surface'],
        radius,
      });
      textColor = colors['text'];
      break;

    case 'outline':
      canvas.drawRect(box.x, box.y, box.width, box.height, {
        stroke: colors['border-strong'],
        strokeWidth: 1,
        radius,
      });
      textColor = colors['text'];
      break;

    case 'ghost':
      textColor = colors['text'];
      break;

    case 'text':
      textColor = colors['accent'];
      break;

    default:
      canvas.drawRect(box.x, box.y, box.width, box.height, {
        fill: colors['accent'],
        radius,
      });
      textColor = '#FFFFFF';
      break;
  }

  // Draw leading icon
  let contentStartX = box.x + 16;
  if (iconLeading) {
    const iconCx = contentStartX + iconSize / 2;
    const iconCy = box.y + box.height / 2;
    drawIcon(canvas, iconLeading, iconCx, iconCy, iconSize, textColor);
    contentStartX += iconSize + 6;
  }

  // Draw label text
  if (label) {
    if (iconLeading || iconTrailing) {
      // Left-aligned with icons
      const labelX = iconLeading ? contentStartX : box.x + 16;
      canvas.drawText(label, labelX, box.y + (box.height - sc.fontSize) / 2, {
        font,
        color: textColor,
        maxWidth: box.width - 32 - (iconLeading ? iconSize + 6 : 0) - (iconTrailing ? iconSize + 6 : 0),
      });
    } else {
      canvas.drawText(label, textX, box.y + (box.height - sc.fontSize) / 2, {
        font,
        color: textColor,
        align: 'center',
        maxWidth: box.width - 16,
      });
    }
  }

  // Draw trailing icon
  if (iconTrailing) {
    const iconCx = box.x + box.width - 16 - iconSize / 2;
    const iconCy = box.y + box.height / 2;
    drawIcon(canvas, iconTrailing, iconCx, iconCy, iconSize, textColor);
  }

  // Underline for text variant
  if (variant === 'text' && label) {
    canvas.drawLine(
      box.x + 4,
      box.y + box.height - 4,
      box.x + box.width - 4,
      box.y + box.height - 4,
      { color: textColor, width: 1 },
    );
  }

  rawCtx.restore();
}
