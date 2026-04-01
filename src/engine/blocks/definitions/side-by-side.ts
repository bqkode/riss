// Block: side-by-side

export function expand(params: any): any[] {
  const heading = params.heading || '';
  const body = params.body || '';
  const imageLabel = params['image-label'] || 'Image';
  const imagePosition = params['image-position'] || 'right';
  const imageAspect = params['image-aspect'] || '4:3';
  const ctaLabel = params['cta-label'];
  const bullets = params.bullets || [];
  const split = params.split || '1:1';

  const textChildren: any[] = [
    { type: 'text', content: heading, variant: 'h3' },
    { type: 'spacer', height: 8 },
    { type: 'text', content: body, variant: 'body', color: 'muted' },
  ];

  if (bullets.length > 0) {
    textChildren.push({ type: 'spacer', height: 12 });
    textChildren.push({
      type: 'list',
      children: bullets.map((b: any) => ({
        type: 'list-item',
        label: typeof b === 'string' ? b : b.label,
        icon: typeof b === 'object' ? b.icon : 'check',
      })),
    });
  }

  if (ctaLabel) {
    textChildren.push({ type: 'spacer', height: 16 });
    textChildren.push({ type: 'button', label: ctaLabel, variant: 'primary' });
  }

  const [leftFlex, rightFlex] = split.split(':').map(Number);

  const textEl: any = { type: 'stack', flex: leftFlex || 1, justify: 'center', children: textChildren };
  const imageEl: any = { type: 'image', label: imageLabel, aspect: imageAspect, flex: rightFlex || 1 };

  const rowChildren = imagePosition === 'left' ? [imageEl, textEl] : [textEl, imageEl];

  return [{
    type: 'row',
    gap: 48,
    align: 'center',
    padding: 48,
    children: rowChildren,
  }];
}
