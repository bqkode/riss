// Block: cta-inline

export function expand(params: any): any[] {
  const heading = params.heading || 'Take action';
  const ctaLabel = params['cta-label'] || 'Learn more';
  const icon = params.icon;
  const variant = params.variant || 'default';

  const children: any[] = [];

  if (icon) {
    children.push({ type: 'icon', name: icon, size: 20, color: 'primary' });
  }
  children.push({ type: 'text', content: heading, variant: 'subtitle', flex: 1 });
  children.push({ type: 'button', label: ctaLabel, variant: variant === 'subtle' ? 'ghost' : 'primary', size: 'sm' });

  return [{
    type: 'row',
    align: 'center',
    gap: 12,
    padding: [16, 24],
    background: variant === 'highlighted' ? 'primary-subtle' : 'surface',
    borderRadius: 8,
    border: variant === 'outlined' ? 'default' : undefined,
    children,
  }];
}
