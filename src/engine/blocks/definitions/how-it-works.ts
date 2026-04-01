// Block: how-it-works

export function expand(params: any): any[] {
  const title = params.title;
  const items = params.items || [];
  const variant = params.variant || 'horizontal';
  const numbered = params.numbered !== false;
  const connector = params.connector !== false;

  const children: any[] = [];

  if (title) {
    children.push({ type: 'text', content: title, variant: 'h2', align: 'center' });
    children.push({ type: 'spacer', height: 32 });
  }

  const stepItems = items.map((item: any, i: number) => {
    const stepChildren: any[] = [];

    if (numbered) {
      stepChildren.push({
        type: 'badge',
        label: String(i + 1),
        variant: 'circle',
        color: 'primary',
        size: 40,
      });
    } else if (item.icon) {
      stepChildren.push({ type: 'icon', name: item.icon, size: 32, color: 'primary' });
    }

    stepChildren.push({ type: 'text', content: item.title || `Step ${i + 1}`, variant: 'subtitle', align: 'center' });
    if (item.description) {
      stepChildren.push({ type: 'text', content: item.description, variant: 'body', color: 'muted', align: 'center' });
    }

    return {
      type: 'stack',
      align: 'center',
      gap: 12,
      flex: 1,
      children: stepChildren,
    };
  });

  if (variant === 'horizontal') {
    const rowChildren: any[] = [];
    stepItems.forEach((step: any, i: number) => {
      rowChildren.push(step);
      if (connector && i < stepItems.length - 1) {
        rowChildren.push({ type: 'icon', name: 'arrow-right', size: 20, color: 'muted' });
      }
    });
    children.push({ type: 'row', gap: 24, align: 'start', children: rowChildren });
  } else {
    const stackChildren: any[] = [];
    stepItems.forEach((step: any, i: number) => {
      stackChildren.push(step);
      if (connector && i < stepItems.length - 1) {
        stackChildren.push({ type: 'icon', name: 'arrow-down', size: 20, color: 'muted', align: 'center' });
      }
    });
    children.push({ type: 'stack', gap: 16, align: 'center', children: stackChildren });
  }

  return [{
    type: 'stack',
    padding: 48,
    children,
  }];
}
