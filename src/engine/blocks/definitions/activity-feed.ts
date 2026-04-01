// Block: activity-feed

export function expand(params: any): any[] {
  const title = params.title || 'Activity';
  const items = params.items || [];
  const showMore = params['show-more'];

  const children: any[] = [
    { type: 'text', content: title, variant: 'h4' },
    { type: 'spacer', height: 12 },
  ];

  children.push({
    type: 'stack',
    gap: 0,
    children: items.map((item: any, i: number) => ({
      type: 'row',
      gap: 12,
      align: 'start',
      padding: [12, 0],
      borderBottom: i < items.length - 1,
      children: [
        { type: 'avatar', label: item.user || item.avatar || 'User', size: 32 },
        {
          type: 'stack',
          flex: 1,
          gap: 2,
          children: [
            {
              type: 'row',
              gap: 4,
              children: [
                { type: 'text', content: item.user || 'User', variant: 'body', weight: 'bold' },
                { type: 'text', content: item.action || item.message || '', variant: 'body' },
              ],
            },
            { type: 'text', content: item.time || item.timestamp || '', variant: 'caption', color: 'muted' },
          ],
        },
      ],
    })),
  });

  if (showMore) {
    children.push({ type: 'spacer', height: 12 });
    children.push({
      type: 'button',
      label: typeof showMore === 'string' ? showMore : 'View all activity',
      variant: 'ghost',
      size: 'sm',
      width: '100%',
    });
  }

  return [{
    type: 'card',
    padding: 20,
    children: [{ type: 'stack', gap: 0, children }],
  }];
}
