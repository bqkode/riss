export interface RenderContext {
  theme: ResolvedTheme;
  annotations: AnnotationEntry[];
  roles: RoleEntry[];
  screenViewport: { width: number; height: number };
}

export interface ResolvedTheme {
  mode: 'light' | 'dark';
  accent: string;
  colors: Record<string, string>;
}

export interface AnnotationEntry {
  number: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface RoleEntry {
  id: string;
  label: string;
  color: string;
}
