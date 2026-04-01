// Block: data-table

export function expand(params: any): any[] {
  const title = params.title;
  const search = params.search;
  const filters = params.filters || [];
  const columns = params.columns || [];
  const rows = params.rows || [];
  const pagination = params.pagination;
  const totalRows = params['total-rows'];
  const actions = params.actions || [];
  const striped = params.striped || false;
  const selectable = params.selectable || false;

  const children: any[] = [];

  // Header with title, search, filters, actions
  const headerRow: any[] = [];
  if (title) {
    headerRow.push({ type: 'text', content: title, variant: 'h4', flex: 1 });
  } else {
    headerRow.push({ type: 'spacer', flex: 1 });
  }

  if (search) {
    headerRow.push({
      type: 'input',
      placeholder: typeof search === 'string' ? search : 'Search...',
      width: 240,
      size: 'sm',
      icon: 'search',
    });
  }

  if (filters.length > 0) {
    for (const filter of filters) {
      headerRow.push({
        type: 'select',
        placeholder: typeof filter === 'string' ? filter : filter.label,
        options: typeof filter === 'object' ? filter.options || [] : [],
        width: 140,
        size: 'sm',
      });
    }
  }

  if (actions.length > 0) {
    for (const action of actions) {
      headerRow.push({
        type: 'button',
        label: typeof action === 'string' ? action : action.label,
        variant: typeof action === 'object' && action.variant ? action.variant : 'secondary',
        size: 'sm',
        icon: typeof action === 'object' ? action.icon : undefined,
      });
    }
  }

  children.push({ type: 'row', align: 'center', gap: 8, padding: [0, 0, 12, 0], children: headerRow });

  // Table header columns
  const tableHeaderCols: any[] = [];
  if (selectable) {
    tableHeaderCols.push({ type: 'checkbox', width: 32 });
  }
  for (const col of columns) {
    const colDef = typeof col === 'string' ? { label: col, key: col } : col;
    tableHeaderCols.push({
      type: 'text',
      content: colDef.label || colDef.key,
      variant: 'caption',
      weight: 'bold',
      color: 'muted',
      flex: colDef.flex || 1,
      width: colDef.width,
    });
  }

  // Table rows
  const tableRows: any[] = [
    { type: 'row', align: 'center', gap: 12, padding: [8, 0], background: 'surface-alt', children: tableHeaderCols },
  ];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const rowCols: any[] = [];

    if (selectable) {
      rowCols.push({ type: 'checkbox', width: 32 });
    }

    for (const col of columns) {
      const key = typeof col === 'string' ? col : col.key;
      const colType = typeof col === 'object' ? col.type : undefined;
      const value = row[key] || '';

      if (colType === 'badge') {
        rowCols.push({ type: 'badge', label: value, variant: 'subtle', flex: typeof col === 'object' ? col.flex || 1 : 1 });
      } else if (colType === 'avatar') {
        rowCols.push({
          type: 'row', gap: 8, align: 'center', flex: typeof col === 'object' ? col.flex || 1 : 1,
          children: [
            { type: 'avatar', label: value, size: 28 },
            { type: 'text', content: value, variant: 'body' },
          ],
        });
      } else {
        rowCols.push({
          type: 'text',
          content: String(value),
          variant: 'body',
          flex: typeof col === 'object' ? col.flex || 1 : 1,
          width: typeof col === 'object' ? col.width : undefined,
        });
      }
    }

    tableRows.push({
      type: 'row',
      align: 'center',
      gap: 12,
      padding: [10, 0],
      background: striped && r % 2 === 1 ? 'surface-alt' : undefined,
      borderBottom: true,
      children: rowCols,
    });
  }

  children.push({
    type: 'stack',
    gap: 0,
    border: true,
    borderRadius: 8,
    overflow: 'hidden',
    children: tableRows,
  });

  // Pagination
  if (pagination) {
    const pagChildren: any[] = [];

    if (totalRows !== undefined) {
      pagChildren.push({ type: 'text', content: `${totalRows} results`, variant: 'caption', color: 'muted', flex: 1 });
    } else {
      pagChildren.push({ type: 'spacer', flex: 1 });
    }

    const pageCount = typeof pagination === 'number' ? pagination : pagination.pages || 5;
    pagChildren.push({
      type: 'row',
      gap: 4,
      align: 'center',
      children: [
        { type: 'button', label: 'Previous', variant: 'ghost', size: 'sm', disabled: true },
        ...Array.from({ length: Math.min(pageCount, 5) }, (_, i) => ({
          type: 'button',
          label: String(i + 1),
          variant: i === 0 ? 'primary' : 'ghost',
          size: 'sm',
        })),
        { type: 'button', label: 'Next', variant: 'ghost', size: 'sm' },
      ],
    });

    children.push({ type: 'spacer', height: 12 });
    children.push({ type: 'row', align: 'center', children: pagChildren });
  }

  return [{
    type: 'stack',
    padding: [16, 24],
    gap: 0,
    children,
  }];
}
