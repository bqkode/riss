// Block: cta-banner

export function expand(params: any): any[] {
  const heading = params.heading || 'Ready to get started?';
  const subheading = params.subheading;
  const ctaLabel = params['cta-label'] || 'Get Started';
  const ctaSecondaryLabel = params['cta-secondary-label'];
  const background = params.background || 'primary';
  const align = params.align || 'center';

  const children: any[] = [
    { type: 'text', content: heading, variant: 'h2', align, color: 'on-primary' },
  ];

  if (subheading) {
    children.push({ type: 'text', content: subheading, variant: 'body-lg', align, color: 'on-primary', opacity: 0.85 });
  }

  children.push({ type: 'spacer', height: 24 });

  const buttons: any[] = [
    { type: 'button', label: ctaLabel, variant: 'on-primary' },
  ];
  if (ctaSecondaryLabel) {
    buttons.push({ type: 'button', label: ctaSecondaryLabel, variant: 'ghost', color: 'on-primary' });
  }

  children.push({ type: 'row', gap: 12, justify: align, children: buttons });

  return [{
    type: 'stack',
    align,
    padding: 64,
    background,
    children,
  }];
}
