// Block: chart-card

export function expand(params: any): any[] {
  const title = params.title || 'Chart';
  const chartType = params['chart-type'] || 'line';
  const chartLabel = params['chart-label'] || 'Data visualization';
  const aspect = params.aspect || '16:9';
  const subtitle = params.subtitle;
  const actions = params.actions || [];

  const headerRow: any[] = [
    {
      type: 'stack',
      flex: 1,
      gap: 2,
      children: [
        { type: 'text', content: title, variant: 'subtitle' },
        ...(subtitle ? [{ type: 'text', content: subtitle, variant: 'caption', color: 'muted' }] : []),
      ],
    },
  ];

  if (actions.length > 0) {
    headerRow.push({
      type: 'row',
      gap: 4,
      children: actions.map((a: any) => ({
        type: 'button',
        label: typeof a === 'string' ? a : a.label,
        variant: 'ghost',
        size: 'sm',
      })),
    });
  }

  return [{
    type: 'card',
    padding: 20,
    children: [{
      type: 'stack',
      gap: 16,
      children: [
        { type: 'row', align: 'center', children: headerRow },
        {
          type: 'placeholder',
          label: `${chartType} chart: ${chartLabel}`,
          aspect,
          background: 'surface-alt',
          icon: 'bar-chart',
        },
      ],
    }],
  }];
}
