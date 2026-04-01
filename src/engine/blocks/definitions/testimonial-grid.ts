// Block: testimonial-grid

export function expand(params: any): any[] {
  const title = params.title;
  const columns = params.columns || 3;
  const items = params.items || [];

  const children: any[] = [];

  if (title) {
    children.push({ type: 'text', content: title, variant: 'h2', align: 'center' });
    children.push({ type: 'spacer', height: 24 });
  }

  children.push({
    type: 'grid',
    columns,
    gap: 24,
    children: items.map((item: any) => ({
      type: 'card',
      padding: 24,
      children: [{
        type: 'stack',
        gap: 12,
        children: [
          ...(item.rating ? [{
            type: 'row',
            gap: 2,
            children: Array.from({ length: 5 }, (_, i) => ({
              type: 'icon',
              name: i < item.rating ? 'star-filled' : 'star',
              size: 14,
              color: i < item.rating ? 'warning' : 'muted',
            })),
          }] : []),
          { type: 'text', content: `"${item.quote || ''}"`, variant: 'body', style: 'italic' },
          {
            type: 'row',
            gap: 10,
            align: 'center',
            children: [
              ...(item.avatar ? [{ type: 'avatar', label: item.avatar, size: 36 }] : []),
              {
                type: 'stack',
                gap: 2,
                children: [
                  { type: 'text', content: item.author || '', variant: 'caption', weight: 'bold' },
                  ...(item.role || item.company ? [{
                    type: 'text',
                    content: [item.role, item.company].filter(Boolean).join(', '),
                    variant: 'caption',
                    color: 'muted',
                  }] : []),
                ],
              },
            ],
          },
        ],
      }],
    })),
  });

  return [{
    type: 'stack',
    padding: 48,
    children,
  }];
}
