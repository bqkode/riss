const LIGHT_COLORS: Record<string, string> = {
  'background': '#FFFFFF',
  'surface': '#F5F5F5',
  'surface-raised': '#FFFFFF',
  'text': '#1A1A1A',
  'text-secondary': '#6B7280',
  'text-disabled': '#D1D5DB',
  'border': '#E5E7EB',
  'border-strong': '#9CA3AF',
  'accent': '#2563EB',
  'accent-soft': '#2563EB26',
  'success': '#16A34A',
  'warning': '#D97706',
  'error': '#DC2626',
  'placeholder': '#E5E7EB',
};

const DARK_COLORS: Record<string, string> = {
  'background': '#1A1A1A',
  'surface': '#2A2A2A',
  'surface-raised': '#333333',
  'text': '#F5F5F5',
  'text-secondary': '#9CA3AF',
  'text-disabled': '#4B5563',
  'border': '#374151',
  'border-strong': '#6B7280',
  'accent': '#2563EB',
  'accent-soft': '#2563EB26',
  'success': '#22C55E',
  'warning': '#F59E0B',
  'error': '#EF4444',
  'placeholder': '#374151',
};

// Known color token names
const COLOR_TOKENS = new Set(Object.keys(LIGHT_COLORS));

export function resolveColor(token: string, mode: 'light' | 'dark', accent: string): string {
  // If it's a hex value, return as-is
  if (token.startsWith('#')) return token;

  const colors = mode === 'dark' ? { ...DARK_COLORS } : { ...LIGHT_COLORS };

  // Override accent colors
  colors['accent'] = accent;
  colors['accent-soft'] = accent + '26'; // 15% opacity

  return colors[token] || token;
}

export function isColorToken(value: string): boolean {
  return COLOR_TOKENS.has(value) || /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value);
}

export { LIGHT_COLORS, DARK_COLORS, COLOR_TOKENS };
