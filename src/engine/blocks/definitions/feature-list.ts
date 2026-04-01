// Block: feature-list

export function expand(params: any): any[] {
  const items = params.items || [];
  const iconColor = params['icon-color'] || 'primary';
  const dividers = params.dividers !== false;

  return [{
    type: 'stack',
    padding: [24, 24],
    gap: 0,
    children: items.flatMap((item: any, i: number) => {
      const row: any = {
        type: 'row',
        gap: 16,
        align: 'start',
        padding: [16, 0],
        children: [
          { type: 'icon', name: item.icon || 'check-circle', size: 24, color: iconColor },
          {
            type: 'stack',
            flex: 1,
            gap: 4,
            children: [
              { type: 'text', content: item.title || 'Feature', variant: 'subtitle' },
              ...(item.description ? [{ type: 'text', content: item.description, variant: 'body', color: 'muted' }] : []),
            ],
          },
        ],
      };
      const els: any[] = [row];
      if (dividers && i < items.length - 1) {
        els.push({ type: 'divider' });
      }
      return els;
    }),
  }];
}
