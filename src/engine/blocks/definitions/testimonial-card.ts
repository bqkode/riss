// Block: testimonial-card

export function expand(params: any): any[] {
  const quote = params.quote || '';
  const author = params.author || '';
  const role = params.role;
  const company = params.company;
  const avatar = params.avatar;
  const rating = params.rating;

  const children: any[] = [];

  if (rating) {
    children.push({
      type: 'row',
      gap: 2,
      children: Array.from({ length: 5 }, (_, i) => ({
        type: 'icon',
        name: i < rating ? 'star-filled' : 'star',
        size: 16,
        color: i < rating ? 'warning' : 'muted',
      })),
    });
    children.push({ type: 'spacer', height: 8 });
  }

  children.push({ type: 'text', content: `"${quote}"`, variant: 'body-lg', style: 'italic' });
  children.push({ type: 'spacer', height: 16 });

  const authorRow: any[] = [];
  if (avatar) {
    authorRow.push({ type: 'avatar', label: avatar, size: 40 });
  }

  const authorInfo: any[] = [
    { type: 'text', content: author, variant: 'subtitle' },
  ];
  if (role || company) {
    const subtitle = [role, company].filter(Boolean).join(', ');
    authorInfo.push({ type: 'text', content: subtitle, variant: 'caption', color: 'muted' });
  }
  authorRow.push({ type: 'stack', gap: 2, children: authorInfo });

  children.push({ type: 'row', gap: 12, align: 'center', children: authorRow });

  return [{
    type: 'card',
    padding: 24,
    children: [{ type: 'stack', gap: 0, children }],
  }];
}
