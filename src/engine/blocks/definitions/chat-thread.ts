// Block: chat-thread

export function expand(params: any): any[] {
  const messages = params.messages || [];
  const input = params.input !== false;
  const inputPlaceholder = params['input-placeholder'] || 'Type a message...';
  const header = params.header;

  const children: any[] = [];

  // Header
  if (header) {
    children.push({
      type: 'row',
      align: 'center',
      padding: [12, 16],
      borderBottom: true,
      gap: 12,
      children: [
        ...(typeof header === 'object' && header.avatar
          ? [{ type: 'avatar', label: header.avatar, size: 32 }]
          : []),
        {
          type: 'stack',
          flex: 1,
          gap: 2,
          children: [
            { type: 'text', content: typeof header === 'string' ? header : header.name || header.title || 'Chat', variant: 'subtitle' },
            ...(typeof header === 'object' && header.status
              ? [{ type: 'text', content: header.status, variant: 'caption', color: 'success' }]
              : []),
          ],
        },
        { type: 'icon', name: 'more-horizontal', size: 20, color: 'muted' },
      ],
    });
  }

  // Messages area
  children.push({
    type: 'stack',
    flex: 1,
    gap: 12,
    padding: [16, 16],
    overflow: 'scroll',
    children: messages.map((msg: any) => {
      const isSent = msg.sent || msg.self || msg.position === 'right';
      const content = typeof msg === 'string' ? msg : msg.content || msg.text || '';
      const sender = typeof msg === 'object' ? msg.sender || msg.from : undefined;
      const time = typeof msg === 'object' ? msg.time || msg.timestamp : undefined;

      return {
        type: 'row',
        justify: isSent ? 'end' : 'start',
        gap: 8,
        children: [
          ...(!isSent && sender ? [{ type: 'avatar', label: sender, size: 28 }] : []),
          {
            type: 'stack',
            gap: 2,
            maxWidth: '70%',
            children: [
              {
                type: 'card',
                padding: [8, 12],
                background: isSent ? 'primary' : 'surface-alt',
                borderRadius: 12,
                children: [
                  { type: 'text', content, variant: 'body', color: isSent ? 'on-primary' : 'default' },
                ],
              },
              ...(time ? [{ type: 'text', content: time, variant: 'caption', color: 'muted', align: isSent ? 'right' : 'left' }] : []),
            ],
          },
        ],
      };
    }),
  });

  // Input area
  if (input) {
    children.push({
      type: 'row',
      align: 'center',
      padding: [12, 16],
      gap: 8,
      borderTop: true,
      children: [
        { type: 'icon', name: 'paperclip', size: 20, color: 'muted' },
        { type: 'input', placeholder: inputPlaceholder, flex: 1 },
        { type: 'button', icon: 'send', variant: 'primary', size: 'sm' },
      ],
    });
  }

  return [{
    type: 'stack',
    gap: 0,
    height: 480,
    border: true,
    borderRadius: 8,
    children,
  }];
}
