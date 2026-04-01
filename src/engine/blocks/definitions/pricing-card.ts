// Block: pricing-card

export function expand(params: any): any[] {
  const name = params.name || 'Plan';
  const price = params.price || '$0';
  const period = params.period;
  const description = params.description;
  const features = params.features || [];
  const ctaLabel = params['cta-label'] || 'Get started';
  const highlighted = params.highlighted || false;

  const children: any[] = [
    { type: 'text', content: name, variant: 'h4' },
  ];

  if (description) {
    children.push({ type: 'text', content: description, variant: 'body', color: 'muted' });
  }

  children.push({ type: 'spacer', height: 12 });
  children.push({
    type: 'row',
    align: 'baseline',
    gap: 4,
    children: [
      { type: 'text', content: price, variant: 'h2' },
      ...(period ? [{ type: 'text', content: `/${period}`, variant: 'body', color: 'muted' }] : []),
    ],
  });

  children.push({ type: 'spacer', height: 16 });
  children.push({
    type: 'button',
    label: ctaLabel,
    variant: highlighted ? 'primary' : 'secondary',
    width: '100%',
  });

  children.push({ type: 'spacer', height: 16 });
  children.push({ type: 'divider' });
  children.push({ type: 'spacer', height: 16 });

  children.push({
    type: 'stack',
    gap: 8,
    children: features.map((f: any) => ({
      type: 'row',
      gap: 8,
      align: 'center',
      children: [
        { type: 'icon', name: 'check', size: 16, color: 'success' },
        { type: 'text', content: typeof f === 'string' ? f : f.label, variant: 'body' },
      ],
    })),
  });

  return [{
    type: 'card',
    padding: 24,
    highlighted,
    border: highlighted ? 'primary' : 'default',
    children: [{ type: 'stack', gap: 4, children }],
  }];
}
