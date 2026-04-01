// Block: rating-block

export function expand(params: any): any[] {
  const rating = params.rating || 0;
  const totalReviews = params['total-reviews'];
  const breakdown = params.breakdown || [];
  const variant = params.variant || 'summary';

  const children: any[] = [];

  // Star display
  children.push({
    type: 'row',
    gap: 4,
    align: 'center',
    children: [
      {
        type: 'row',
        gap: 2,
        children: Array.from({ length: 5 }, (_, i) => ({
          type: 'icon',
          name: i < Math.floor(rating) ? 'star-filled' : (i < rating ? 'star-half' : 'star'),
          size: 24,
          color: 'warning',
        })),
      },
      { type: 'text', content: String(rating), variant: 'h3' },
      ...(totalReviews ? [{ type: 'text', content: `(${totalReviews} reviews)`, variant: 'body', color: 'muted' }] : []),
    ],
  });

  // Breakdown bars
  if (variant === 'breakdown' && breakdown.length > 0) {
    children.push({ type: 'spacer', height: 16 });
    children.push({
      type: 'stack',
      gap: 8,
      children: breakdown.map((item: any, i: number) => ({
        type: 'row',
        gap: 8,
        align: 'center',
        children: [
          { type: 'text', content: `${5 - i} star`, variant: 'caption', width: 48 },
          { type: 'progress', value: item.percent || item.value || 0, max: 100, flex: 1 },
          { type: 'text', content: `${item.count || 0}`, variant: 'caption', color: 'muted', width: 32 },
        ],
      })),
    });
  }

  return [{
    type: 'stack',
    padding: 24,
    gap: 0,
    children,
  }];
}
