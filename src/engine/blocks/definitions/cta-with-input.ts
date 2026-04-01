// Block: cta-with-input

export function expand(params: any): any[] {
  const heading = params.heading || 'Stay updated';
  const subheading = params.subheading;
  const placeholder = params.placeholder || 'Enter your email';
  const ctaLabel = params['cta-label'] || 'Subscribe';
  const background = params.background || 'surface-alt';

  const children: any[] = [
    { type: 'text', content: heading, variant: 'h3', align: 'center' },
  ];

  if (subheading) {
    children.push({ type: 'text', content: subheading, variant: 'body', color: 'muted', align: 'center' });
  }

  children.push({ type: 'spacer', height: 20 });
  children.push({
    type: 'row',
    gap: 8,
    align: 'center',
    justify: 'center',
    children: [
      { type: 'input', placeholder, width: 320 },
      { type: 'button', label: ctaLabel, variant: 'primary' },
    ],
  });

  return [{
    type: 'stack',
    align: 'center',
    padding: [48, 24],
    background,
    children,
  }];
}
