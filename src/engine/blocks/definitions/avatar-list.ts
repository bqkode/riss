// Block: avatar-list

export function expand(params: any): any[] {
  const items = params.items || [];
  const stacked = params.stacked || false;
  const maxVisible = params['max-visible'] || items.length;

  const visibleItems = items.slice(0, maxVisible);
  const remaining = items.length - maxVisible;

  if (stacked) {
    const children: any[] = visibleItems.map((item: any, i: number) => ({
      type: 'avatar',
      label: typeof item === 'string' ? item : item.name || item.label,
      size: typeof item === 'object' ? item.size || 36 : 36,
      marginLeft: i > 0 ? -12 : 0,
      border: true,
    }));

    if (remaining > 0) {
      children.push({
        type: 'badge',
        label: `+${remaining}`,
        size: 36,
        shape: 'circle',
        variant: 'muted',
        marginLeft: -12,
      });
    }

    return [{
      type: 'row',
      gap: 0,
      align: 'center',
      children,
    }];
  }

  // Non-stacked: list with details
  return [{
    type: 'stack',
    gap: 8,
    children: [
      ...visibleItems.map((item: any) => ({
        type: 'row',
        gap: 12,
        align: 'center',
        children: [
          { type: 'avatar', label: typeof item === 'string' ? item : item.name || item.label, size: 36 },
          {
            type: 'stack',
            gap: 2,
            flex: 1,
            children: [
              { type: 'text', content: typeof item === 'string' ? item : item.name || '', variant: 'body' },
              ...(typeof item === 'object' && item.subtitle ? [{ type: 'text', content: item.subtitle, variant: 'caption', color: 'muted' }] : []),
            ],
          },
        ],
      })),
      ...(remaining > 0 ? [{ type: 'text', content: `+${remaining} more`, variant: 'caption', color: 'link' }] : []),
    ],
  }];
}
