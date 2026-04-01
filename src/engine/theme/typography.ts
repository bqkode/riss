export interface TypographyStyle {
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  fontFamily: string;
}

const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const MONO = '"SF Mono", "Fira Code", "Fira Mono", "Roboto Mono", Consolas, monospace';

export const TYPOGRAPHY_SCALE: Record<string, TypographyStyle> = {
  'h1': { fontSize: 32, fontWeight: '700', lineHeight: 1.2, fontFamily: SANS },
  'h2': { fontSize: 24, fontWeight: '700', lineHeight: 1.25, fontFamily: SANS },
  'h3': { fontSize: 20, fontWeight: '600', lineHeight: 1.3, fontFamily: SANS },
  'h4': { fontSize: 18, fontWeight: '600', lineHeight: 1.35, fontFamily: SANS },
  'h5': { fontSize: 16, fontWeight: '600', lineHeight: 1.4, fontFamily: SANS },
  'h6': { fontSize: 14, fontWeight: '600', lineHeight: 1.4, fontFamily: SANS },
  'body': { fontSize: 16, fontWeight: '400', lineHeight: 1.5, fontFamily: SANS },
  'body-sm': { fontSize: 14, fontWeight: '400', lineHeight: 1.5, fontFamily: SANS },
  'caption': { fontSize: 12, fontWeight: '400', lineHeight: 1.4, fontFamily: SANS },
  'label': { fontSize: 12, fontWeight: '500', lineHeight: 1.3, fontFamily: SANS },
  'overline': { fontSize: 10, fontWeight: '600', lineHeight: 1.5, fontFamily: SANS },
  'code': { fontSize: 14, fontWeight: '400', lineHeight: 1.5, fontFamily: MONO },
};

export function getFontString(variant: string): string {
  const style = TYPOGRAPHY_SCALE[variant] || TYPOGRAPHY_SCALE['body'];
  return `${style.fontWeight} ${style.fontSize}px ${style.fontFamily}`;
}

export function getLineHeight(variant: string): number {
  const style = TYPOGRAPHY_SCALE[variant] || TYPOGRAPHY_SCALE['body'];
  return style.fontSize * style.lineHeight;
}

export function resolveWeight(weight: string | undefined, variant: string): string {
  if (weight) {
    switch (weight) {
      case 'normal': return '400';
      case 'medium': return '500';
      case 'semibold': return '600';
      case 'bold': return '700';
      default: return weight;
    }
  }
  return TYPOGRAPHY_SCALE[variant]?.fontWeight || '400';
}
