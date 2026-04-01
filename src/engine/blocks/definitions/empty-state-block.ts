// Block: empty-state-block

export function expand(params: any): any[] {
  const icon = params.icon;
  const title = params.title || 'No items found';
  const message = params.message;
  const ctaLabel = params['cta-label'];
  const imageLabel = params['image-label'];

  const children: any[] = [];

  if (imageLabel) {
    children.push({ type: 'image', label: imageLabel, width: 200, height: 160 });
    children.push({ type: 'spacer', height: 16 });
  } else if (icon) {
    children.push({ type: 'icon', name: icon, size: 48, color: 'muted' });
    children.push({ type: 'spacer', height: 16 });
  }

  children.push({ type: 'text', content: title, variant: 'h4', align: 'center' });

  if (message) {
    children.push({ type: 'text', content: message, variant: 'body', color: 'muted', align: 'center' });
  }

  if (ctaLabel) {
    children.push({ type: 'spacer', height: 16 });
    children.push({ type: 'button', label: ctaLabel, variant: 'primary' });
  }

  return [{
    type: 'stack',
    align: 'center',
    padding: [64, 24],
    gap: 8,
    children,
  }];
}
