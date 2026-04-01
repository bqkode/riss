// Block: card-grid

export function expand(params: any): any[] {
  const title = params.title;
  const columns = params.columns || 3;
  const items = params.items || [];
  const imageAspect = params['image-aspect'] || '16:9';
  const showMore = params['show-more'];

  const children: any[] = [];

  if (title) {
    const headerRow: any[] = [{ type: 'text', content: title, variant: 'h3', flex: 1 }];
    if (showMore) {
      headerRow.push({ type: 'button', label: typeof showMore === 'string' ? showMore : 'View all', variant: 'ghost', size: 'sm' });
    }
    children.push({ type: 'row', align: 'center', children: headerRow });
    children.push({ type: 'spacer', height: 16 });
  }

  children.push({
    type: 'grid',
    columns,
    gap: 20,
    children: items.map((item: any) => ({
      type: 'card',
      children: [
        ...(item.image || item['image-label'] ? [{ type: 'image', label: item.image || item['image-label'], aspect: imageAspect }] : []),
        {
          type: 'stack',
          padding: 16,
          gap: 6,
          children: [
            { type: 'text', content: item.title || 'Card', variant: 'subtitle' },
            ...(item.description ? [{ type: 'text', content: item.description, variant: 'caption', color: 'muted', lines: 2 }] : []),
            ...(item.badge ? [{ type: 'badge', label: item.badge, variant: 'subtle', size: 'sm' }] : []),
            ...(item['cta-label'] ? [{ type: 'button', label: item['cta-label'], variant: 'ghost', size: 'sm' }] : []),
          ],
        },
      ],
    })),
  });

  return [{
    type: 'stack',
    padding: [24, 24],
    children,
  }];
}
