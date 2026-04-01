// Block: timeline

export function expand(params: any): any[] {
  const items = params.items || [];
  const variant = params.variant || 'left';
  const color = params.color || 'primary';

  return [{
    type: 'stack',
    padding: [32, 24],
    gap: 0,
    children: items.map((item: any, i: number) => {
      const dot: any = {
        type: 'stack',
        align: 'center',
        width: 32,
        children: [
          { type: 'icon', name: item.icon || 'circle', size: 12, color: item.color || color },
          ...(i < items.length - 1 ? [{ type: 'divider', orientation: 'vertical', height: '100%' }] : []),
        ],
      };

      const content: any = {
        type: 'stack',
        flex: 1,
        padding: [0, 0, 24, 12],
        gap: 4,
        children: [
          { type: 'text', content: item.title || `Step ${i + 1}`, variant: 'subtitle' },
          ...(item.date ? [{ type: 'text', content: item.date, variant: 'caption', color: 'muted' }] : []),
          ...(item.description ? [{ type: 'text', content: item.description, variant: 'body', color: 'muted' }] : []),
        ],
      };

      if (variant === 'right') {
        return { type: 'row', gap: 0, children: [content, dot] };
      }
      if (variant === 'alternating') {
        return i % 2 === 0
          ? { type: 'row', gap: 0, children: [content, dot, { type: 'spacer', flex: 1 }] }
          : { type: 'row', gap: 0, children: [{ type: 'spacer', flex: 1 }, dot, content] };
      }
      return { type: 'row', gap: 0, children: [dot, content] };
    }),
  }];
}
