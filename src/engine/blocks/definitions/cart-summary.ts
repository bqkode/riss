// Block: cart-summary

export function expand(params: any): any[] {
  const items = params.items || [];
  const subtotal = params.subtotal || '$0';
  const shipping = params.shipping;
  const discount = params.discount;
  const total = params.total || '$0';
  const ctaLabel = params['cta-label'] || 'Checkout';
  const promoCode = params['promo-code'] !== false;

  const children: any[] = [];

  // Cart items
  children.push({
    type: 'stack',
    gap: 0,
    children: items.map((item: any) => ({
      type: 'row',
      gap: 12,
      align: 'center',
      padding: [12, 0],
      borderBottom: true,
      children: [
        { type: 'image', label: item.image || item['image-label'] || 'Product', width: 64, height: 64 },
        {
          type: 'stack',
          flex: 1,
          gap: 2,
          children: [
            { type: 'text', content: item.title || item.name || 'Item', variant: 'body' },
            ...(item.variant ? [{ type: 'text', content: item.variant, variant: 'caption', color: 'muted' }] : []),
            {
              type: 'row',
              gap: 8,
              align: 'center',
              children: [
                { type: 'text', content: `Qty: ${item.quantity || 1}`, variant: 'caption' },
              ],
            },
          ],
        },
        { type: 'text', content: item.price || '$0', variant: 'body', weight: 'bold' },
        { type: 'icon', name: 'x', size: 16, color: 'muted' },
      ],
    })),
  });

  children.push({ type: 'spacer', height: 16 });

  // Promo code
  if (promoCode) {
    children.push({
      type: 'row',
      gap: 8,
      children: [
        { type: 'input', placeholder: 'Promo code', flex: 1, size: 'sm' },
        { type: 'button', label: 'Apply', variant: 'secondary', size: 'sm' },
      ],
    });
    children.push({ type: 'spacer', height: 16 });
  }

  children.push({ type: 'divider' });
  children.push({ type: 'spacer', height: 12 });

  // Totals
  children.push({
    type: 'row',
    children: [
      { type: 'text', content: 'Subtotal', variant: 'body', color: 'muted', flex: 1 },
      { type: 'text', content: subtotal, variant: 'body' },
    ],
  });

  if (shipping) {
    children.push({
      type: 'row',
      padding: [4, 0],
      children: [
        { type: 'text', content: 'Shipping', variant: 'body', color: 'muted', flex: 1 },
        { type: 'text', content: shipping, variant: 'body' },
      ],
    });
  }

  if (discount) {
    children.push({
      type: 'row',
      padding: [4, 0],
      children: [
        { type: 'text', content: 'Discount', variant: 'body', color: 'success', flex: 1 },
        { type: 'text', content: `-${discount}`, variant: 'body', color: 'success' },
      ],
    });
  }

  children.push({ type: 'spacer', height: 8 });
  children.push({ type: 'divider' });
  children.push({ type: 'spacer', height: 8 });

  children.push({
    type: 'row',
    children: [
      { type: 'text', content: 'Total', variant: 'subtitle', weight: 'bold', flex: 1 },
      { type: 'text', content: total, variant: 'h4' },
    ],
  });

  children.push({ type: 'spacer', height: 20 });
  children.push({ type: 'button', label: ctaLabel, variant: 'primary', width: '100%' });

  return [{
    type: 'card',
    padding: 24,
    width: 400,
    children: [{ type: 'stack', gap: 0, children }],
  }];
}
