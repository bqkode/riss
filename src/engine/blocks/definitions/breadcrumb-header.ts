// Block: breadcrumb-header

export function expand(params: any): any[] {
  const breadcrumb = params.breadcrumb || [];
  const title = params.title || '';
  const description = params.description;

  const crumbs = Array.isArray(breadcrumb) ? breadcrumb : [breadcrumb];

  const children: any[] = [];

  if (crumbs.length > 0) {
    children.push({
      type: 'row',
      gap: 4,
      align: 'center',
      children: crumbs.flatMap((crumb: string, i: number) => {
        const items: any[] = [
          { type: 'text', content: crumb, variant: 'caption', color: i < crumbs.length - 1 ? 'link' : 'default' },
        ];
        if (i < crumbs.length - 1) {
          items.push({ type: 'icon', name: 'chevron-right', size: 12, color: 'muted' });
        }
        return items;
      }),
    });
    children.push({ type: 'spacer', height: 8 });
  }

  children.push({ type: 'text', content: title, variant: 'h2' });

  if (description) {
    children.push({ type: 'text', content: description, variant: 'body', color: 'muted' });
  }

  return [{
    type: 'stack',
    padding: [16, 24],
    gap: 4,
    children,
  }];
}
