import { RissCanvas } from '../canvas';
import { LayoutBox } from '../../types/layout';
import { RenderContext } from '../../types/render';
import { getFontString } from '../theme/typography';

export function draw(canvas: RissCanvas, box: LayoutBox, ctx: RenderContext): void {
  const el = box.element;
  const colors = ctx.theme.colors;

  const columns: Array<{ label: string; width?: number; key?: string }> = el.columns || [];
  const rows: Array<Record<string, string>> = el.rows || el.data || [];
  const striped = el.striped === true;
  const bordered = el.bordered === true || el.border === true;
  const rowHeight = 40;
  const headerHeight = 40;
  const padding = 12;

  if (columns.length === 0) return;

  // Calculate column widths
  const totalSpecified = columns.reduce((sum, c) => sum + (c.width || 0), 0);
  const unspecifiedCount = columns.filter((c) => !c.width).length;
  const remainingWidth = box.width - totalSpecified;
  const defaultColWidth = unspecifiedCount > 0 ? remainingWidth / unspecifiedCount : 0;

  const colWidths = columns.map((c) => c.width || defaultColWidth);

  // Header row
  canvas.drawRect(box.x, box.y, box.width, headerHeight, {
    fill: colors['surface'],
  });

  let colX = box.x;
  for (let c = 0; c < columns.length; c++) {
    canvas.drawText(columns[c].label, colX + padding, box.y + (headerHeight - 12) / 2, {
      font: getFontString('label'),
      color: colors['text'],
      maxWidth: colWidths[c] - padding * 2,
    });
    colX += colWidths[c];
  }

  // Header bottom border
  canvas.drawLine(box.x, box.y + headerHeight, box.x + box.width, box.y + headerHeight, {
    color: colors['border'],
    width: 1,
  });

  // Data rows
  for (let r = 0; r < rows.length; r++) {
    const rowY = box.y + headerHeight + r * rowHeight;
    const row = rows[r];

    // Striped background
    if (striped && r % 2 === 1) {
      canvas.drawRect(box.x, rowY, box.width, rowHeight, {
        fill: colors['surface'],
      });
    }

    // Cell content
    colX = box.x;
    for (let c = 0; c < columns.length; c++) {
      const key = columns[c].key || columns[c].label;
      const cellValue = row[key] || '';
      canvas.drawText(String(cellValue), colX + padding, rowY + (rowHeight - 14) / 2, {
        font: getFontString('body-sm'),
        color: colors['text'],
        maxWidth: colWidths[c] - padding * 2,
      });

      // Cell right border
      if (bordered && c < columns.length - 1) {
        canvas.drawLine(colX + colWidths[c], rowY, colX + colWidths[c], rowY + rowHeight, {
          color: colors['border'],
          width: 1,
        });
      }

      colX += colWidths[c];
    }

    // Row bottom border
    canvas.drawLine(box.x, rowY + rowHeight, box.x + box.width, rowY + rowHeight, {
      color: colors['border'],
      width: 1,
    });
  }

  // Outer border if bordered
  if (bordered) {
    const totalHeight = headerHeight + rows.length * rowHeight;
    canvas.drawRect(box.x, box.y, box.width, totalHeight, {
      stroke: colors['border'],
      strokeWidth: 1,
    });
  }
}
