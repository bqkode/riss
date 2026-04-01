// Block: accordion

export function expand(params: any): any[] {
  const title = params.title;
  const items = params.items || [];
  const variant = params.variant || 'default';
  const singleExpand = params['single-expand'] || false;

  const children: any[] = [];

  if (title) {
    children.push({ type: 'text', content: title, variant: 'h3' });
    children.push({ type: 'spacer', height: 16 });
  }

  children.push({
    type: 'stack',
    gap: variant === 'separated' ? 8 : 0,
    children: items.map((item: any, i: number) => {
      const isExpanded = i === 0; // First item expanded by default
      const itemLabel = typeof item === 'string' ? item : item.title || item.label || `Item ${i + 1}`;
      const itemContent = typeof item === 'object' ? item.content || item.body || '' : '';

      const accordionItem: any = {
        type: variant === 'separated' ? 'card' : 'stack',
        padding: variant === 'separated' ? 0 : undefined,
        children: [
          {
            type: 'row',
            align: 'center',
            padding: variant === 'separated' ? [12, 16] : [12, 0],
            cursor: 'pointer',
            borderBottom: variant !== 'separated' && i < items.length - 1 && !isExpanded,
            children: [
              { type: 'text', content: itemLabel, variant: 'subtitle', flex: 1 },
              { type: 'icon', name: isExpanded ? 'chevron-up' : 'chevron-down', size: 16, color: 'muted' },
            ],
          },
          ...(isExpanded ? [{
            type: 'stack',
            padding: variant === 'separated' ? [0, 16, 16, 16] : [8, 0, 16, 0],
            children: [
              { type: 'text', content: itemContent, variant: 'body', color: 'muted' },
            ],
          }] : []),
        ],
      };

      return accordionItem;
    }),
  });

  return [{
    type: 'stack',
    padding: [24, 24],
    children,
    data: { singleExpand },
  }];
}
