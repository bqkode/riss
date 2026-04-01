// Top-level document
export interface RissDocument {
  riss: string;
  meta: Meta;
  blocks?: CustomBlockDef[];
  screens: Screen[];
}

export interface Meta {
  name: string;
  description?: string;
  viewport?: Viewport;
  theme?: Theme;
  roles?: Role[];
}

export interface Viewport {
  width?: number;
  height?: number;
}

export interface Theme {
  mode?: 'light' | 'dark';
  accent?: string;
}

export interface Role {
  id: string;
  label: string;
  color: string;
}

export interface Screen {
  id: string;
  title: string;
  path?: string;
  viewport?: Viewport;
  background?: string;
  statusbar?: boolean;
  role?: string | string[];
  children: (RissElement | BlockUsage)[];
}

// Custom block definition
export interface CustomBlockDef {
  id: string;
  description?: string;
  params: { name: string; required?: boolean; default?: any }[];
  template: RissElement[];
}

// Block usage (has 'block' field instead of 'type')
export interface BlockUsage {
  block: string;
  id?: string;
  role?: string | string[];
  annotation?: string;
  next?: string | string[];
  [key: string]: any; // block-specific params
}

// Element is a generic record since we have 36+ types
// The 'type' field discriminates
export interface RissElement {
  type: string;
  // Common layout properties
  width?: number | string;
  height?: number | string;
  'min-width'?: number;
  'min-height'?: number;
  'max-width'?: number;
  'max-height'?: number;
  grow?: number;
  shrink?: number;
  padding?: string | number;
  'padding-x'?: string | number;
  'padding-y'?: string | number;
  margin?: string | number;
  'margin-x'?: string | number;
  'margin-y'?: string | number;
  gap?: string | number;
  align?: string;
  justify?: string;
  'align-self'?: string;
  // Styling
  background?: string;
  border?: boolean | { color?: string; width?: number; style?: string; sides?: string | string[] };
  rounded?: string;
  elevation?: string;
  overflow?: string;
  // Role & annotation
  role?: string | string[];
  annotation?: string;
  // Navigation
  next?: string | string[];
  // Children (for containers)
  children?: (RissElement | BlockUsage)[];
  // All other element-specific properties
  [key: string]: any;
}

export function isBlockUsage(node: RissElement | BlockUsage): node is BlockUsage {
  return 'block' in node && !('type' in node);
}
