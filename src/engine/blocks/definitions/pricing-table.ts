// Block: pricing-table

export function expand(params: any): any[] {
  const title = params.title;
  const subtitle = params.subtitle;
  const toggle = params.toggle;
  const tiers = params.tiers || [];

  const children: any[] = [];

  if (title || subtitle) {
    children.push({
      type: 'stack',
      align: 'center',
      gap: 8,
      children: [
        ...(title ? [{ type: 'text', content: title, variant: 'h2', align: 'center' }] : []),
        ...(subtitle ? [{ type: 'text', content: subtitle, variant: 'body-lg', color: 'muted', align: 'center' }] : []),
      ],
    });
    children.push({ type: 'spacer', height: 16 });
  }

  if (toggle) {
    children.push({
      type: 'row',
      align: 'center',
      justify: 'center',
      gap: 12,
      children: [
        { type: 'text', content: toggle.left || 'Monthly', variant: 'body' },
        { type: 'toggle', value: false },
        { type: 'text', content: toggle.right || 'Annual', variant: 'body' },
        ...(toggle.badge ? [{ type: 'badge', label: toggle.badge, variant: 'success', size: 'sm' }] : []),
      ],
    });
    children.push({ type: 'spacer', height: 24 });
  }

  children.push({
    type: 'row',
    gap: 24,
    align: 'stretch',
    children: tiers.map((tier: any) => {
      const tierChildren: any[] = [];

      if (tier.badge) {
        tierChildren.push({ type: 'badge', label: tier.badge, variant: 'primary', size: 'sm' });
      }

      tierChildren.push({ type: 'text', content: tier.name || 'Plan', variant: 'h4' });

      if (tier.description) {
        tierChildren.push({ type: 'text', content: tier.description, variant: 'body', color: 'muted' });
      }

      tierChildren.push({ type: 'spacer', height: 8 });
      tierChildren.push({
        type: 'row',
        align: 'baseline',
        gap: 4,
        children: [
          { type: 'text', content: tier.price || '$0', variant: 'h2' },
          ...(tier.period ? [{ type: 'text', content: `/${tier.period}`, variant: 'body', color: 'muted' }] : []),
        ],
      });
      tierChildren.push({ type: 'spacer', height: 16 });

      tierChildren.push({
        type: 'button',
        label: tier['cta-label'] || 'Get started',
        variant: tier.highlighted ? 'primary' : 'secondary',
        width: '100%',
      });

      tierChildren.push({ type: 'spacer', height: 16 });
      tierChildren.push({ type: 'divider' });
      tierChildren.push({ type: 'spacer', height: 16 });

      if (tier.features) {
        tierChildren.push({
          type: 'stack',
          gap: 8,
          children: tier.features.map((f: any) => ({
            type: 'row',
            gap: 8,
            align: 'center',
            children: [
              { type: 'icon', name: 'check', size: 16, color: 'success' },
              { type: 'text', content: typeof f === 'string' ? f : f.label, variant: 'body' },
            ],
          })),
        });
      }

      return {
        type: 'card',
        flex: 1,
        padding: 24,
        highlighted: tier.highlighted || false,
        border: tier.highlighted ? 'primary' : 'default',
        children: [{ type: 'stack', gap: 4, children: tierChildren }],
      };
    }),
  });

  return [{
    type: 'stack',
    padding: 48,
    children,
  }];
}
