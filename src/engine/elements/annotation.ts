import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const number = el.number ?? ctx.annotations.length + 1;
  const text = el.text || el.content || '';
  const color = el.color ? (colors[el.color] || el.color) : colors['accent'];
  const position = el.position || 'inline';

  const markerRadius = 12;
  const markerCx = box.x + markerRadius;
  const markerCy = box.y + markerRadius;

  // Numbered marker circle
  canvas.drawCircle(markerCx, markerCy, markerRadius, {
    fill: color,
  });
  canvas.drawText(String(number), markerCx, markerCy - 6, {
    font: `600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`,
    color: '#FFFFFF',
    align: 'center',
  });

  // Callout box with text (not inline)
  if (position !== 'inline' && text) {
    const calloutX = box.x + markerRadius * 2 + 8;
    const calloutY = box.y;
    const calloutWidth = box.width - markerRadius * 2 - 8;
    const calloutHeight = box.height;

    canvas.drawRect(calloutX, calloutY, calloutWidth, calloutHeight, {
      fill: color + '15',
      stroke: color,
      strokeWidth: 1,
      radius: 6,
    });

    canvas.drawText(text, calloutX + 8, calloutY + 8, {
      font: getFontString('caption'),
      color: colors['text'],
      maxWidth: calloutWidth - 16,
      maxLines: 4,
    });
  }

  // Push to annotations array
  ctx.annotations.push({
    number,
    text,
    x: markerCx,
    y: markerCy,
    color,
  });
}
