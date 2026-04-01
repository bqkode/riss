import { RissCanvas } from '../canvas';
import { RenderContext } from '../../types/render';

export function drawScreenHeader(
  canvas: RissCanvas,
  x: number,
  y: number,
  width: number,
  title: string,
  path?: string,
  role?: string | string[],
  ctx?: RenderContext
): number {
  // Returns height consumed
  let offsetY = 0;
  // Draw title
  canvas.drawText(title, x, y + offsetY, {
    font: '600 16px -apple-system, sans-serif',
    color: '#1A1A1A',
    align: 'left',
  });
  offsetY += 22;
  // Draw path if present
  if (path) {
    canvas.drawText(path, x, y + offsetY, {
      font: '400 12px "SF Mono", monospace',
      color: '#6B7280',
      align: 'left',
    });
    offsetY += 18;
  }
  // Draw role badges if present
  if (role && ctx) {
    const roles = Array.isArray(role) ? role : [role];
    let badgeX = x + width;
    for (const r of roles) {
      const roleDef = ctx.roles.find(rd => rd.id === r);
      if (roleDef) {
        badgeX -= 60; // approximate badge width
        canvas.drawBadge(roleDef.label, badgeX, y, roleDef.color);
      }
    }
  }
  return offsetY + 8; // 8px gap before screen frame
}
