// Block: multi-step-form

export function expand(params: any): any[] {
  const steps = params.steps || [];
  const currentStep = params['current-step'] || 1;
  const fields = params.fields || [];
  const ctaLabel = params['cta-label'] || 'Continue';
  const ctaSecondaryLabel = params['cta-secondary-label'] || 'Back';

  const children: any[] = [];

  // Step indicator
  if (steps.length > 0) {
    children.push({
      type: 'row',
      gap: 0,
      align: 'center',
      justify: 'center',
      children: steps.flatMap((step: any, i: number) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;
        const label = typeof step === 'string' ? step : step.label;

        const items: any[] = [{
          type: 'stack',
          align: 'center',
          gap: 4,
          children: [
            {
              type: 'badge',
              label: isComplete ? '✓' : String(stepNum),
              variant: isActive ? 'primary' : isComplete ? 'success' : 'muted',
              size: 32,
              shape: 'circle',
            },
            { type: 'text', content: label, variant: 'caption', color: isActive ? 'default' : 'muted' },
          ],
        }];

        if (i < steps.length - 1) {
          items.push({ type: 'divider', width: 48, color: isComplete ? 'success' : 'muted' });
        }
        return items;
      }),
    });
    children.push({ type: 'spacer', height: 32 });
  }

  // Form fields
  for (const field of fields) {
    const f = typeof field === 'string'
      ? { name: field, label: field.charAt(0).toUpperCase() + field.slice(1) }
      : field;

    if (f.type === 'textarea') {
      children.push({ type: 'input', label: f.label, placeholder: f.placeholder || '', multiline: true, rows: 3 });
    } else if (f.type === 'select') {
      children.push({ type: 'select', label: f.label, options: f.options || [], placeholder: f.placeholder || '' });
    } else if (f.type === 'checkbox') {
      children.push({ type: 'checkbox', label: f.label });
    } else {
      children.push({ type: 'input', label: f.label, placeholder: f.placeholder || '', inputType: f.type || 'text' });
    }
    children.push({ type: 'spacer', height: 12 });
  }

  // Actions
  children.push({ type: 'spacer', height: 16 });
  children.push({
    type: 'row',
    gap: 12,
    justify: 'end',
    children: [
      ...(currentStep > 1 ? [{ type: 'button', label: ctaSecondaryLabel, variant: 'secondary' }] : []),
      { type: 'button', label: ctaLabel, variant: 'primary' },
    ],
  });

  return [{
    type: 'card',
    width: 560,
    padding: 32,
    margin: [0, 'auto'],
    children: [{ type: 'stack', gap: 0, children }],
  }];
}
