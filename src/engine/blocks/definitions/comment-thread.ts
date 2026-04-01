// Block: comment-thread

export function expand(params: any): any[] {
  const title = params.title || 'Comments';
  const count = params.count;
  const items = params.items || [];
  const showInput = params['show-input'] !== false;

  const children: any[] = [];

  // Header
  children.push({
    type: 'row',
    align: 'center',
    gap: 8,
    children: [
      { type: 'text', content: title, variant: 'h4', flex: 1 },
      ...(count !== undefined ? [{ type: 'badge', label: String(count), variant: 'subtle' }] : []),
    ],
  });
  children.push({ type: 'spacer', height: 16 });

  // Input
  if (showInput) {
    children.push({
      type: 'row',
      gap: 12,
      align: 'start',
      children: [
        { type: 'avatar', label: 'You', size: 32 },
        {
          type: 'stack',
          flex: 1,
          gap: 8,
          children: [
            { type: 'input', placeholder: 'Write a comment...', multiline: true, rows: 2 },
            { type: 'row', justify: 'end', children: [{ type: 'button', label: 'Comment', variant: 'primary', size: 'sm' }] },
          ],
        },
      ],
    });
    children.push({ type: 'spacer', height: 16 });
    children.push({ type: 'divider' });
    children.push({ type: 'spacer', height: 8 });
  }

  // Comments
  function renderComment(comment: any, depth: number = 0): any {
    const replies = comment.replies || [];
    return {
      type: 'stack',
      gap: 0,
      paddingLeft: depth * 32,
      children: [
        {
          type: 'row',
          gap: 12,
          align: 'start',
          padding: [12, 0],
          children: [
            { type: 'avatar', label: comment.author || comment.user || 'User', size: 32 },
            {
              type: 'stack',
              flex: 1,
              gap: 4,
              children: [
                {
                  type: 'row',
                  gap: 8,
                  align: 'center',
                  children: [
                    { type: 'text', content: comment.author || comment.user || 'User', variant: 'body', weight: 'bold' },
                    { type: 'text', content: comment.time || comment.date || '', variant: 'caption', color: 'muted' },
                  ],
                },
                { type: 'text', content: comment.content || comment.text || '', variant: 'body' },
                {
                  type: 'row',
                  gap: 12,
                  children: [
                    { type: 'text', content: 'Reply', variant: 'caption', color: 'link' },
                    ...(comment.likes !== undefined ? [{
                      type: 'row',
                      gap: 4,
                      align: 'center',
                      children: [
                        { type: 'icon', name: 'heart', size: 12, color: 'muted' },
                        { type: 'text', content: String(comment.likes), variant: 'caption', color: 'muted' },
                      ],
                    }] : []),
                  ],
                },
              ],
            },
          ],
        },
        ...replies.map((reply: any) => renderComment(reply, depth + 1)),
      ],
    };
  }

  children.push({
    type: 'stack',
    gap: 0,
    children: items.map((item: any) => renderComment(item)),
  });

  return [{
    type: 'stack',
    padding: [24, 24],
    gap: 0,
    children,
  }];
}
