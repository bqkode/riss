export const SPACING_SCALE: Record<string, number> = {
  'none': 0,
  'xs': 4,
  'sm': 8,
  'md': 16,
  'lg': 24,
  'xl': 32,
  '2xl': 48,
  '3xl': 64,
};

export const RADIUS_SCALE: Record<string, number> = {
  'none': 0,
  'sm': 4,
  'md': 8,
  'lg': 12,
  'xl': 16,
  'full': 9999,
};

export const ELEVATION_SHADOWS: Record<string, string> = {
  'none': 'none',
  'sm': '0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)',
  'md': '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
  'lg': '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
};

export function resolveSpacing(value: string | number | number[] | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return value;
  if (Array.isArray(value)) {
    // CSS shorthand: [vertical, horizontal] or [top, right, bottom, left]
    // Return the first value as uniform spacing
    return typeof value[0] === 'number' ? value[0] : 0;
  }
  return SPACING_SCALE[value] ?? 0;
}

/**
 * Resolve padding from a CSS-shorthand array or scalar.
 * Returns { x, y } where x = horizontal padding and y = vertical padding.
 * Supports: number, string token, [vertical, horizontal], [top, right, bottom, left]
 */
export function resolvePaddingXY(
  padding: string | number | number[] | undefined,
  paddingX?: string | number | undefined,
  paddingY?: string | number | undefined,
): { x: number; y: number } {
  if (paddingX !== undefined || paddingY !== undefined) {
    return {
      x: resolveSpacing(paddingX ?? padding),
      y: resolveSpacing(paddingY ?? padding),
    };
  }
  if (Array.isArray(padding)) {
    if (padding.length === 4) {
      // [top, right, bottom, left]
      return { y: (padding[0] + padding[2]) / 2, x: (padding[1] + padding[3]) / 2 };
    }
    if (padding.length >= 2) {
      // [vertical, horizontal]
      return { y: padding[0], x: padding[1] };
    }
    if (padding.length === 1) {
      return { y: padding[0], x: padding[0] };
    }
    return { x: 0, y: 0 };
  }
  const uniform = resolveSpacing(padding);
  return { x: uniform, y: uniform };
}

export function resolveRadius(value: string | undefined): number {
  if (!value) return 0;
  return RADIUS_SCALE[value] ?? 0;
}

export function resolveSize(value: string | number | undefined, parentSize: number): number {
  if (value === undefined || value === null || value === 'auto') return -1; // -1 = auto
  if (typeof value === 'number') return value;
  switch (value) {
    case 'full': return parentSize;
    case 'half': return parentSize / 2;
    case '1/3': return parentSize / 3;
    case '2/3': return (parentSize * 2) / 3;
    case '1/4': return parentSize / 4;
    case '3/4': return (parentSize * 3) / 4;
    default: return -1;
  }
}
