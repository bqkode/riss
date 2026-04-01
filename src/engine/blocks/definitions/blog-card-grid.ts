// Block: blog-card-grid

export function expand(params: any): any[] {
  const title = params.title;
  const columns = params.columns || 3;
  const items = params.items || [];
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
    gap: 24,
    children: items.map((item: any) => ({
      type: 'card',
      children: [
        { type: 'image', label: item.image || item['image-label'] || 'Blog image', aspect: '16:9' },
        {
          type: 'stack',
          padding: 16,
          gap: 8,
          children: [
            ...(item.category ? [{ type: 'badge', label: item.category, variant: 'subtle' }] : []),
            { type: 'text', content: item.title || 'Blog Post', variant: 'subtitle' },
            ...(item.excerpt ? [{ type: 'text', content: item.excerpt, variant: 'caption', color: 'muted', lines: 2 }] : []),
            {
              type: 'row',
              gap: 8,
              align: 'center',
              children: [
                ...(item.author ? [
                  { type: 'avatar', label: item.author, size: 24 },
                  { type: 'text', content: item.author, variant: 'caption' },
                ] : []),
                ...(item.date ? [{ type: 'text', content: item.date, variant: 'caption', color: 'muted' }] : []),
              ],
            },
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
