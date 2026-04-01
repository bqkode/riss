import { RissCanvas } from './canvas';
import { RissDocument, Screen, isBlockUsage } from '../types/riss';
import { LayoutBox } from '../types/layout';
import { RenderContext, ResolvedTheme, AnnotationEntry, RoleEntry } from '../types/render';
import { resolveColor } from './theme/colors';
import { computeLayout } from './layout';
import { expandAllBlocks } from './blocks/expand';
import { ELEMENT_RENDERERS } from './elements/index';
import { drawScreenHeader } from './chrome/screen-header';
import { drawStatusBar } from './chrome/statusbar';
import { drawRoleLegend } from './chrome/role-legend';
import { drawAnnotationLegend } from './chrome/annotation-legend';
import { drawRoleOverlay } from './chrome/role-badge';

export class RissRenderer {
  private canvas: RissCanvas;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = new RissCanvas(canvasElement);
  }

  render(doc: RissDocument, screenIndex: number): void {
    const screen = doc.screens[screenIndex];
    if (!screen) return;

    // Resolve theme
    const mode = doc.meta.theme?.mode || 'light';
    const rawAccent = doc.meta.theme?.accent || '#2563EB';
    const accent = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(rawAccent) ? rawAccent : '#2563EB';
    const theme = this.resolveTheme(mode as 'light' | 'dark', accent);

    // Resolve viewport
    const viewport = screen.viewport || doc.meta.viewport || { width: 390, height: 844 };
    const MAX_VP = 8000;
    const vw = Math.min(Math.max(viewport.width || 390, 1), MAX_VP);
    const vh = Math.min(Math.max(viewport.height || 844, 1), MAX_VP);

    // Calculate total canvas size (header + screen + legends)
    const headerHeight = 50; // approximate
    const legendHeight = 80; // approximate
    const totalWidth = vw + 80; // 40px padding each side
    const totalHeight = headerHeight + vh + legendHeight;

    // Setup canvas
    this.canvas.setupSize(totalWidth, totalHeight);

    // Clear with page background
    this.canvas.clear(0, 0, totalWidth, totalHeight, '#F0F0F0');

    // Screen position (centered with padding)
    const sx = 40;
    let sy = 0;

    // Draw screen header
    const roles: RoleEntry[] = doc.meta.roles || [];
    const renderCtx: RenderContext = {
      theme,
      annotations: [],
      roles,
      screenViewport: { width: vw, height: vh },
    };
    sy += drawScreenHeader(this.canvas, sx, sy + 8, vw, screen.title, screen.path, screen.role, renderCtx);

    // Draw screen background
    this.canvas.drawRect(sx, sy, vw, vh, {
      fill: theme.colors['background'],
    });

    // Draw status bar if mobile
    let contentY = sy;
    const isMobile = vw <= 500;
    if (isMobile && screen.statusbar !== false) {
      contentY += drawStatusBar(this.canvas, sx, sy, vw, theme.colors['text']);
    }

    // Expand blocks
    const expandedChildren = expandAllBlocks(screen.children, doc.blocks);

    // Compute layout
    const contentHeight = vh - (contentY - sy);
    const layoutBoxes = computeLayout(expandedChildren, vw, contentHeight);

    // Draw elements recursively
    this.canvas.clip(sx, contentY, vw, contentHeight, () => {
      this.drawElements(layoutBoxes, sx, contentY, renderCtx);
    });

    // Draw legends below screen
    let legendY = sy + vh + 12;
    legendY += drawRoleLegend(this.canvas, sx, legendY, roles);
    drawAnnotationLegend(this.canvas, sx, legendY, vw, renderCtx.annotations);
  }

  /** Render a single screen for prototype mode. Returns hit regions for elements with `next`. */
  renderPrototype(doc: RissDocument, screenIndex: number): { x: number; y: number; w: number; h: number; next: string }[] {
    const screen = doc.screens[screenIndex];
    if (!screen) return [];

    const mode = doc.meta.theme?.mode || 'light';
    const rawAccent = doc.meta.theme?.accent || '#2563EB';
    const accent = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(rawAccent) ? rawAccent : '#2563EB';
    const theme = this.resolveTheme(mode as 'light' | 'dark', accent);

    const viewport = screen.viewport || doc.meta.viewport || { width: 390, height: 844 };
    const MAX_VP = 8000;
    const vw = Math.min(Math.max(viewport.width || 390, 1), MAX_VP);
    const vh = Math.min(Math.max(viewport.height || 844, 1), MAX_VP);

    // Margins for navigation labels outside the screen
    const MARGIN = 160;
    const totalW = vw + MARGIN * 2;
    const screenX = MARGIN; // screen is offset by the left margin

    this.canvas.setupSize(totalW, vh);
    this.canvas.clear(0, 0, totalW, vh, '#F0F0F0');

    // Draw screen background
    this.canvas.drawRect(screenX, 0, vw, vh, {
      fill: theme.colors['background'],
    });

    const roles: RoleEntry[] = doc.meta.roles || [];
    const renderCtx: RenderContext = { theme, annotations: [], roles, screenViewport: { width: vw, height: vh } };

    // Status bar
    let contentY = 0;
    if (vw <= 500 && screen.statusbar !== false) {
      contentY += drawStatusBar(this.canvas, screenX, 0, vw, theme.colors['text']);
    }

    const expandedChildren = expandAllBlocks(screen.children, doc.blocks);
    const contentHeight = vh - contentY;
    const layoutBoxes = computeLayout(expandedChildren, vw, contentHeight);

    this.canvas.clip(screenX, contentY, vw, contentHeight, () => {
      this.drawElements(layoutBoxes, screenX, contentY, renderCtx);
    });

    // Collect hit regions and draw navigation labels
    const hitRegions: { x: number; y: number; w: number; h: number; next: string }[] = [];
    const screenIdToTitle: Record<string, string> = {};
    for (const s of doc.screens) screenIdToTitle[s.id] = s.title;

    const LINE_W = 80;
    const LABEL_GAP = 8;
    const collectHits = (boxes: LayoutBox[], offX: number, offY: number) => {
      for (const box of boxes) {
        const ax = offX + box.x;
        const ay = offY + box.y;
        const el = box.element as any;
        if (el && el.next) {
          const targets = Array.isArray(el.next) ? el.next : [el.next];
          for (const t of targets) {
            hitRegions.push({ x: ax, y: ay, w: box.width, h: box.height, next: t });

            // Draw label outside screen
            const elCenterX = ax + box.width / 2 - screenX; // relative to screen
            const onRight = elCenterX >= vw / 2;
            const labelY = ay + box.height / 2;
            const title = screenIdToTitle[t] || t;

            this.canvas.ctx.save();
            this.canvas.ctx.strokeStyle = accent;
            this.canvas.ctx.fillStyle = accent;
            this.canvas.ctx.lineWidth = 1.5;
            this.canvas.ctx.setLineDash([]);

            if (onRight) {
              // Line from right edge of screen to the right
              const lineStartX = screenX + vw + 1;
              const lineEndX = lineStartX + LINE_W;
              this.canvas.ctx.beginPath();
              this.canvas.ctx.moveTo(lineStartX, labelY);
              this.canvas.ctx.lineTo(lineEndX, labelY);
              this.canvas.ctx.stroke();
              // Label
              this.canvas.drawText(title, lineEndX + LABEL_GAP, labelY - 5, {
                font: '500 11px -apple-system, system-ui, sans-serif',
                color: accent,
                align: 'left',
              });
            } else {
              // Line from left edge of screen to the left
              const lineStartX = screenX - 1;
              const lineEndX = lineStartX - LINE_W;
              this.canvas.ctx.beginPath();
              this.canvas.ctx.moveTo(lineStartX, labelY);
              this.canvas.ctx.lineTo(lineEndX, labelY);
              this.canvas.ctx.stroke();
              // Label
              this.canvas.drawText(title, lineEndX - LABEL_GAP, labelY - 5, {
                font: '500 11px -apple-system, system-ui, sans-serif',
                color: accent,
                align: 'right',
              });
            }
            this.canvas.ctx.restore();
          }
        }
        if (box.children.length > 0) {
          collectHits(box.children, ax, ay);
        }
      }
    };
    collectHits(layoutBoxes, screenX, contentY);

    return hitRegions;
  }

  private drawElements(boxes: LayoutBox[], offsetX: number, offsetY: number, ctx: RenderContext): void {
    for (const box of boxes) {
      const absX = offsetX + box.x;
      const absY = offsetY + box.y;
      const el = box.element;

      // Draw element
      const drawFn = ELEMENT_RENDERERS[el.type];
      if (drawFn) {
        // Create a translated box for the renderer
        const absBox = { ...box, x: absX, y: absY };
        drawFn(this.canvas, absBox, ctx);
      }

      // Draw children recursively, applying clip if overflow is set
      if (box.children.length > 0) {
        if (box.clipContent) {
          this.canvas.clip(absX, absY, box.width, box.height, () => {
            this.drawElements(box.children, absX, absY, ctx);
          });
        } else {
          this.drawElements(box.children, absX, absY, ctx);
        }
      }

      // Draw role overlay if element has role
      if (el.role) {
        const roleIds = Array.isArray(el.role) ? el.role : [el.role];
        drawRoleOverlay(this.canvas, absX, absY, box.width, box.height, roleIds, ctx.roles);
      }

      // Collect annotations
      if (el.annotation) {
        ctx.annotations.push({
          number: ctx.annotations.length + 1,
          text: el.annotation,
          x: absX + box.width,
          y: absY,
          color: '#2563EB',
        });
        // Draw annotation marker on element
        const num = ctx.annotations.length;
        this.canvas.drawCircle(absX + box.width - 8, absY + 8, 8, { fill: '#2563EB' });
        this.canvas.drawText(String(num), absX + box.width - 8, absY + 3, {
          font: '600 9px -apple-system, sans-serif',
          color: '#FFFFFF',
          align: 'center',
        });
      }
    }
  }

  private resolveTheme(mode: 'light' | 'dark', accent: string): ResolvedTheme {
    const tokenNames = [
      'background', 'surface', 'surface-raised', 'text', 'text-secondary',
      'text-disabled', 'border', 'border-strong', 'accent', 'accent-soft',
      'success', 'warning', 'error', 'placeholder'
    ];
    const colors: Record<string, string> = {};
    for (const name of tokenNames) {
      colors[name] = resolveColor(name, mode, accent);
    }
    return { mode, accent, colors };
  }

  renderOverview(doc: RissDocument): void {
    if (!doc.screens.length) return;

    const mode = doc.meta.theme?.mode || 'light';
    const rawAccent = doc.meta.theme?.accent || '#2563EB';
    const accent = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(rawAccent) ? rawAccent : '#2563EB';
    const theme = this.resolveTheme(mode as 'light' | 'dark', accent);
    const roles: RoleEntry[] = doc.meta.roles || [];

    const H_GAP = 100; // horizontal gap between screens (room for arrows)
    const V_GAP = 80;  // vertical gap between rows
    const PAD = 40;     // padding inside each cell
    const HEADER_H = 50;
    const LEGEND_H = 40;
    const CANVAS_PAD = 60; // canvas edge padding

    // Flow edge: one per element/block with `next`, position resolved after layout
    interface FlowEdge {
      sourceScreenId: string;
      targetIds: string[];
      sourceLeftX?: number;  // absolute left edge of the element on canvas
      sourceRightX?: number; // absolute right edge of the element on canvas
      sourceY?: number;      // absolute Y center of the element on canvas
    }

    // Recursively collect all `next` declarations from a tree
    function collectNextDeclarations(node: any): { targetIds: string[] }[] {
      const result: { targetIds: string[] }[] = [];
      if (node.next) {
        const vals = Array.isArray(node.next) ? node.next : [node.next];
        result.push({ targetIds: vals });
      }
      if (node.children) {
        for (const child of node.children) {
          result.push(...collectNextDeclarations(child));
        }
      }
      return result;
    }

    // Walk the layout box tree, find all boxes whose element has `next`,
    // return their position (left/right edge X, Y center) and target ids
    function findAllNextBoxes(box: LayoutBox, offsetX: number, offsetY: number): { leftX: number; rightX: number; y: number; targetIds: string[] }[] {
      const results: { leftX: number; rightX: number; y: number; targetIds: string[] }[] = [];
      const el = box.element as any;
      if (el && el.next) {
        const vals = Array.isArray(el.next) ? el.next : [el.next];
        results.push({
          leftX: offsetX + box.x,
          rightX: offsetX + box.x + box.width,
          y: offsetY + box.y + box.height / 2,
          targetIds: vals,
        });
      }
      for (const child of box.children) {
        results.push(...findAllNextBoxes(child, offsetX + box.x, offsetY + box.y));
      }
      return results;
    }

    // Build screen info with dimensions
    interface ScreenNode {
      screen: Screen;
      vw: number;
      vh: number;
      cellW: number; // total cell width including internal padding
      cellH: number; // total cell height including header + legend
      nextIds: string[];
      col: number;
      row: number;
      // Computed absolute positions (of the screen frame, not the cell)
      frameX: number;
      frameY: number;
      headerY: number;
    }

    const nodes: Map<string, ScreenNode> = new Map();
    const screenList: ScreenNode[] = [];
    const flowEdges: FlowEdge[] = [];

    for (const screen of doc.screens) {
      const vp = screen.viewport || doc.meta.viewport || { width: 390, height: 844 };
      const vw = vp.width || 390;
      const vh = vp.height || 844;
      // Collect next targets from any child (deep scan)
      const nextIds: string[] = [];
      for (const child of screen.children) {
        const decls = collectNextDeclarations(child);
        for (const decl of decls) {
          flowEdges.push({ sourceScreenId: screen.id, targetIds: decl.targetIds });
          for (const t of decl.targetIds) {
            if (!nextIds.includes(t)) nextIds.push(t);
          }
        }
      }
      const node: ScreenNode = {
        screen, vw, vh,
        cellW: vw + PAD * 2,
        cellH: HEADER_H + vh + LEGEND_H,
        nextIds,
        col: -1, row: -1,
        frameX: 0, frameY: 0, headerY: 0,
      };
      nodes.set(screen.id, node);
      screenList.push(node);
    }

    // Determine if there are any flow edges
    const hasFlow = screenList.some(n => n.nextIds.length > 0);

    // --- Graph layout ---
    // Assign columns via BFS from root screens (those with no incoming edges)
    // Screens with the same column go in the same vertical column, branching goes to next column
    if (hasFlow) {
      const incoming = new Set<string>();
      for (const node of screenList) {
        for (const nid of node.nextIds) {
          incoming.add(nid);
        }
      }

      // Root screens: no incoming edges
      const roots = screenList.filter(n => !incoming.has(n.screen.id));
      if (roots.length === 0) roots.push(screenList[0]); // fallback: cycle, pick first

      const placed = new Set<string>();
      const columns: ScreenNode[][] = [];

      // BFS assigns columns
      let frontier = roots.map(r => r.screen.id);
      let col = 0;
      while (frontier.length > 0) {
        const colNodes: ScreenNode[] = [];
        const nextFrontier: string[] = [];
        for (const id of frontier) {
          if (placed.has(id)) continue;
          const node = nodes.get(id);
          if (!node) continue;
          placed.add(id);
          node.col = col;
          node.row = colNodes.length;
          colNodes.push(node);
          for (const nid of node.nextIds) {
            if (!placed.has(nid)) {
              nextFrontier.push(nid);
            }
          }
        }
        if (colNodes.length > 0) columns.push(colNodes);
        frontier = nextFrontier;
        col++;
      }

      // Place any unconnected screens in the last column
      for (const node of screenList) {
        if (!placed.has(node.screen.id)) {
          node.col = columns.length;
          node.row = 0;
          if (!columns[node.col]) columns[node.col] = [];
          columns[node.col].push(node);
          placed.add(node.screen.id);
        }
      }

      // Compute positions: columns go left-to-right, rows top-to-bottom within each column
      let cursorX = CANVAS_PAD;
      for (const colNodes of columns) {
        let cursorY = CANVAS_PAD;
        let maxCellW = 0;
        for (const node of colNodes) {
          node.headerY = cursorY;
          node.frameX = cursorX + PAD;
          node.frameY = cursorY + HEADER_H;
          cursorY += node.cellH + V_GAP;
          maxCellW = Math.max(maxCellW, node.cellW);
        }
        cursorX += maxCellW + H_GAP;
      }
    } else {
      // No flow edges: simple row layout with wrapping
      const MAX_ROW_W = 3000;
      let cursorX = CANVAS_PAD;
      let cursorY = CANVAS_PAD;
      let rowMaxH = 0;

      for (const node of screenList) {
        if (cursorX > CANVAS_PAD && cursorX + node.cellW > MAX_ROW_W) {
          cursorX = CANVAS_PAD;
          cursorY += rowMaxH + V_GAP;
          rowMaxH = 0;
        }
        node.headerY = cursorY;
        node.frameX = cursorX + PAD;
        node.frameY = cursorY + HEADER_H;
        cursorX += node.cellW + H_GAP;
        rowMaxH = Math.max(rowMaxH, node.cellH);
      }
    }

    // Compute total canvas size
    let maxX = 0, maxY = 0;
    for (const node of screenList) {
      maxX = Math.max(maxX, node.frameX + node.vw + PAD);
      maxY = Math.max(maxY, node.frameY + node.vh + LEGEND_H);
    }
    const totalWidth = maxX + CANVAS_PAD;
    const totalHeight = maxY + CANVAS_PAD;

    this.canvas.setupSize(totalWidth, totalHeight);
    this.canvas.clear(0, 0, totalWidth, totalHeight, '#F0F0F0');

    // --- Draw each screen and collect layout info for arrows ---

    for (const node of screenList) {
      const { screen, vw, vh, frameX, frameY, headerY } = node;
      const renderCtx: RenderContext = {
        theme,
        annotations: [],
        roles,
        screenViewport: { width: vw, height: vh },
      };

      // Header
      drawScreenHeader(this.canvas, frameX, headerY + 8, vw, screen.title, screen.path, screen.role, renderCtx);

      // Screen background
      this.canvas.drawRect(frameX, frameY, vw, vh, {
        fill: theme.colors['background'],
      });

      // Status bar
      let contentY = frameY;
      if (vw <= 500 && screen.statusbar !== false) {
        contentY += drawStatusBar(this.canvas, frameX, frameY, vw, theme.colors['text']);
      }

      // Expand & layout
      const expandedChildren = expandAllBlocks(screen.children, doc.blocks);
      const contentHeight = vh - (contentY - frameY);
      const layoutBoxes = computeLayout(expandedChildren, vw, contentHeight);

      // Resolve source position for flow edges by finding `next` elements in layout
      const nextBoxes: { leftX: number; rightX: number; y: number; targetIds: string[] }[] = [];
      for (const box of layoutBoxes) {
        nextBoxes.push(...findAllNextBoxes(box, 0, 0));
      }
      // Match flow edges to layout boxes by comparing target IDs
      for (const edge of flowEdges) {
        if (edge.sourceScreenId !== screen.id || edge.sourceY !== undefined) continue;
        const edgeKey = edge.targetIds.slice().sort().join(',');
        for (const nb of nextBoxes) {
          if (nb.targetIds.slice().sort().join(',') === edgeKey) {
            edge.sourceLeftX = frameX + nb.leftX;
            edge.sourceRightX = frameX + nb.rightX;
            edge.sourceY = contentY + nb.y;
            break;
          }
        }
      }

      // Draw elements
      this.canvas.clip(frameX, contentY, vw, contentHeight, () => {
        this.drawElements(layoutBoxes, frameX, contentY, renderCtx);
      });

      // Legends
      let legendY = frameY + vh + 12;
      legendY += drawRoleLegend(this.canvas, frameX, legendY, roles);
      drawAnnotationLegend(this.canvas, frameX, legendY, vw, renderCtx.annotations);
    }

    // --- Draw flow arrows (after all screens, so all positions are known) ---
    if (hasFlow) {
      for (const edge of flowEdges) {
        const sourceNode = nodes.get(edge.sourceScreenId);
        if (!sourceNode) continue;
        const sourceRightX = edge.sourceRightX ?? (sourceNode.frameX + sourceNode.vw);
        const sourceLeftX = edge.sourceLeftX ?? sourceNode.frameX;
        const sourceY = edge.sourceY ?? (sourceNode.frameY + sourceNode.vh / 2);
        for (const targetId of edge.targetIds) {
          const target = nodes.get(targetId);
          if (!target) continue;
          // Target is to the right → exit right edge, enter target left edge
          // Target is to the left/below → exit left edge, loop left, enter target left edge
          const targetLeftX = target.frameX;
          const targetRightX = target.frameX + target.vw;
          const goingRight = targetLeftX > sourceRightX;
          const fromX = goingRight ? sourceRightX : sourceLeftX;
          const toX = goingRight ? targetLeftX : targetLeftX;
          const toY = target.frameY + target.vh / 2;
          this.drawFlowArrow(fromX, sourceY, toX, toY, accent, goingRight);
        }
      }
    }
  }

  private drawFlowArrow(
    fromX: number, fromY: number,
    toX: number, toY: number,
    color: string,
    goingRight: boolean,
  ): void {
    const ctx = this.canvas.ctx;
    const ARROW_SIZE = 8;
    const EDGE_GAP = 12;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    if (goingRight) {
      // Right-to-left S-curve: exit right, enter left
      const startX = fromX + EDGE_GAP;
      const endX = toX - EDGE_GAP;
      const dx = endX - startX;
      const cpOffset = Math.max(40, Math.abs(dx) * 0.4);

      ctx.beginPath();
      ctx.moveTo(startX, fromY);
      ctx.bezierCurveTo(
        startX + cpOffset, fromY,
        endX - cpOffset, toY,
        endX, toY
      );
      ctx.stroke();

      // Arrowhead pointing right
      const angle = Math.atan2(toY - fromY, cpOffset);
      ctx.beginPath();
      ctx.moveTo(endX, toY);
      ctx.lineTo(endX - ARROW_SIZE * Math.cos(angle - Math.PI / 6), toY - ARROW_SIZE * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(endX - ARROW_SIZE * Math.cos(angle + Math.PI / 6), toY - ARROW_SIZE * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      // Start dot
      ctx.beginPath();
      ctx.arc(startX, fromY, 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Loop left: both exit and enter from the left side
      const startX = fromX - EDGE_GAP;
      const endX = toX - EDGE_GAP;
      // How far left the curve bulges — proportional to vertical distance
      const dy = Math.abs(toY - fromY);
      const bulge = Math.min(startX - 20, Math.max(60, dy * 0.4));
      const loopX = Math.min(startX, endX) - bulge;

      ctx.beginPath();
      ctx.moveTo(startX, fromY);
      ctx.bezierCurveTo(
        loopX, fromY,
        loopX, toY,
        endX, toY
      );
      ctx.stroke();

      // Arrowhead pointing right (entering from the left)
      ctx.beginPath();
      ctx.moveTo(endX, toY);
      ctx.lineTo(endX - ARROW_SIZE, toY - ARROW_SIZE * 0.5);
      ctx.lineTo(endX - ARROW_SIZE, toY + ARROW_SIZE * 0.5);
      ctx.closePath();
      ctx.fill();

      // Start dot
      ctx.beginPath();
      ctx.arc(startX, fromY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  getCanvasSize(): { width: number; height: number } {
    return {
      width: this.canvas.ctx.canvas.width / (window.devicePixelRatio || 1),
      height: this.canvas.ctx.canvas.height / (window.devicePixelRatio || 1),
    };
  }
}
