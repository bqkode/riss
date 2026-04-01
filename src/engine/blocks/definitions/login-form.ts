// Block: login-form

export function expand(params: any): any[] {
  const logo = params.logo;
  const heading = params.heading || 'Sign in';
  const subheading = params.subheading;
  const email = params.email !== false;
  const password = params.password !== false;
  const rememberMe = params['remember-me'] !== false;
  const forgotPassword = params['forgot-password'] !== false;
  const social = params.social || [];
  const signupLink = params['signup-link'];
  const ctaLabel = params['cta-label'] || 'Sign in';

  const children: any[] = [];

  if (logo) {
    children.push({ type: 'image', label: logo, height: 40, align: 'center' });
    children.push({ type: 'spacer', height: 24 });
  }

  children.push({ type: 'text', content: heading, variant: 'h3', align: 'center' });
  if (subheading) {
    children.push({ type: 'text', content: subheading, variant: 'body', color: 'muted', align: 'center' });
  }

  children.push({ type: 'spacer', height: 24 });

  if (email) {
    children.push({ type: 'input', label: 'Email', placeholder: 'you@example.com', inputType: 'email' });
    children.push({ type: 'spacer', height: 12 });
  }

  if (password) {
    children.push({ type: 'input', label: 'Password', placeholder: 'Enter password', inputType: 'password' });
    children.push({ type: 'spacer', height: 8 });
  }

  if (rememberMe || forgotPassword) {
    children.push({
      type: 'row',
      align: 'center',
      children: [
        ...(rememberMe ? [{ type: 'checkbox', label: 'Remember me', flex: 1 }] : [{ type: 'spacer', flex: 1 }]),
        ...(forgotPassword ? [{ type: 'text', content: 'Forgot password?', variant: 'caption', color: 'link' }] : []),
      ],
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

  if (signupLink) {
    children.push({ type: 'spacer', height: 16 });
    children.push({
      type: 'text',
      content: typeof signupLink === 'string' ? signupLink : "Don't have an account? Sign up",
      variant: 'caption',
      color: 'link',
      align: 'center',
    });
  }

  return [{
    type: 'card',
    width: 400,
    padding: 32,
    margin: [0, 'auto'],
    children: [{ type: 'stack', gap: 0, children }],
  }];
}
