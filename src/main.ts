import './style.css';
import YAML from 'js-yaml';
import type { RissDocument } from './types/riss';
import { RissRenderer } from './engine/renderer';
import { validate, formatIssuesForClipboard, type ValidationIssue, type ValidationResult } from './engine/validate';

class RissWebViewer {
  private renderer!: RissRenderer;
  private document: RissDocument | null = null;
  private currentScreenIndex = -1;
  private zoom = 1;
  private prototypeMode = false;
  private prototypeHistory: number[] = [];
  private prototypeHitRegions: { x: number; y: number; w: number; h: number; next: string }[] = [];
  private validationResult: ValidationResult | null = null;
  private fileName = '';

  init(): void {
    const canvas = document.getElementById('riss-canvas') as HTMLCanvasElement;
    this.renderer = new RissRenderer(canvas);

    // Toolbar buttons
    document.getElementById('btn-open')!.addEventListener('click', () => this.openFilePicker());
    document.getElementById('btn-zoom-in')!.addEventListener('click', () => this.setZoom(this.zoom + 0.1));
    document.getElementById('btn-zoom-out')!.addEventListener('click', () => this.setZoom(this.zoom - 0.1));
    document.getElementById('btn-zoom-fit')!.addEventListener('click', () => this.fitToWindow());
    document.getElementById('btn-theme')!.addEventListener('click', () => this.toggleTheme());

    // Drag and drop
    this.setupFileDrop();

    // Pan and zoom
    this.setupPanZoom();

    // Prototype click handling
    this.setupPrototypeClick();

    // Warnings panel
    this.setupWarningsPanel();
  }

