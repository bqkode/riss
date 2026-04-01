// Block: sidebar-nav

export function expand(params: any): any[] {
  const logo = params.logo;
  const logoIcon = params['logo-icon'];
  const items = params.items || [];
  const groups = params.groups || [];
  const footer = params.footer;
  const width = params.width || 240;
  const collapsible = params.collapsible || false;
  const background = params.background || 'surface';

  const children: any[] = [];

  // Logo area
  if (logo || logoIcon) {
    const logoRow: any[] = [];
    if (logoIcon) logoRow.push({ type: 'icon', name: logoIcon, size: 24 });
    if (logo) logoRow.push({ type: 'text', content: logo, variant: 'subtitle', weight: 'bold' });
    children.push({ type: 'row', gap: 8, align: 'center', padding: [16, 16, 8, 16], children: logoRow });
    children.push({ type: 'divider' });
  }

  // Grouped items
  if (groups.length > 0) {
    for (const group of groups) {
      if (group.label) {
        children.push({
          type: 'text',
          content: group.label,
          variant: 'overline',
          color: 'muted',
          padding: [16, 16, 4, 16],
        });
      }
      const groupItems = group.items || [];
      children.push({
        type: 'list',
        children: groupItems.map((item: any) => ({
          type: 'list-item',
          label: typeof item === 'string' ? item : item.label,
          icon: typeof item === 'object' ? item.icon : undefined,
          active: typeof item === 'object' ? item.active : false,
          indent: typeof item === 'object' ? item.indent : 0,
        })),
      });
    }
  }

  // Flat items
  if (items.length > 0) {
    children.push({
      type: 'list',
      padding: [8, 0],
      children: items.map((item: any) => ({
        type: 'list-item',
        label: typeof item === 'string' ? item : item.label,
        icon: typeof item === 'object' ? item.icon : undefined,
        active: typeof item === 'object' ? item.active : false,
      })),
    });
  }

  // Spacer to push footer down
  children.push({ type: 'spacer', flex: 1 });

  // Footer
  if (footer) {
    children.push({ type: 'divider' });
    if (typeof footer === 'string') {
      children.push({ type: 'text', content: footer, variant: 'caption', color: 'muted', padding: 16 });
    } else if (Array.isArray(footer)) {
      children.push({
        type: 'list',
        padding: [8, 0],
        children: footer.map((item: any) => ({
          type: 'list-item',
          label: typeof item === 'string' ? item : item.label,
          icon: typeof item === 'object' ? item.icon : undefined,
        })),
      });
    }
  }

  return [{
    type: 'stack',
    width,
    height: '100%',
    background,
    borderRight: true,
    collapsible,
    children,
  }];
}
