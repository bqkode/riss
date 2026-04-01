// Block: feature-grid

export function expand(params: any): any[] {
  const title = params.title;
  const subtitle = params.subtitle;
  const columns = params.columns || 3;
  const items = params.items || [];
  const variant = params.variant || 'card';
  const align = params.align || 'center';

  const children: any[] = [];

  if (title || subtitle) {
    children.push({
      type: 'stack',
      align: 'center',
      gap: 8,
      padding: [0, 0, 24, 0],
      children: [
        ...(title ? [{ type: 'text', content: title, variant: 'h2', align: 'center' }] : []),
        ...(subtitle ? [{ type: 'text', content: subtitle, variant: 'body-lg', color: 'muted', align: 'center' }] : []),
      ],
    });
  }

  children.push({
    type: 'grid',
    columns,
    gap: 24,
    children: items.map((item: any) => {
      const featureChildren: any[] = [
        ...(item.icon ? [{ type: 'icon', name: item.icon, size: 32, color: item.color || 'primary' }] : []),
        { type: 'text', content: item.title || 'Feature', variant: 'subtitle', align },
        ...(item.description ? [{ type: 'text', content: item.description, variant: 'body', color: 'muted', align }] : []),
      ];

      if (variant === 'card') {
        return {
          type: 'card',
          padding: 24,
          children: [{ type: 'stack', gap: 12, align, children: featureChildren }],
        };
      }
      return { type: 'stack', gap: 12, align, children: featureChildren };
    }),
  });

  return [{
    type: 'stack',
    padding: 48,
    children,
  }];
}
