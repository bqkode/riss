// Block: confirmation

export function expand(params: any): any[] {
  const icon = params.icon || 'check-circle';
  const iconColor = params['icon-color'] || 'success';
  const title = params.title || 'Success!';
  const message = params.message;
  const details = params.details || [];
  const ctaLabel = params['cta-label'];
  const ctaSecondaryLabel = params['cta-secondary-label'];

  const children: any[] = [
    { type: 'icon', name: icon, size: 56, color: iconColor },
    { type: 'spacer', height: 16 },
    { type: 'text', content: title, variant: 'h3', align: 'center' },
  ];

  if (message) {
    children.push({ type: 'text', content: message, variant: 'body', color: 'muted', align: 'center' });
  }

  if (details.length > 0) {
    children.push({ type: 'spacer', height: 16 });
    children.push({
      type: 'card',
      padding: 16,
      background: 'surface-alt',
      children: [{
        type: 'stack',
        gap: 8,
        children: details.map((d: any) => ({
          type: 'row',
          children: [
            { type: 'text', content: typeof d === 'string' ? d : d.label, variant: 'caption', color: 'muted', flex: 1 },
            { type: 'text', content: typeof d === 'object' ? d.value : '', variant: 'body' },
          ],
        })),
      }],
    });
  }

  const buttons: any[] = [];
  if (ctaLabel) {
    buttons.push({ type: 'button', label: ctaLabel, variant: 'primary' });
  }
  if (ctaSecondaryLabel) {
    buttons.push({ type: 'button', label: ctaSecondaryLabel, variant: 'secondary' });
  }

  if (buttons.length > 0) {
    children.push({ type: 'spacer', height: 24 });
    children.push({ type: 'row', gap: 12, justify: 'center', children: buttons });
  }

  return [{
    type: 'stack',
    align: 'center',
    padding: [48, 24],
    gap: 8,
    children,
  }];
}
