// Block: product-card-grid

export function expand(params: any): any[] {
  const columns = params.columns || 4;
  const items = params.items || [];
  const showRating = params['show-rating'] !== false;
  const showCartButton = params['show-cart-button'] !== false;

  return [{
    type: 'grid',
    columns,
    gap: 20,
    padding: [16, 24],
    children: items.map((item: any) => {
      const cardChildren: any[] = [
        { type: 'image', label: item.image || item['image-label'] || 'Product', aspect: '1:1' },
        {
          type: 'stack',
          padding: 12,
          gap: 6,
          children: [
            ...(item.category ? [{ type: 'text', content: item.category, variant: 'overline', color: 'muted' }] : []),
            { type: 'text', content: item.title || item.name || 'Product', variant: 'subtitle', lines: 2 },
            ...(showRating && item.rating ? [{
              type: 'row',
              gap: 4,
              align: 'center',
              children: [
                {
                  type: 'row',
                  gap: 1,
                  children: Array.from({ length: 5 }, (_, i) => ({
                    type: 'icon',
                    name: i < Math.floor(item.rating) ? 'star-filled' : 'star',
                    size: 12,
                    color: i < item.rating ? 'warning' : 'muted',
                  })),
                },
                ...(item.reviews ? [{ type: 'text', content: `(${item.reviews})`, variant: 'caption', color: 'muted' }] : []),
              ],
            }] : []),
            {
              type: 'row',
              gap: 8,
              align: 'center',
              children: [
                { type: 'text', content: item.price || '$0', variant: 'subtitle', weight: 'bold' },
                ...(item['original-price'] ? [{
                  type: 'text',
                  content: item['original-price'],
                  variant: 'caption',
                  color: 'muted',
                  strikethrough: true,
                }] : []),
              ],
            },
            ...(showCartButton ? [{
              type: 'button',
              label: 'Add to cart',
              variant: 'secondary',
              size: 'sm',
              width: '100%',
            }] : []),
          ],
        },
      ];

      return { type: 'card', children: cardChildren };
    }),
  }];
}
