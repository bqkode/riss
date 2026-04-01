// Block: content-carousel

export function expand(params: any): any[] {
  const title = params.title;
  const items = params.items || [];
  const cardWidth = params['card-width'] || 280;
  const showMore = params['show-more'];

  const children: any[] = [];

  if (title) {
    const headerRow: any[] = [
      { type: 'text', content: title, variant: 'h3', flex: 1 },
    ];
    if (showMore) {
      headerRow.push({ type: 'button', label: typeof showMore === 'string' ? showMore : 'View all', variant: 'ghost', size: 'sm' });
    }
    children.push({ type: 'row', align: 'center', children: headerRow });
    children.push({ type: 'spacer', height: 16 });
  }

  children.push({
    type: 'row',
    gap: 16,
    overflow: 'scroll',
    children: items.map((item: any) => ({
      type: 'card',
      width: cardWidth,
      children: [
        { type: 'image', label: item.image || item['image-label'] || 'Card image', aspect: '16:9' },
        {
          type: 'stack',
          padding: 16,
          gap: 4,
          children: [
            { type: 'text', content: item.title || 'Card', variant: 'subtitle' },
            ...(item.description ? [{ type: 'text', content: item.description, variant: 'caption', color: 'muted' }] : []),
          ],
        },
      ],
    })),
  });

  return [{
    type: 'stack',
    padding: [32, 24],
    children,
  }];
}
