// Block: loading-skeleton

export function expand(params: any): any[] {
  const variant = params.variant || 'card';
  const count = params.count || 3;
  const columns = params.columns || count;

  if (variant === 'table') {
    return [{
      type: 'stack',
      gap: 0,
      padding: [16, 24],
      children: [
        // Header row
        {
          type: 'row',
          gap: 12,
          padding: [8, 0],
          background: 'surface-alt',
          children: Array.from({ length: 4 }, () => ({
            type: 'placeholder',
            height: 16,
            flex: 1,
            background: 'skeleton',
            borderRadius: 4,
          })),
        },
        // Data rows
        ...Array.from({ length: count }, () => ({
          type: 'row',
          gap: 12,
          padding: [12, 0],
          borderBottom: true,
          children: Array.from({ length: 4 }, () => ({
            type: 'placeholder',
            height: 14,
            flex: 1,
            background: 'skeleton',
            borderRadius: 4,
          })),
        })),
      ],
    }];
  }

  if (variant === 'list') {
    return [{
      type: 'stack',
      gap: 0,
      padding: [16, 24],
      children: Array.from({ length: count }, () => ({
        type: 'row',
        gap: 12,
        align: 'center',
        padding: [12, 0],
        borderBottom: true,
        children: [
          { type: 'placeholder', width: 40, height: 40, background: 'skeleton', borderRadius: 20 },
          {
            type: 'stack',
            flex: 1,
            gap: 6,
            children: [
              { type: 'placeholder', height: 14, width: '60%', background: 'skeleton', borderRadius: 4 },
              { type: 'placeholder', height: 12, width: '40%', background: 'skeleton', borderRadius: 4 },
            ],
          },
        ],
      })),
    }];
  }

  if (variant === 'text') {
    return [{
      type: 'stack',
      gap: 8,
      padding: [16, 24],
      children: Array.from({ length: count }, (_, i) => ({
        type: 'placeholder',
        height: 14,
        width: i === count - 1 ? '60%' : '100%',
        background: 'skeleton',
        borderRadius: 4,
      })),
    }];
  }

  // Default: card variant
  return [{
    type: 'grid',
    columns,
    gap: 16,
    padding: [16, 24],
    children: Array.from({ length: count }, () => ({
      type: 'card',
      children: [
        { type: 'placeholder', height: 160, background: 'skeleton' },
        {
          type: 'stack',
          padding: 16,
          gap: 8,
          children: [
            { type: 'placeholder', height: 16, width: '70%', background: 'skeleton', borderRadius: 4 },
            { type: 'placeholder', height: 12, width: '90%', background: 'skeleton', borderRadius: 4 },
            { type: 'placeholder', height: 12, width: '50%', background: 'skeleton', borderRadius: 4 },
          ],
        },
      ],
    })),
  }];
}
