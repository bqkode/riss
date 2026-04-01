import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const variant = el.variant || 'rect';
  const shimmerColor = colors['placeholder'] || '#E5E7EB';
  const shimmerHighlight = colors['surface'] || '#F5F5F5';
  const radius = 4;

  switch (variant) {
    case 'text': {
      // Lines of varying width
      const lineHeight = 14;
      const lineGap = 8;
      const lines = el.lines || 3;
      const widths = [1, 1, 0.75, 0.9, 0.6]; // pattern of line widths

      for (let i = 0; i < lines; i++) {
        const w = box.width * (widths[i % widths.length]);
        const y = box.y + i * (lineHeight + lineGap);
        canvas.drawRect(box.x, y, w, lineHeight, {
          fill: shimmerColor,
          radius,
        });
      }
      break;
    }

    case 'circle': {
      const r = Math.min(box.width, box.height) / 2;
      canvas.drawCircle(box.x + box.width / 2, box.y + box.height / 2, r, {
        fill: shimmerColor,
      });
      break;
    }

    case 'avatar': {
      const r = Math.min(box.width, box.height) / 2;
      canvas.drawCircle(box.x + r, box.y + r, r, {
        fill: shimmerColor,
      });
      break;
    }

    case 'card': {
      // Rectangle with internal shimmer lines
      canvas.drawRect(box.x, box.y, box.width, box.height, {
        fill: shimmerColor,
        radius: 8,
      });
      // Internal lines
      const padding = 16;
      const lineY = box.y + padding;
      canvas.drawRect(box.x + padding, lineY, box.width * 0.6, 14, {
        fill: shimmerHighlight,
        radius,
      });
      canvas.drawRect(box.x + padding, lineY + 22, box.width * 0.8, 10, {
        fill: shimmerHighlight,
        radius,
      });
      canvas.drawRect(box.x + padding, lineY + 38, box.width * 0.5, 10, {
        fill: shimmerHighlight,
        radius,
      });
      break;
    }

    case 'list-item': {
      // Avatar circle + two lines
      const avatarR = 20;
      canvas.drawCircle(box.x + avatarR, box.y + box.height / 2, avatarR, {
        fill: shimmerColor,
      });
      const textX = box.x + avatarR * 2 + 12;
      canvas.drawRect(textX, box.y + box.height / 2 - 16, box.width * 0.45, 14, {
        fill: shimmerColor,
        radius,
      });
      canvas.drawRect(textX, box.y + box.height / 2 + 4, box.width * 0.3, 10, {
        fill: shimmerColor,
        radius,
      });
      break;
    }

    case 'rect':
    default: {
      canvas.drawRect(box.x, box.y, box.width, box.height, {
        fill: shimmerColor,
        radius,
      });
      break;
    }
  }
}
