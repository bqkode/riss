// Block: hero
// Variants: centered, split, split-reverse, with-search, with-input

export function expand(params: any): any[] {
  const variant = params.variant || 'centered';
  const heading = params.heading || 'Welcome';
  const subheading = params.subheading || '';
  const ctaLabel = params['cta-label'] || 'Get Started';
  const ctaSecondaryLabel = params['cta-secondary-label'];
  const image = params.image;
  const imagePosition = params['image-position'] || 'right';
  const background = params.background || 'surface';
  const align = params.align || 'center';
  const badge = params.badge;

  const textContent: any[] = [];

  if (badge) {
    textContent.push({ type: 'badge', label: badge, variant: 'subtle' });
    textContent.push({ type: 'spacer', height: 12 });
  }

  textContent.push({ type: 'text', content: heading, variant: 'h1', align });

  if (subheading) {
    textContent.push({ type: 'spacer', height: 8 });
    textContent.push({ type: 'text', content: subheading, variant: 'body-lg', color: 'muted', align });
  }

  textContent.push({ type: 'spacer', height: 24 });

  // CTA area varies by variant
  if (variant === 'with-search') {
    textContent.push({
      type: 'row',
      align: 'center',
      justify: align,
      gap: 8,
      children: [
        { type: 'input', placeholder: 'Search...', width: 320 },
        { type: 'button', label: ctaLabel, variant: 'primary' },
      ],
    });
  } else if (variant === 'with-input') {
    textContent.push({
      type: 'row',
      align: 'center',
      justify: align,
      gap: 8,
      children: [
        { type: 'input', placeholder: 'Enter your email', width: 280 },
        { type: 'button', label: ctaLabel, variant: 'primary' },
      ],
    });
  } else {
    const buttons: any[] = [{ type: 'button', label: ctaLabel, variant: 'primary' }];
    if (ctaSecondaryLabel) {
      buttons.push({ type: 'button', label: ctaSecondaryLabel, variant: 'secondary' });
    }
    textContent.push({
      type: 'row',
      align: 'center',
      justify: align,
      gap: 12,
      children: buttons,
    });
  }

  const textStack: any = {
    type: 'stack',
    align,
    padding: 48,
    children: textContent,
  };

  if (variant === 'centered') {
    const children: any[] = [textStack];
    if (image) {
      children.push({ type: 'spacer', height: 32 });
      children.push({ type: 'image', label: image, aspect: '16:9', width: '100%' });
    }
    return [{
      type: 'stack',
      align: 'center',
      background,
      padding: 64,
      children,
    }];
  }

  if (variant === 'split' || variant === 'split-reverse') {
    const imageEl: any = {
      type: 'image',
      label: image || 'Hero image',
      aspect: '4:3',
      flex: 1,
    };
    const textEl: any = { ...textStack, flex: 1 };
    const rowChildren = variant === 'split-reverse'
      ? [imageEl, textEl]
      : [textEl, imageEl];

    return [{
      type: 'row',
      background,
      padding: 48,
      gap: 48,
      align: 'center',
      children: rowChildren,
    }];
  }

  // Default fallback (with-search, with-input already handled above in textContent)
  const children: any[] = [textStack];
  if (image) {
    children.push({ type: 'spacer', height: 32 });
    children.push({ type: 'image', label: image, aspect: '16:9', width: '100%' });
  }
  return [{
    type: 'stack',
    align: 'center',
    background,
    padding: 64,
    children,
  }];
}
