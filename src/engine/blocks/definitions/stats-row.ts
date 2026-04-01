// Block: stats-row

export function expand(params: any): any[] {
  const items = params.items || [];
  const variant = params.variant || 'default';
  const background = params.background || 'surface';

  return [{
    type: 'row',
    gap: variant === 'divider' ? 0 : 48,
    align: 'center',
    justify: 'center',
    padding: [32, 48],
    background,
    children: items.flatMap((item: any, i: number) => {
      const stat: any = {
        type: 'stack',
        align: 'center',
        flex: 1,
        gap: 4,
        children: [
          { type: 'text', content: item.value || '0', variant: 'h2', align: 'center' },
          { type: 'text', content: item.label || 'Stat', variant: 'caption', color: 'muted', align: 'center' },
        ],
      };

      if (variant === 'divider' && i < items.length - 1) {
        return [stat, { type: 'divider', orientation: 'vertical', height: 48 }];
      }
      return [stat];
    }),
  }];
}
