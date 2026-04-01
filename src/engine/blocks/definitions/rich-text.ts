// Block: rich-text

export function expand(params: any): any[] {
  const content = params.content || '';
  const maxWidth = params['max-width'] || 720;

  return [{
    type: 'stack',
    maxWidth,
    padding: [24, 24],
    margin: [0, 'auto'],
    children: [
      { type: 'text', content, variant: 'body', rich: true },
    ],
  }];
}
