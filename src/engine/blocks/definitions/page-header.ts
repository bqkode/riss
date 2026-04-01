// Block: page-header

export function expand(params: any): any[] {
  const title = params.title || 'Page Title';
  const description = params.description;
  const breadcrumb = params.breadcrumb;
  const actions = params.actions || [];
  const tabs = params.tabs;
  const divider = params.divider !== false;

  const children: any[] = [];

  if (breadcrumb) {
    const crumbs = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb];
    children.push({
      type: 'row',
      gap: 4,
      align: 'center',
      children: crumbs.flatMap((crumb: string, i: number) => {
        const items: any[] = [{ type: 'text', content: crumb, variant: 'caption', color: i < crumbs.length - 1 ? 'link' : 'muted' }];
        if (i < crumbs.length - 1) {
          items.push({ type: 'text', content: '/', variant: 'caption', color: 'muted' });
        }
        return items;
      }),
    });
    children.push({ type: 'spacer', height: 8 });
  }

  const headerRow: any[] = [
    {
      type: 'stack',
      flex: 1,
      children: [
        { type: 'text', content: title, variant: 'h2' },
        ...(description ? [{ type: 'text', content: description, variant: 'body', color: 'muted' }] : []),
      ],
    },
  ];

  if (actions.length > 0) {
    headerRow.push({
      type: 'row',
      gap: 8,
      align: 'center',
      children: actions.map((a: any) => ({
        type: 'button',
        label: typeof a === 'string' ? a : a.label,
        variant: typeof a === 'object' && a.variant ? a.variant : 'secondary',
      })),
    });
  }

  children.push({ type: 'row', align: 'center', gap: 16, children: headerRow });

  if (tabs) {
    children.push({ type: 'spacer', height: 12 });
    children.push({
      type: 'tabs',
      items: Array.isArray(tabs) ? tabs.map((t: any) => (typeof t === 'string' ? { label: t } : t)) : [],
    });
  }

  if (divider) {
    children.push({ type: 'divider' });
  }

  return [{
    type: 'stack',
    padding: [24, 24, 0, 24],
    gap: 4,
    children,
  }];
}
