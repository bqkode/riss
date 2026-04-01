// Block: profile-header

export function expand(params: any): any[] {
  const cover = params.cover;
  const avatar = params.avatar || 'User';
  const avatarSize = params['avatar-size'] || 96;
  const name = params.name || '';
  const subtitle = params.subtitle;
  const bio = params.bio;
  const stats = params.stats || [];
  const actions = params.actions || [];
  const tabs = params.tabs;

  const children: any[] = [];

  // Cover image
  if (cover) {
    children.push({ type: 'image', label: cover, height: 200, width: '100%' });
  }

  // Profile info section
  const profileRow: any[] = [
    {
      type: 'avatar',
      label: avatar,
      size: avatarSize,
      border: true,
      marginTop: cover ? -(avatarSize / 2) : 0,
    },
  ];

  const infoStack: any[] = [
    { type: 'text', content: name, variant: 'h3' },
    ...(subtitle ? [{ type: 'text', content: subtitle, variant: 'body', color: 'muted' }] : []),
  ];

  if (bio) {
    infoStack.push({ type: 'spacer', height: 4 });
    infoStack.push({ type: 'text', content: bio, variant: 'body' });
  }

  // Stats
  if (stats.length > 0) {
    infoStack.push({ type: 'spacer', height: 8 });
    infoStack.push({
      type: 'row',
      gap: 24,
      children: stats.map((stat: any) => ({
        type: 'row',
        gap: 4,
        children: [
          { type: 'text', content: String(stat.value || 0), variant: 'body', weight: 'bold' },
          { type: 'text', content: stat.label || '', variant: 'body', color: 'muted' },
        ],
      })),
    });
  }

  const rightSection: any[] = [];
  if (actions.length > 0) {
    rightSection.push({
      type: 'row',
      gap: 8,
      children: actions.map((a: any, i: number) => ({
        type: 'button',
        label: typeof a === 'string' ? a : a.label,
        variant: i === 0 ? 'primary' : 'secondary',
        size: 'sm',
      })),
    });
  }

  children.push({
    type: 'row',
    gap: 16,
    align: 'start',
    padding: [cover ? 0 : 24, 24, 16, 24],
    children: [
      ...profileRow,
      { type: 'stack', flex: 1, gap: 2, children: infoStack },
      ...(rightSection.length > 0 ? rightSection : []),
    ],
  });

  // Tabs
  if (tabs) {
    children.push({
      type: 'tabs',
      items: Array.isArray(tabs) ? tabs.map((t: any) => (typeof t === 'string' ? { label: t } : t)) : [],
    });
  }

  return [{
    type: 'stack',
    gap: 0,
    children,
  }];
}
