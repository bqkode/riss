import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString, getLineHeight, TYPOGRAPHY_SCALE, resolveWeight } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const variant = el.variant || 'body';
  const content = el.content || '';
  const color = el.color ? (colors[el.color] || el.color) : colors['text'];
  const align = el.align || 'left';
  const maxLines = el.maxLines || el['max-lines'];

  // Build font string with optional weight override
  const typo = TYPOGRAPHY_SCALE[variant] || TYPOGRAPHY_SCALE['body'];
  const weight = resolveWeight(el.weight, variant);
  const font = `${weight} ${typo.fontSize}px ${typo.fontFamily}`;
  const lineHeight = getLineHeight(variant);

  let textX = box.x;
  if (align === 'center') {
    textX = box.x + box.width / 2;
  } else if (align === 'right') {
    textX = box.x + box.width;
  }

  canvas.drawText(content, textX, box.y, {
    font,
    color,
    align: align as 'left' | 'center' | 'right',
    maxWidth: box.width,
    maxLines: maxLines ? Number(maxLines) : undefined,
    lineHeight,
  });
}
