import { RissCanvas } from '../canvas';
import { RoleEntry } from '../../types/render';

export function drawRoleLegend(
  canvas: RissCanvas,
  x: number,
  y: number,
  roles: RoleEntry[]
): number {
  if (roles.length === 0) return 0;
  let offsetX = x;
  canvas.drawText('Roles:', offsetX, y + 2, {
    font: '600 11px -apple-system, sans-serif',
    color: '#6B7280',
    align: 'left',
  });
  offsetX += 45;
  for (const role of roles) {
    canvas.drawCircle(offsetX + 5, y + 7, 5, { fill: role.color });
    canvas.drawText(role.label, offsetX + 14, y + 2, {
      font: '400 11px -apple-system, sans-serif',
      color: '#374151',
      align: 'left',
    });
    offsetX += 14 + role.label.length * 7 + 12;
  }
  return 24;
}
