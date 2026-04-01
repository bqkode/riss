// Block: checkout-steps

export function expand(params: any): any[] {
  const steps = params.steps || ['Cart', 'Shipping', 'Payment', 'Review'];
  const currentStep = params['current-step'] || 1;
  const variant = params.variant || 'default';

  return [{
    type: 'row',
    align: 'center',
    justify: 'center',
    padding: [16, 24],
    gap: 0,
    children: steps.flatMap((step: any, i: number) => {
      const stepNum = i + 1;
      const label = typeof step === 'string' ? step : step.label;
      const isActive = stepNum === currentStep;
      const isComplete = stepNum < currentStep;

      const stepEl: any = {
        type: 'row',
        gap: 8,
        align: 'center',
        children: [
          variant === 'numbered' ? {
            type: 'badge',
            label: isComplete ? '✓' : String(stepNum),
            variant: isActive ? 'primary' : isComplete ? 'success' : 'muted',
            size: 28,
            shape: 'circle',
          } : {
            type: 'icon',
            name: isComplete ? 'check-circle' : 'circle',
            size: 20,
            color: isActive ? 'primary' : isComplete ? 'success' : 'muted',
          },
          { type: 'text', content: label, variant: 'body', color: isActive ? 'primary' : isComplete ? 'default' : 'muted', weight: isActive ? 'bold' : 'normal' },
        ],
      };

      const items: any[] = [stepEl];
      if (i < steps.length - 1) {
        items.push({
          type: 'divider',
          width: 40,
          color: isComplete ? 'success' : 'muted',
          margin: [0, 8],
        });
      }
      return items;
    }),
  }];
}
