// Block: announcement-bar

export function expand(params: any): any[] {
  const message = params.message || 'Announcement';
  const action = params.action;
  const color = params.color || 'primary';
  const dismissable = params.dismissable !== false;

  const children: any[] = [
    { type: 'text', content: message, variant: 'caption', color: 'on-primary', align: 'center', flex: 1 },
  ];

  if (action) {
    children.push({
      type: 'button',
      label: typeof action === 'string' ? action : action.label,
      variant: 'ghost',
      size: 'sm',
      color: 'on-primary',
    });
  }

  if (dismissable) {
    children.push({ type: 'icon', name: 'x', size: 16, color: 'on-primary' });
  }

  return [{
    type: 'row',
    align: 'center',
    justify: 'center',
    padding: [8, 16],
    gap: 12,
    background: color,
    children,
  }];
}
