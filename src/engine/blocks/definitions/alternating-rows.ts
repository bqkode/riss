// Block: alternating-rows

export function expand(params: any): any[] {
  const items = params.items || [];
  const startPosition = params['start-position'] || 'left';
  const gap = params.gap || 48;

  return [{
    type: 'stack',
    gap,
    padding: 48,
    children: items.map((item: any, i: number) => {
      const imageOnLeft = (startPosition === 'left' && i % 2 === 0) ||
                          (startPosition === 'right' && i % 2 !== 0);

      const textEl: any = {
        type: 'stack',
        flex: 1,
        justify: 'center',
        children: [
          { type: 'text', content: item.heading || item.title || `Item ${i + 1}`, variant: 'h3' },
          { type: 'spacer', height: 8 },
          { type: 'text', content: item.body || item.description || '', variant: 'body', color: 'muted' },
          ...(item['cta-label'] ? [
            { type: 'spacer', height: 16 },
            { type: 'button', label: item['cta-label'], variant: 'secondary' },
          ] : []),
        ],
      };

      const imageEl: any = {
        type: 'image',
        label: item['image-label'] || item.image || 'Feature image',
        aspect: '4:3',
        flex: 1,
      };

      return {
        type: 'row',
        gap: 48,
        align: 'center',
        children: imageOnLeft ? [imageEl, textEl] : [textEl, imageEl],
      };
    }),
  }];
}
