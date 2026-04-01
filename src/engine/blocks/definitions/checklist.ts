// Block: checklist

export function expand(params: any): any[] {
  const title = params.title;
  const items = params.items || [];
  const columns = params.columns || 1;
  const icon = params.icon || 'check';
  const iconColor = params['icon-color'] || 'success';

  const children: any[] = [];

  if (title) {
    children.push({ type: 'text', content: title, variant: 'h3' });
    children.push({ type: 'spacer', height: 16 });
  }

  const listItems = items.map((item: any) => ({
    type: 'row',
    gap: 8,
    align: 'center',
    padding: [4, 0],
    children: [
      { type: 'icon', name: icon, size: 16, color: iconColor },
      { type: 'text', content: typeof item === 'string' ? item : item.label || item.text, variant: 'body' },
    ],
  }));

  if (columns > 1) {
    children.push({
      type: 'grid',
      columns,
      gap: 8,
      children: listItems,
    });
  } else {
    children.push({
      type: 'stack',
      gap: 4,
      children: listItems,
    });
  }

  return [{
    type: 'stack',
    padding: [24, 24],
    children,
  }];
}
