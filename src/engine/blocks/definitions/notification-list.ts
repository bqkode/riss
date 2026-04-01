// Block: notification-list

export function expand(params: any): any[] {
  const title = params.title || 'Notifications';
  const items = params.items || [];
  const markAllRead = params['mark-all-read'] !== false;

  const children: any[] = [];

  // Header
  children.push({
    type: 'row',
    align: 'center',
    padding: [0, 0, 12, 0],
    children: [
      { type: 'text', content: title, variant: 'h4', flex: 1 },
      ...(markAllRead ? [{ type: 'button', label: 'Mark all as read', variant: 'ghost', size: 'sm' }] : []),
    ],
  });

  // Notification items
  children.push({
    type: 'stack',
    gap: 0,
    children: items.map((item: any) => {
      const isUnread = item.unread !== false;
      const iconName = item.icon || (item.type === 'success' ? 'check-circle' : item.type === 'warning' ? 'alert-triangle' : item.type === 'error' ? 'alert-circle' : 'bell');
      const iconColor = item.type === 'success' ? 'success' : item.type === 'warning' ? 'warning' : item.type === 'error' ? 'error' : 'primary';

      return {
        type: 'row',
        gap: 12,
        align: 'start',
        padding: [12, 8],
        borderBottom: true,
        background: isUnread ? 'primary-subtle' : undefined,
        borderRadius: 4,
        children: [
          { type: 'icon', name: iconName, size: 20, color: iconColor },
          {
            type: 'stack',
            flex: 1,
            gap: 2,
            children: [
              { type: 'text', content: item.title || item.message || 'Notification', variant: 'body', weight: isUnread ? 'bold' : 'normal' },
              ...(item.description ? [{ type: 'text', content: item.description, variant: 'caption', color: 'muted' }] : []),
              { type: 'text', content: item.time || item.timestamp || '', variant: 'caption', color: 'muted' },
            ],
          },
          ...(isUnread ? [{ type: 'badge', label: '', size: 8, shape: 'circle', color: 'primary' }] : []),
        ],
      };
    }),
  });

  return [{
    type: 'card',
    padding: 16,
    width: 380,
    children: [{ type: 'stack', gap: 0, children }],
  }];
}
