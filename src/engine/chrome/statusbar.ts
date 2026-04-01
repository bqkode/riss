import { RissCanvas } from '../canvas';

export function drawStatusBar(
  canvas: RissCanvas,
  x: number,
  y: number,
  width: number,
  textColor: string
): number {
  const height = 44;
  // Draw time "9:41"
  canvas.drawText('9:41', x + 20, y + 16, {
    font: '600 14px -apple-system, sans-serif',
    color: textColor,
    align: 'left',
  });
  // Draw signal, wifi, battery icons (simplified rectangles/shapes)
  const rightX = x + width - 20;
  // Battery
  canvas.drawRect(rightX - 24, y + 14, 22, 10, { stroke: textColor, strokeWidth: 1, radius: 2 });
  canvas.drawRect(rightX - 22, y + 16, 14, 6, { fill: textColor, radius: 1 });
  canvas.drawRect(rightX, y + 17, 2, 4, { fill: textColor, radius: 1 });
  // WiFi (simplified arc/triangle)
  // Signal (simplified bars)
  return height;
}
