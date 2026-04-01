// Block: signup-form

export function expand(params: any): any[] {
  const logo = params.logo;
  const heading = params.heading || 'Create an account';
  const fields = params.fields || ['name', 'email', 'password'];
  const social = params.social || [];
  const terms = params.terms;
  const loginLink = params['login-link'];
  const ctaLabel = params['cta-label'] || 'Sign up';

  const children: any[] = [];

  if (logo) {
    children.push({ type: 'image', label: logo, height: 40, align: 'center' });
    children.push({ type: 'spacer', height: 24 });
  }

  children.push({ type: 'text', content: heading, variant: 'h3', align: 'center' });
  children.push({ type: 'spacer', height: 24 });

  for (const field of fields) {
    const fieldDef = typeof field === 'string'
      ? { name: field, label: field.charAt(0).toUpperCase() + field.slice(1), type: field === 'password' ? 'password' : field === 'email' ? 'email' : 'text' }
      : field;

    children.push({
      type: 'input',
      label: fieldDef.label || fieldDef.name,
      placeholder: fieldDef.placeholder || `Enter ${fieldDef.label || fieldDef.name}`,
      inputType: fieldDef.type || 'text',
    });
    children.push({ type: 'spacer', height: 12 });
  }

  if (terms) {
    children.push({
      type: 'checkbox',
      label: typeof terms === 'string' ? terms : 'I agree to the Terms of Service and Privacy Policy',
    });
    children.push({ type: 'spacer', height: 16 });
  }

  children.push({ type: 'button', label: ctaLabel, variant: 'primary', width: '100%' });

  if (social.length > 0) {
    children.push({ type: 'spacer', height: 16 });
    children.push({
      type: 'row',
      align: 'center',
      gap: 16,
      children: [
        { type: 'divider', flex: 1 },
        { type: 'text', content: 'or', variant: 'caption', color: 'muted' },
        { type: 'divider', flex: 1 },
      ],
    });
    children.push({ type: 'spacer', height: 16 });
    children.push({
      type: 'stack',
      gap: 8,
      children: social.map((s: any) => ({
        type: 'button',
        label: `Continue with ${typeof s === 'string' ? s : s.label}`,
        variant: 'secondary',
        icon: typeof s === 'object' ? s.icon : s.toLowerCase(),
        width: '100%',
      })),
    });
  }

  if (loginLink) {
    children.push({ type: 'spacer', height: 16 });
    children.push({
      type: 'text',
      content: typeof loginLink === 'string' ? loginLink : 'Already have an account? Sign in',
      variant: 'caption',
      color: 'link',
      align: 'center',
    });
  }

  return [{
    type: 'card',
    width: 420,
    padding: 32,
    margin: [0, 'auto'],
    children: [{ type: 'stack', gap: 0, children }],
  }];
}
