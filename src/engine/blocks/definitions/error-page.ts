// Block: error-page

export function expand(params: any): any[] {
  const code = params.code || '404';
  const title = params.title || 'Page not found';
  const message = params.message || "The page you're looking for doesn't exist.";
  const ctaLabel = params['cta-label'] || 'Go home';
  const icon = params.icon;

  const children: any[] = [];

  if (icon) {
    children.push({ type: 'icon', name: icon, size: 64, color: 'muted' });
    children.push({ type: 'spacer', height: 16 });
  }

  children.push({ type: 'text', content: String(code), variant: 'h1', align: 'center', color: 'muted', size: 72 });
  children.push({ type: 'text', content: title, variant: 'h3', align: 'center' });
  children.push({ type: 'text', content: message, variant: 'body', color: 'muted', align: 'center' });
  children.push({ type: 'spacer', height: 24 });
  children.push({ type: 'button', label: ctaLabel, variant: 'primary' });

  return [{
    type: 'stack',
    align: 'center',
    justify: 'center',
    padding: 64,
    gap: 8,
    minHeight: 400,
    children,
  }];
}
