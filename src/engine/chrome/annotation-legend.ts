import { RissCanvas } from '../canvas';
import { AnnotationEntry } from '../../types/render';

export function drawAnnotationLegend(
  canvas: RissCanvas,
  x: number,
  y: number,
  width: number,
  annotations: AnnotationEntry[]
): number {
  if (annotations.length === 0) return 0;
  let offsetY = 0;
  for (const ann of annotations) {
    // Draw circled number
    canvas.drawCircle(x + 8, y + offsetY + 8, 8, { fill: '#2563EB' });
    canvas.drawText(String(ann.number), x + 8, y + offsetY + 3, {
      font: '600 10px -apple-system, sans-serif',
      color: '#FFFFFF',
      align: 'center',
    });
    // Draw annotation text
    canvas.drawText(ann.text, x + 22, y + offsetY + 2, {
      font: '400 11px -apple-system, sans-serif',
      color: '#374151',
      align: 'left',
      maxWidth: width - 30,
    });
    offsetY += 20;
  }
  return offsetY + 8;
}
