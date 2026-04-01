// Block: contact-form

export function expand(params: any): any[] {
  const title = params.title || 'Contact us';
  const description = params.description;
  const fields = params.fields || [
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'message', label: 'Message', type: 'textarea' },
  ];
  const ctaLabel = params['cta-label'] || 'Send message';

  const children: any[] = [
    { type: 'text', content: title, variant: 'h3' },
  ];

  if (description) {
    children.push({ type: 'text', content: description, variant: 'body', color: 'muted' });
  }

  children.push({ type: 'spacer', height: 20 });

  for (const field of fields) {
    const fieldDef = typeof field === 'string'
      ? { name: field, label: field.charAt(0).toUpperCase() + field.slice(1), type: 'text' }
      : field;

    if (fieldDef.type === 'textarea') {
      children.push({
        type: 'input',
        label: fieldDef.label || fieldDef.name,
        placeholder: fieldDef.placeholder || '',
        multiline: true,
        rows: 4,
      });
    } else if (fieldDef.type === 'select') {
      children.push({
        type: 'select',
        label: fieldDef.label || fieldDef.name,
        options: fieldDef.options || [],
        placeholder: fieldDef.placeholder || `Select ${fieldDef.label || fieldDef.name}`,
      });
    } else {
      children.push({
        type: 'input',
        label: fieldDef.label || fieldDef.name,
        placeholder: fieldDef.placeholder || '',
        inputType: fieldDef.type || 'text',
      });
    }
    children.push({ type: 'spacer', height: 12 });
  }

  children.push({ type: 'spacer', height: 8 });
  children.push({ type: 'button', label: ctaLabel, variant: 'primary' });

  return [{
    type: 'card',
    width: 480,
    padding: 32,
    margin: [0, 'auto'],
    children: [{ type: 'stack', gap: 0, children }],
  }];
}
