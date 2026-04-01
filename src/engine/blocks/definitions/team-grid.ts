// Block: team-grid

export function expand(params: any): any[] {
  const title = params.title;
  const columns = params.columns || 4;
  const items = params.items || [];
  const showSocial = params['show-social'] || false;

  const children: any[] = [];

  if (title) {
    children.push({ type: 'text', content: title, variant: 'h2', align: 'center' });
    children.push({ type: 'spacer', height: 24 });
  }

  children.push({
    type: 'grid',
    columns,
    gap: 24,
    children: items.map((item: any) => ({
      type: 'card',
      padding: 24,
      children: [{
        type: 'stack',
        align: 'center',
        gap: 12,
        children: [
          { type: 'avatar', label: item.avatar || item.name || 'Team member', size: 80 },
          { type: 'text', content: item.name || '', variant: 'subtitle', align: 'center' },
          ...(item.role ? [{ type: 'text', content: item.role, variant: 'caption', color: 'muted', align: 'center' }] : []),
          ...(item.bio ? [{ type: 'text', content: item.bio, variant: 'caption', color: 'muted', align: 'center', lines: 3 }] : []),
          ...(showSocial && item.social ? [{
            type: 'row',
            gap: 12,
            justify: 'center',
            children: item.social.map((s: any) => ({
              type: 'icon',
              name: typeof s === 'string' ? s : s.platform || s.icon,
              size: 18,
              color: 'muted',
            })),
          }] : []),
        ],
      }],
    })),
  });

  return [{
    type: 'stack',
    padding: 48,
    children,
  }];
}
