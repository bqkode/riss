// Block: ranked-list

export function expand(params: any): any[] {
  const title = params.title;
  const items = params.items || [];
  const numbered = params.numbered !== false;
  const showMedals = params['show-medals'] || false;

  const children: any[] = [];

  if (title) {
    children.push({ type: 'text', content: title, variant: 'h3' });
    children.push({ type: 'spacer', height: 16 });
  }

  children.push({
    type: 'stack',
    gap: 0,
    children: items.map((item: any, i: number) => {
      const label = typeof item === 'string' ? item : item.title || item.label || item.name;
      const subtitle = typeof item === 'object' ? item.subtitle || item.description : undefined;
      const value = typeof item === 'object' ? item.value : undefined;

      const rankIndicator: any[] = [];
      if (showMedals && i < 3) {
        const medalColors = ['warning', 'muted', 'warning-alt'];
        const medalLabels = ['gold', 'silver', 'bronze'];
        rankIndicator.push({
          type: 'icon',
          name: 'medal',
          size: 20,
          color: medalColors[i],
          annotation: medalLabels[i],
        });
      } else if (numbered) {
        rankIndicator.push({
          type: 'text',
          content: String(i + 1),
          variant: 'body',
          weight: 'bold',
          color: 'muted',
          width: 24,
          align: 'center',
        });
      }

      return {
        type: 'row',
        gap: 12,
        align: 'center',
        padding: [10, 0],
        borderBottom: i < items.length - 1,
        children: [
          ...rankIndicator,
          ...(typeof item === 'object' && item.image ? [{ type: 'image', label: item.image, width: 40, height: 40, borderRadius: 4 }] : []),
          {
            type: 'stack',
            flex: 1,
            gap: 2,
            children: [
              { type: 'text', content: label, variant: 'body' },
              ...(subtitle ? [{ type: 'text', content: subtitle, variant: 'caption', color: 'muted' }] : []),
            ],
          },
          ...(value !== undefined ? [{ type: 'text', content: String(value), variant: 'body', weight: 'bold' }] : []),
        ],
      };
    }),
  });

  return [{
    type: 'stack',
    padding: [24, 24],
    children,
  }];
}
