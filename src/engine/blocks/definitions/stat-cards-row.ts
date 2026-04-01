// Block: stat-cards-row

export function expand(params: any): any[] {
  const items = params.items || [];
  const columns = params.columns || items.length || 4;

  return [{
    type: 'grid',
    columns,
    gap: 16,
    padding: [16, 24],
    children: items.map((item: any) => ({
      type: 'card',
      padding: 20,
      children: [{
        type: 'stack',
        gap: 8,
        children: [
          {
            type: 'row',
            align: 'center',
            gap: 8,
            children: [
              ...(item.icon ? [{ type: 'icon', name: item.icon, size: 20, color: item.color || 'primary' }] : []),
              { type: 'text', content: item.label || 'Metric', variant: 'caption', color: 'muted' },
            ],
          },
          { type: 'text', content: item.value || '0', variant: 'h3' },
          ...(item.change ? [{
            type: 'row',
            gap: 4,
            align: 'center',
            children: [
              {
                type: 'icon',
                name: item.change > 0 ? 'trending-up' : 'trending-down',
                size: 14,
                color: item.change > 0 ? 'success' : 'error',
              },
              {
                type: 'text',
                content: `${item.change > 0 ? '+' : ''}${item.change}%`,
                variant: 'caption',
                color: item.change > 0 ? 'success' : 'error',
              },
            ],
          }] : []),
        ],
      }],
    })),
  }];
}
