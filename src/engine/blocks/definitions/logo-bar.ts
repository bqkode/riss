// Block: logo-bar

export function expand(params: any): any[] {
  const title = params.title;
  const logos = params.logos || [];
  const labels = params.labels || [];
  const variant = params.variant || 'inline';

  const children: any[] = [];

  if (title) {
    children.push({ type: 'text', content: title, variant: 'caption', color: 'muted', align: 'center' });
    children.push({ type: 'spacer', height: 16 });
  }

  const logoItems = logos.length > 0 ? logos : labels;

  children.push({
    type: 'row',
    gap: variant === 'compact' ? 24 : 48,
    align: 'center',
    justify: 'center',
    wrap: true,
    children: logoItems.map((item: any) => {
      const label = typeof item === 'string' ? item : item.label || item.name;
      return {
        type: 'image',
        label,
        height: 32,
        opacity: 0.6,
        grayscale: true,
      };
    }),
  });

  return [{
    type: 'stack',
    padding: [24, 48],
    align: 'center',
    children,
  }];
}
