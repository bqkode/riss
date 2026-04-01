import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;
  const viewport = ctx.screenViewport;

  // Dimmed backdrop
  canvas.drawRect(0, 0, viewport.width, viewport.height, {
    fill: 'rgba(0,0,0,0.5)',
  });

  // Sheet card anchored to bottom
  const radius = 16;
  canvas.drawRect(box.x, box.y, box.width, box.height, {
    fill: colors['background'],
    radius,
    shadow: 'lg',
  });

  // Drag handle
  if (el.handle !== false) {
    const handleWidth = 36;
    const handleHeight = 4;
    const handleX = box.x + (box.width - handleWidth) / 2;
    const handleY = box.y + 8;
    canvas.drawRect(handleX, handleY, handleWidth, handleHeight, {
      fill: colors['border-strong'],
      radius: 2,
    });
  }
}
