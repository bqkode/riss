// Block: media-gallery

export function expand(params: any): any[] {
  const columns = params.columns || 3;
  const items = params.items || [];
  const aspect = params.aspect || '1:1';
  const gap = params.gap || 8;

  return [{
    type: 'grid',
    columns,
    gap,
    padding: [16, 24],
    children: items.map((item: any) => ({
      type: 'image',
      label: typeof item === 'string' ? item : item.label || item.image || 'Media',
      aspect,
      borderRadius: 4,
      overlay: typeof item === 'object' && item.caption ? {
        type: 'text',
        content: item.caption,
        variant: 'caption',
        color: 'on-primary',
      } : undefined,
    })),
  }];
}
