import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;
  const viewport = ctx.screenViewport;

  // Dimmed backdrop
  canvas.drawRect(0, 0, viewport.width, viewport.height, {
    fill: 'rgba(0,0,0,0.5)',
  });

  // Modal card
  const radius = 12;
  canvas.drawRect(box.x, box.y, box.width, box.height, {
    fill: colors['background'],
    radius,
    shadow: 'lg',
  });

  // Title bar
  if (el.title) {
    const titleY = box.y + 16;
    const titleX = box.x + 20;
    canvas.drawText(el.title, titleX, titleY, {
      font: getFontString('h4'),
      color: colors['text'],
      maxWidth: box.width - 60,
    });

    // Close button (X)
    if (el.close !== false) {
      const closeX = box.x + box.width - 36;
      const closeY = box.y + 14;
      const closeSize = 24;
      canvas.drawText('\u00D7', closeX, closeY, {
        font: `400 ${closeSize}px -apple-system, sans-serif`,
        color: colors['text-secondary'],
      });
    }

    // Divider below title
    canvas.drawLine(box.x, box.y + 52, box.x + box.width, box.y + 52, {
      color: colors['border'],
    });
  }
}