  private setupFileDrop(): void {
    const overlay = document.getElementById('drop-overlay')!;

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      overlay.classList.remove('hidden');
    });

    document.addEventListener('dragleave', (e) => {
      if (e.relatedTarget === null) {
        overlay.classList.add('hidden');
      }
    });

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      overlay.classList.add('hidden');
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
          this.loadBrowserFile(file);
        }
      }
    });
  }

  private setupPanZoom(): void {
    const container = document.getElementById('canvas-container')!;
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;
    let scrollStartX = 0;
    let scrollStartY = 0;

    container.addEventListener('mousedown', (e) => {
      if (this.prototypeMode) return; // let prototype click handler take over
      if (e.button === 1 || (e.button === 0 && !e.metaKey && !e.ctrlKey)) {
        isPanning = true;
        panStartX = e.clientX;
        panStartY = e.clientY;
        scrollStartX = container.scrollLeft;
        scrollStartY = container.scrollTop;
        container.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });

    const onMouseMove = (e: MouseEvent) => {
      if (!isPanning) return;
      container.scrollLeft = scrollStartX - (e.clientX - panStartX);
      container.scrollTop = scrollStartY - (e.clientY - panStartY);
    };

    const onMouseUp = () => {
      if (isPanning) {
        isPanning = false;
        container.style.cursor = '';
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('wheel', (e) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        this.setZoom(this.zoom + delta);
      }
    }, { passive: false });
  }

  private openFilePicker(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.yaml,.yml';
    input.addEventListener('change', () => {
      if (input.files && input.files.length > 0) {
        this.loadBrowserFile(input.files[0]);
      }
    });
    input.click();
  }

  private async loadBrowserFile(file: File): Promise<void> {
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
    if (file.size > MAX_FILE_SIZE) {
      alert('File too large (max 1 MB)');
      return;
    }
    try {
      const text = await file.text();
      const json = YAML.load(text) as RissDocument;
      this.loadDocument(json, file.name);
    } catch (e) {
      console.error('Failed to parse YAML:', e);
      alert(`Failed to parse file: ${e}`);
    }
  }

  private loadDocument(doc: RissDocument, fileName: string): void {
    this.document = doc;
    this.fileName = fileName;
    this.currentScreenIndex = doc.screens.length > 1 ? -1 : 0;

    // Run validation
    this.validationResult = validate(doc);
    this.updateWarningsPanel();

    // Update UI
    document.getElementById('file-name')!.textContent = fileName;
    document.getElementById('empty-state')!.classList.add('hidden');
    document.getElementById('canvas-wrapper')!.classList.add('visible');

    // Setup screen navigation
    this.setupScreenNav();
    this.renderCurrentScreen();
  }

  private setupScreenNav(): void {
    if (!this.document) return;
    const nav = document.getElementById('screen-nav')!;
    nav.innerHTML = '';

    const screens = this.document.screens;

    const setActive = (btn: HTMLButtonElement) => {
      nav.querySelectorAll('.screen-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };

    if (screens.length > 1) {
      const overviewBtn = document.createElement('button');
      overviewBtn.className = 'screen-tab active';
      overviewBtn.textContent = 'Overview';
      overviewBtn.addEventListener('click', () => {
        setActive(overviewBtn);
        this.exitPrototype();
        this.currentScreenIndex = -1;
        this.renderCurrentScreen();
      });
      nav.appendChild(overviewBtn);
    }

    screens.forEach((screen, index) => {
      const btn = document.createElement('button');
      btn.className = 'screen-tab';
      if (screens.length === 1) btn.classList.add('active');
      btn.textContent = screen.title;
      btn.addEventListener('click', () => {
        setActive(btn);
        this.exitPrototype();
        this.currentScreenIndex = index;
        this.renderCurrentScreen();
      });
      nav.appendChild(btn);
    });

    // Prototype tab — only if there are screens with `next`
    const hasNext = screens.some(s =>
      s.children.some(c => this.hasNextDeep(c))
    );
    if (hasNext && screens.length > 1) {
      const divider = document.createElement('div');
      divider.className = 'nav-divider';
      nav.appendChild(divider);

      const protoBtn = document.createElement('button');
      protoBtn.className = 'screen-tab screen-tab-proto';
      protoBtn.textContent = '\u25B6 Prototype';
      protoBtn.addEventListener('click', () => {
        setActive(protoBtn);
        this.enterPrototype();
      });
      nav.appendChild(protoBtn);
    }
  }

  private hasNextDeep(node: any): boolean {
    if (node.next) return true;
    if (node.children) {
      for (const child of node.children) {
        if (this.hasNextDeep(child)) return true;
      }
    }
    return false;
  }

  private renderCurrentScreen(): void {
    if (!this.document) return;

    if (this.currentScreenIndex === -1) {
      this.renderer.renderOverview(this.document);
    } else {
      this.renderer.render(this.document, this.currentScreenIndex);
    }

    this.applyZoom();
  }

  private applyZoom(): void {
    const wrapper = document.getElementById('canvas-wrapper')!;
    const container = document.getElementById('canvas-container')!;
    const canvas = document.getElementById('riss-canvas') as HTMLCanvasElement;
    wrapper.style.transform = `scale(${this.zoom})`;
    wrapper.style.transformOrigin = 'top left';
    // Set wrapper dimensions so the container's scrollable area reflects the zoomed size
    const cssW = parseFloat(canvas.style.width) || 0;
    const cssH = parseFloat(canvas.style.height) || 0;
    wrapper.style.width = `${cssW * this.zoom}px`;
    wrapper.style.height = `${cssH * this.zoom}px`;
    // Center the canvas when it's smaller than the container
    const scaledW = cssW * this.zoom;
    const scaledH = cssH * this.zoom;
    const fitsH = scaledW <= container.clientWidth;
    const fitsV = scaledH <= container.clientHeight;
    wrapper.style.margin = `${fitsV ? 'auto' : '0'} ${fitsH ? 'auto' : '0'}`;
  }

  private setZoom(level: number): void {
    this.zoom = Math.max(0.25, Math.min(3, level));
    document.getElementById('zoom-level')!.textContent = `${Math.round(this.zoom * 100)}%`;
    if (this.document) {
      this.applyZoom();
    }
  }

  private fitToWindow(): void {
    if (!this.document) return;
    const container = document.getElementById('canvas-container')!;
    const { width } = this.renderer.getCanvasSize();
    const availableWidth = container.clientWidth - 80;
    this.setZoom(Math.min(1, availableWidth / width));
  }

  private enterPrototype(): void {
    if (!this.document) return;
    this.prototypeMode = true;
    this.prototypeHistory = [];
    this.currentScreenIndex = 0;
    this.renderPrototypeScreen();
    this.showPrototypeBar(true);
  }

  private exitPrototype(): void {
    this.prototypeMode = false;
    this.prototypeHitRegions = [];
    this.prototypeHistory = [];
    this.showPrototypeBar(false);
    const canvas = document.getElementById('riss-canvas') as HTMLCanvasElement;
    canvas.style.cursor = '';
  }

  private showPrototypeBar(show: boolean): void {
    let bar = document.getElementById('proto-bar');
    if (show) {
      if (!bar) {
        bar = document.createElement('div');
        bar.id = 'proto-bar';
        const backBtn = document.createElement('button');
        backBtn.id = 'proto-back';
        backBtn.className = 'toolbar-btn-sm';
        backBtn.title = 'Go back';
        backBtn.disabled = true;
        backBtn.textContent = '\u2190';
        const nameSpan = document.createElement('span');
        nameSpan.id = 'proto-screen-name';
        nameSpan.className = 'proto-screen-name';
        bar.appendChild(backBtn);
        bar.appendChild(nameSpan);
        // Insert into toolbar-left, after screen-nav
        const toolbarLeft = document.querySelector('.toolbar-left')!;
        toolbarLeft.appendChild(bar);
        backBtn.addEventListener('click', () => this.prototypeBack());
      }
      bar.classList.remove('hidden');
      this.updatePrototypeBar();
    } else if (bar) {
      bar.classList.add('hidden');
    }
  }

  private updatePrototypeBar(): void {
    if (!this.document) return;
    const screen = this.document.screens[this.currentScreenIndex];
    const nameEl = document.getElementById('proto-screen-name');
    const backBtn = document.getElementById('proto-back') as HTMLButtonElement;
    if (nameEl) nameEl.textContent = screen?.title || '';
    if (backBtn) backBtn.disabled = this.prototypeHistory.length === 0;
  }

  private renderPrototypeScreen(): void {
    if (!this.document) return;
    this.prototypeHitRegions = this.renderer.renderPrototype(this.document, this.currentScreenIndex);
    this.updatePrototypeBar();
    this.applyZoom();
  }

  private prototypeBack(): void {
    if (this.prototypeHistory.length === 0) return;
    this.currentScreenIndex = this.prototypeHistory.pop()!;
    this.renderPrototypeScreen();
  }

  private prototypeNavigate(targetId: string): void {
    if (!this.document) return;
    const idx = this.document.screens.findIndex(s => s.id === targetId);
    if (idx === -1) return;
    this.prototypeHistory.push(this.currentScreenIndex);
    this.currentScreenIndex = idx;
    this.renderPrototypeScreen();
  }

  private canvasHitTest(e: MouseEvent): { x: number; y: number } {
    const canvas = document.getElementById('riss-canvas') as HTMLCanvasElement;
    const rect = canvas.getBoundingClientRect();
    // rect already accounts for CSS transforms (zoom)
    // Convert to logical canvas coordinates (canvas.style.width/height)
    const cssW = parseFloat(canvas.style.width) || rect.width;
    const cssH = parseFloat(canvas.style.height) || rect.height;
    const x = ((e.clientX - rect.left) / rect.width) * cssW;
    const y = ((e.clientY - rect.top) / rect.height) * cssH;
    return { x, y };
  }

  private getOverlayCanvas(): HTMLCanvasElement {
    let overlay = document.getElementById('riss-canvas-overlay') as HTMLCanvasElement | null;
    if (!overlay) {
      overlay = document.createElement('canvas');
      overlay.id = 'riss-canvas-overlay';
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.pointerEvents = 'none';
      const wrapper = document.getElementById('canvas-wrapper')!;
      wrapper.style.position = 'relative';
      wrapper.appendChild(overlay);
    }
    // Keep in sync with main canvas size
    const main = document.getElementById('riss-canvas') as HTMLCanvasElement;
    overlay.width = main.width;
    overlay.height = main.height;
    overlay.style.width = main.style.width;
    overlay.style.height = main.style.height;
    return overlay;
  }

  private drawHoverHighlight(hr: { x: number; y: number; w: number; h: number } | null): void {
    const overlay = this.getOverlayCanvas();
    const ctx = overlay.getContext('2d')!;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    if (!hr) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = 'rgba(74, 222, 128, 0.3)'; // light green
    ctx.roundRect(hr.x, hr.y, hr.w, hr.h, 4);
    ctx.fill();
  }

  private setupPrototypeClick(): void {
    const canvas = document.getElementById('riss-canvas') as HTMLCanvasElement;

    canvas.addEventListener('click', (e) => {
      if (!this.prototypeMode || this.prototypeHitRegions.length === 0) return;
      const { x, y } = this.canvasHitTest(e);

      for (let i = this.prototypeHitRegions.length - 1; i >= 0; i--) {
        const hr = this.prototypeHitRegions[i];
        if (x >= hr.x && x <= hr.x + hr.w && y >= hr.y && y <= hr.y + hr.h) {
          this.prototypeNavigate(hr.next);
          return;
        }
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!this.prototypeMode || this.prototypeHitRegions.length === 0) {
        this.drawHoverHighlight(null);
        return;
      }
      const { x, y } = this.canvasHitTest(e);

      let hit: typeof this.prototypeHitRegions[0] | null = null;
      for (const hr of this.prototypeHitRegions) {
        if (x >= hr.x && x <= hr.x + hr.w && y >= hr.y && y <= hr.y + hr.h) {
          hit = hr;
          break;
        }
      }
      canvas.style.cursor = hit ? 'pointer' : '';
      this.drawHoverHighlight(hit);
    });

    canvas.addEventListener('mouseleave', () => {
      this.drawHoverHighlight(null);
    });
  }

  private toggleTheme(): void {
    if (!this.document) return;
    const current = this.document.meta.theme?.mode || 'light';
    if (!this.document.meta.theme) this.document.meta.theme = {};
    this.document.meta.theme.mode = current === 'light' ? 'dark' : 'light';
    const btn = document.getElementById('btn-theme')!;
    btn.textContent = this.document.meta.theme.mode === 'dark' ? '\u2600' : '\u263D';
    if (this.prototypeMode) {
      this.renderPrototypeScreen();
    } else {
      this.renderCurrentScreen();
    }
  }

  // ── Warnings panel ──────────────────────────────────────────────────

  private setupWarningsPanel(): void {
    const toggleBtn = document.getElementById('btn-warnings')!;
    const panel = document.getElementById('warnings-panel')!;

    toggleBtn.addEventListener('click', () => {
      const isVisible = !panel.classList.contains('hidden');
      if (isVisible) {
        panel.classList.add('hidden');
        toggleBtn.classList.remove('active');
      } else {
        panel.classList.remove('hidden');
        toggleBtn.classList.add('active');
      }
    });

    document.getElementById('warnings-copy')!.addEventListener('click', () => {
      if (!this.validationResult) return;
      const text = formatIssuesForClipboard(this.validationResult.issues, this.fileName);
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('warnings-copy')!;
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
      });
    });
  }

  private updateWarningsPanel(): void {
    const panel = document.getElementById('warnings-panel')!;
    const list = document.getElementById('warnings-list')!;
    const badge = document.getElementById('warnings-badge')!;
    const toggleBtn = document.getElementById('btn-warnings')!;
    const summary = document.getElementById('warnings-summary')!;

    if (!this.validationResult || this.validationResult.issues.length === 0) {
      badge.textContent = '';
      badge.classList.add('hidden');
      panel.classList.add('hidden');
      toggleBtn.classList.remove('active');
      list.innerHTML = '<div class="warnings-empty">No issues found</div>';
      summary.textContent = '';
      return;
    }

    const issues = this.validationResult.issues;
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warnCount = issues.filter(i => i.severity === 'warning').length;

    // Badge
    badge.textContent = String(issues.length);
    badge.className = 'warnings-badge' + (errorCount > 0 ? ' has-errors' : ' has-warnings');

    // Summary
    const parts: string[] = [];
    if (errorCount > 0) parts.push(`${errorCount} error${errorCount > 1 ? 's' : ''}`);
    if (warnCount > 0) parts.push(`${warnCount} warning${warnCount > 1 ? 's' : ''}`);
    summary.textContent = parts.join(', ');

    // Render list
    list.innerHTML = '';
    for (const issue of issues) {
      const item = document.createElement('div');
      item.className = `warning-item ${issue.severity}`;

      const header = document.createElement('div');
      header.className = 'warning-item-header';

      const sev = document.createElement('span');
      sev.className = `warning-severity ${issue.severity}`;
      sev.textContent = issue.severity === 'error' ? 'ERR' : 'WARN';

      const path = document.createElement('span');
      path.className = 'warning-path';
      path.textContent = issue.path;

      header.appendChild(sev);
      header.appendChild(path);

      const msg = document.createElement('div');
      msg.className = 'warning-message';
      msg.textContent = issue.message;

      item.appendChild(header);
      item.appendChild(msg);
      list.appendChild(item);
    }

    // Auto-show panel if there are errors
    if (errorCount > 0) {
      panel.classList.remove('hidden');
      toggleBtn.classList.add('active');
    }
  }
}

const viewer = new RissWebViewer();
viewer.init();
