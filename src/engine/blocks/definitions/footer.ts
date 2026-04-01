// Block: footer

export function expand(params: any): any[] {
  const variant = params.variant || 'columns';
  const logo = params.logo;
  const tagline = params.tagline;
  const columns = params.columns || [];
  const links = params.links || [];
  const social = params.social || [];
  const copyright = params.copyright;
  const newsletter = params.newsletter;

  const children: any[] = [];

  if (variant === 'simple') {
    // Simple single-row footer
    const rowChildren: any[] = [];
    if (logo) {
      rowChildren.push({ type: 'text', content: logo, variant: 'subtitle', weight: 'bold' });
    }
    rowChildren.push({ type: 'spacer', flex: 1 });
    for (const link of links) {
      rowChildren.push({
        type: 'text',
        content: typeof link === 'string' ? link : link.label,
        variant: 'caption',
        color: 'muted',
      });
    }
    children.push({ type: 'row', align: 'center', gap: 24, children: rowChildren });

    if (copyright) {
      children.push({ type: 'spacer', height: 12 });
      children.push({ type: 'text', content: copyright, variant: 'caption', color: 'muted', align: 'center' });
    }

    return [{
      type: 'stack',
      padding: [24, 48],
      borderTop: true,
      background: 'surface',
      children,
    }];
  }

  // Columns variant (default)
  const topRow: any[] = [];

  // Logo + tagline + newsletter column
  const brandCol: any[] = [];
  if (logo) {
    brandCol.push({ type: 'text', content: logo, variant: 'subtitle', weight: 'bold' });
  }
  if (tagline) {
    brandCol.push({ type: 'text', content: tagline, variant: 'caption', color: 'muted' });
  }

  if (newsletter) {
    brandCol.push({ type: 'spacer', height: 12 });
    brandCol.push({ type: 'text', content: typeof newsletter === 'object' ? newsletter.title || 'Subscribe' : 'Subscribe to our newsletter', variant: 'caption', weight: 'bold' });
    brandCol.push({ type: 'spacer', height: 8 });
    brandCol.push({
      type: 'row',
      gap: 8,
      children: [
        { type: 'input', placeholder: 'Enter your email', size: 'sm', width: 200 },
        { type: 'button', label: typeof newsletter === 'object' ? newsletter['cta-label'] || 'Subscribe' : 'Subscribe', variant: 'primary', size: 'sm' },
      ],
    });
  }

  if (social.length > 0) {
    brandCol.push({ type: 'spacer', height: 12 });
    brandCol.push({
      type: 'row',
      gap: 16,
      children: social.map((s: any) => ({
        type: 'icon',
        name: typeof s === 'string' ? s : s.platform || s.icon,
        size: 20,
        color: 'muted',
      })),
    });
  }

  topRow.push({ type: 'stack', gap: 6, flex: 2, children: brandCol });

  // Link columns
  for (const col of columns) {
    const colDef = typeof col === 'string' ? { title: col, links: [] } : col;
    topRow.push({
      type: 'stack',
      flex: 1,
      gap: 8,
      children: [
        { type: 'text', content: colDef.title || colDef.label || '', variant: 'caption', weight: 'bold' },
        ...(colDef.links || colDef.items || []).map((link: any) => ({
          type: 'text',
          content: typeof link === 'string' ? link : link.label,
          variant: 'caption',
          color: 'muted',
          cursor: 'pointer',
        })),
      ],
    });
  }

  children.push({ type: 'row', gap: 48, align: 'start', children: topRow });

  // Bottom bar with copyright
  if (copyright) {
    children.push({ type: 'spacer', height: 24 });
    children.push({ type: 'divider' });
    children.push({ type: 'spacer', height: 16 });
    children.push({
      type: 'row',
      align: 'center',
      children: [
        { type: 'text', content: copyright, variant: 'caption', color: 'muted', flex: 1 },
        ...(links.length > 0 ? [{
          type: 'row',
          gap: 16,
          children: links.map((link: any) => ({
            type: 'text',
            content: typeof link === 'string' ? link : link.label,
            variant: 'caption',
            color: 'muted',
          })),
        }] : []),
      ],
    });
  }

  return [{
    type: 'stack',
    padding: [48, 48, 24, 48],
    borderTop: true,
    background: 'surface',
    children,
  }];
}
