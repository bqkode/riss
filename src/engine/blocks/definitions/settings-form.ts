// Block: settings-form

export function expand(params: any): any[] {
  const title = params.title || 'Settings';
  const groups = params.groups || [];
  const saveButton = params['save-button'] !== false;
  const saveLabel = params['save-label'] || 'Save changes';

  const children: any[] = [
    { type: 'text', content: title, variant: 'h3' },
    { type: 'divider' },
  ];

  for (const group of groups) {
    children.push({ type: 'spacer', height: 16 });

    if (group.label || group.title) {
      children.push({ type: 'text', content: group.label || group.title, variant: 'subtitle' });
      if (group.description) {
        children.push({ type: 'text', content: group.description, variant: 'caption', color: 'muted' });
      }
      children.push({ type: 'spacer', height: 12 });
    }

    const groupFields = group.fields || group.items || [];
    for (const field of groupFields) {
      const f = typeof field === 'string'
        ? { name: field, label: field, type: 'text' }
        : field;

      if (f.type === 'toggle') {
        children.push({
          type: 'row',
          align: 'center',
          padding: [8, 0],
          children: [
            {
              type: 'stack',
              flex: 1,
              gap: 2,
              children: [
                { type: 'text', content: f.label || f.name, variant: 'body' },
                ...(f.description ? [{ type: 'text', content: f.description, variant: 'caption', color: 'muted' }] : []),
              ],
            },
            { type: 'toggle', value: f.value ?? false },
          ],
        });
      } else if (f.type === 'select') {
        children.push({
          type: 'row',
          align: 'center',
          padding: [8, 0],
          children: [
            { type: 'text', content: f.label || f.name, variant: 'body', flex: 1 },
            { type: 'select', options: f.options || [], value: f.value, width: 200 },
          ],
        });
      } else if (f.type === 'textarea') {
        children.push({ type: 'input', label: f.label, multiline: true, rows: 3, value: f.value });
      } else {
        children.push({ type: 'input', label: f.label || f.name, value: f.value, inputType: f.type || 'text' });
      }
      children.push({ type: 'spacer', height: 8 });
    }

    children.push({ type: 'divider' });
  }

  if (saveButton) {
    children.push({ type: 'spacer', height: 16 });
    children.push({
      type: 'row',
      justify: 'end',
      children: [
        { type: 'button', label: saveLabel, variant: 'primary' },
      ],
    });
  }

  return [{
    type: 'stack',
    padding: 24,
    gap: 0,
    maxWidth: 640,
    children,
  }];
}
