// Block: search-with-filters

export function expand(params: any): any[] {
  const placeholder = params.placeholder || 'Search...';
  const filters = params.filters || [];
  const resultCount = params['result-count'];
  const sort = params.sort;

  const children: any[] = [];

  // Search bar
  children.push({
    type: 'row',
    gap: 8,
    align: 'center',
    children: [
      { type: 'icon', name: 'search', size: 20, color: 'muted' },
      { type: 'input', placeholder, flex: 1 },
    ],
  });

  // Filters row
  if (filters.length > 0) {
    children.push({ type: 'spacer', height: 12 });
    children.push({
      type: 'row',
      gap: 8,
      align: 'center',
      wrap: true,
      children: filters.map((filter: any) => {
        if (typeof filter === 'string') {
          return { type: 'select', placeholder: filter, width: 140, size: 'sm' };
        }
        return {
          type: 'select',
          label: filter.label,
          placeholder: filter.placeholder || filter.label,
          options: filter.options || [],
          width: filter.width || 140,
          size: 'sm',
        };
      }),
    });
  }

  // Results count and sort
  if (resultCount !== undefined || sort) {
    children.push({ type: 'spacer', height: 12 });
    children.push({
      type: 'row',
      align: 'center',
      children: [
        ...(resultCount !== undefined
          ? [{ type: 'text', content: `${resultCount} results`, variant: 'caption', color: 'muted', flex: 1 }]
          : [{ type: 'spacer', flex: 1 }]),
        ...(sort ? [{
          type: 'select',
          placeholder: 'Sort by',
          options: Array.isArray(sort) ? sort : ['Relevance', 'Date', 'Name'],
          width: 140,
          size: 'sm',
        }] : []),
      ],
    });
  }

  return [{
    type: 'stack',
    padding: [16, 24],
    gap: 0,
    children,
  }];
}
