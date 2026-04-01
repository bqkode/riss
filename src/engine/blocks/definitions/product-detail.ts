// Block: product-detail

export function expand(params: any): any[] {
  const imageLabel = params['image-label'] || 'Product image';
  const imageCount = params['image-count'] || 1;
  const category = params.category;
  const title = params.title || 'Product';
  const price = params.price || '$0';
  const originalPrice = params['original-price'];
  const rating = params.rating;
  const reviews = params.reviews;
  const description = params.description;
  const variants = params.variants || [];
  const ctaLabel = params['cta-label'] || 'Add to cart';
  const wishlist = params.wishlist !== false;

  // Image gallery
  const imageChildren: any[] = [
    { type: 'image', label: imageLabel, aspect: '1:1' },
  ];

  if (imageCount > 1) {
    imageChildren.push({
      type: 'row',
      gap: 8,
      padding: [8, 0, 0, 0],
      children: Array.from({ length: Math.min(imageCount, 5) }, (_, i) => ({
        type: 'image',
        label: `${imageLabel} ${i + 1}`,
        width: 64,
        height: 64,
        border: i === 0 ? 'primary' : 'default',
      })),
    });
  }

  // Product info
  const infoChildren: any[] = [];

  if (category) {
    infoChildren.push({ type: 'text', content: category, variant: 'overline', color: 'primary' });
  }

  infoChildren.push({ type: 'text', content: title, variant: 'h2' });

  if (rating || reviews) {
    const ratingRow: any[] = [];
    if (rating) {
      ratingRow.push({
        type: 'row',
        gap: 2,
        children: Array.from({ length: 5 }, (_, i) => ({
          type: 'icon',
          name: i < Math.floor(rating) ? 'star-filled' : 'star',
          size: 16,
          color: i < rating ? 'warning' : 'muted',
        })),
      });
      ratingRow.push({ type: 'text', content: String(rating), variant: 'body', weight: 'bold' });
    }
    if (reviews) {
      ratingRow.push({ type: 'text', content: `(${reviews} reviews)`, variant: 'body', color: 'link' });
    }
    infoChildren.push({ type: 'row', gap: 8, align: 'center', children: ratingRow });
  }

  infoChildren.push({ type: 'spacer', height: 8 });

  const priceRow: any[] = [
    { type: 'text', content: price, variant: 'h3' },
  ];
  if (originalPrice) {
    priceRow.push({ type: 'text', content: originalPrice, variant: 'body', color: 'muted', strikethrough: true });
    priceRow.push({ type: 'badge', label: 'Sale', variant: 'error', size: 'sm' });
  }
  infoChildren.push({ type: 'row', gap: 12, align: 'center', children: priceRow });

  if (description) {
    infoChildren.push({ type: 'spacer', height: 12 });
    infoChildren.push({ type: 'text', content: description, variant: 'body', color: 'muted' });
  }

  // Variants (color, size, etc.)
  for (const v of variants) {
    const variantDef = typeof v === 'string' ? { label: v, options: [] } : v;
    infoChildren.push({ type: 'spacer', height: 16 });
    infoChildren.push({ type: 'text', content: variantDef.label || 'Option', variant: 'caption', weight: 'bold' });
    infoChildren.push({ type: 'spacer', height: 6 });

    if (variantDef.type === 'color') {
      infoChildren.push({
        type: 'row',
        gap: 8,
        children: (variantDef.options || []).map((opt: any, i: number) => ({
          type: 'badge',
          color: typeof opt === 'string' ? opt : opt.color,
          size: 28,
          shape: 'circle',
          border: i === 0 ? 'primary' : 'default',
        })),
      });
    } else {
      infoChildren.push({
        type: 'row',
        gap: 8,
        children: (variantDef.options || []).map((opt: any, i: number) => ({
          type: 'chip',
          label: typeof opt === 'string' ? opt : opt.label,
          selected: i === 0,
        })),
      });
    }
  }

  // CTA
  infoChildren.push({ type: 'spacer', height: 24 });
  const ctaRow: any[] = [
    { type: 'button', label: ctaLabel, variant: 'primary', flex: 1 },
  ];
  if (wishlist) {
    ctaRow.push({ type: 'button', icon: 'heart', variant: 'secondary' });
  }
  infoChildren.push({ type: 'row', gap: 8, children: ctaRow });

  return [{
    type: 'row',
    gap: 48,
    padding: [24, 24],
    align: 'start',
    children: [
      { type: 'stack', flex: 1, gap: 0, children: imageChildren },
      { type: 'stack', flex: 1, gap: 4, children: infoChildren },
    ],
  }];
}
