// Block: bottom-nav

export function expand(params: any): any[] {
  const items = params.items || [];
  const variant = params.variant || 'icon-label';
  const background = params.background || 'surface';
  const activeColor = params['active-color'] || 'primary';

  return [{
    type: 'row',
    align: 'center',
    justify: 'space-around',
    padding: [8, 0],
    background,
    borderTop: true,
    children: items.map((item: any) => {
      const label = typeof item === 'string' ? item : item.label;
      const icon = typeof item === 'object' ? item.icon : undefined;
      const active = typeof item === 'object' ? item.active : false;
      const color = active ? activeColor : 'muted';

      const navItem: any[] = [];
      if (icon && variant !== 'label-only') {
        navItem.push({ type: 'icon', name: icon, size: 24, color });
      }
      if (variant !== 'icon-only') {
        navItem.push({ type: 'text', content: label, variant: 'caption', color, align: 'center' });
      }

      return {
        type: 'stack',
        align: 'center',
        padding: [4, 12],
        gap: 2,
        flex: 1,
        children: navItem,
      };
    }),
  }];
}
