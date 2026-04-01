// Block: top-nav

export function expand(params: any): any[] {
  const logo = params.logo;
  const logoIcon = params['logo-icon'];
  const items = params.items || [];
  const ctaLabel = params['cta-label'];
  const ctaSecondaryLabel = params['cta-secondary-label'];
  const search = params.search || false;
  const avatar = params.avatar;
  const sticky = params.sticky || false;

  const leftChildren: any[] = [];
  if (logoIcon) leftChildren.push({ type: 'icon', name: logoIcon, size: 24 });
  if (logo) leftChildren.push({ type: 'text', content: logo, variant: 'subtitle', weight: 'bold' });

  const centerChildren: any[] = items.map((item: any) => ({
    type: 'text',
    content: typeof item === 'string' ? item : item.label,
    variant: 'body',
    color: (typeof item === 'object' && item.active) ? 'primary' : 'default',
    cursor: 'pointer',
  }));

  const rightChildren: any[] = [];

  if (search) {
    rightChildren.push({ type: 'icon', name: 'search', size: 20, color: 'muted' });
  }

  if (ctaSecondaryLabel) {
    rightChildren.push({ type: 'button', label: ctaSecondaryLabel, variant: 'ghost', size: 'sm' });
  }

  if (ctaLabel) {
    rightChildren.push({ type: 'button', label: ctaLabel, variant: 'primary', size: 'sm' });
  }

  if (avatar) {
    rightChildren.push({ type: 'avatar', label: avatar, size: 32 });
  }

  return [{
    type: 'row',
    align: 'center',
    padding: [12, 24],
    gap: 24,
    background: 'surface',
    borderBottom: true,
    sticky,
    children: [
      { type: 'row', gap: 8, align: 'center', children: leftChildren },
      { type: 'row', gap: 24, align: 'center', flex: 1, justify: 'center', children: centerChildren },
      { type: 'row', gap: 12, align: 'center', children: rightChildren },
    ],
  }];
}
