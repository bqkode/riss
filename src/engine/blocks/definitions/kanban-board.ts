// Block: kanban-board

export function expand(params: any): any[] {
  const columns = params.columns || [];
  const addCard = params['add-card'] !== false;

  return [{
    type: 'row',
    gap: 16,
    padding: [16, 24],
    align: 'start',
    overflow: 'scroll',
    children: columns.map((col: any) => {
      const colTitle = typeof col === 'string' ? col : col.title || col.label;
      const cards = typeof col === 'object' ? (col.cards || col.items || []) : [];
      const count = cards.length;

      const colChildren: any[] = [
        {
          type: 'row',
          align: 'center',
          padding: [0, 0, 8, 0],
          children: [
            { type: 'text', content: colTitle, variant: 'caption', weight: 'bold', color: 'muted', flex: 1 },
            { type: 'badge', label: String(count), variant: 'subtle', size: 'sm' },
          ],
        },
      ];

      for (const card of cards) {
        const cardContent: any[] = [
          { type: 'text', content: card.title || card.label || 'Task', variant: 'body' },
        ];

        if (card.tags || card.labels) {
          const tags = card.tags || card.labels || [];
          cardContent.push({
            type: 'row',
            gap: 4,
            wrap: true,
            children: tags.map((tag: any) => ({
              type: 'chip',
              label: typeof tag === 'string' ? tag : tag.label,
              color: typeof tag === 'object' ? tag.color : undefined,
              size: 'sm',
            })),
          });
        }

        if (card.assignee || card.priority) {
          const metaRow: any[] = [];
          if (card.priority) {
            metaRow.push({ type: 'icon', name: 'flag', size: 14, color: card.priority === 'high' ? 'error' : 'muted' });
          }
          metaRow.push({ type: 'spacer', flex: 1 });
          if (card.assignee) {
            metaRow.push({ type: 'avatar', label: card.assignee, size: 20 });
          }
          cardContent.push({ type: 'row', align: 'center', gap: 4, children: metaRow });
        }

        colChildren.push({
          type: 'card',
          padding: 12,
          children: [{ type: 'stack', gap: 8, children: cardContent }],
        });
      }

      if (addCard) {
        colChildren.push({
          type: 'button',
          label: '+ Add card',
          variant: 'ghost',
          size: 'sm',
          width: '100%',
        });
      }

      return {
        type: 'stack',
        width: 280,
        gap: 8,
        padding: 8,
        background: 'surface-alt',
        borderRadius: 8,
        children: colChildren,
      };
    }),
  }];
}
