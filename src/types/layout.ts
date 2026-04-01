import type { RissElement, BlockUsage } from './riss';

export interface LayoutBox {
  x: number;
  y: number;
  width: number;
  height: number;
  element: RissElement | BlockUsage;
  children: LayoutBox[];
  // Computed properties
  clipContent: boolean;
  scrollDirection?: 'vertical' | 'horizontal';
}

export interface LayoutConstraints {
  availableWidth: number;
  availableHeight: number;
  parentDirection: 'stack' | 'row' | 'grid';
}
