import { RissCanvas } from '../canvas';

export function drawRoleOverlay(
  canvas: RissCanvas,
  x: number,
  y: number,
  w: number,
  h: number,
  roleIds: string[],
  roleDefs: { id: string; label: string; color: string }[]
): void {
  const matchedRoles = roleIds.map(id => roleDefs.find(r => r.id === id)).filter(Boolean);
  if (matchedRoles.length === 0) return;
  // Draw 2px dashed outline using first role's color
  const primaryColor = matchedRoles[0]!.color;
  canvas.drawDashedRect(x - 1, y - 1, w + 2, h + 2, primaryColor, [4, 3]);
  // Draw badges at top-right
  let badgeX = x + w;
  for (const role of matchedRoles) {
    const label = role!.label;
    badgeX -= label.length * 7 + 12;
    canvas.drawBadge(label, badgeX, y - 10, role!.color);
  }
}
