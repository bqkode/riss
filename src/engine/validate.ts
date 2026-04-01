import { z } from 'zod';

// ── Result types ──────────────────────────────────────────────────────

export type Severity = 'error' | 'warning';

export interface ValidationIssue {
  severity: Severity;
  path: string;          // e.g. "screens[0].children[2]"
  message: string;
}

export interface ValidationResult {
  issues: ValidationIssue[];
  valid: boolean;        // true when zero errors (warnings are ok)
}

// ── Token enums ───────────────────────────────────────────────────────

const SpacingToken = z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']);
const RadiusToken = z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']);
const ElevationToken = z.enum(['none', 'sm', 'md', 'lg']);
const SizeToken = z.enum(['sm', 'md', 'lg']);
const AlignToken = z.enum(['left', 'center', 'right', 'stretch']);
const JustifyToken = z.enum(['start', 'center', 'end', 'between', 'around', 'evenly']);

const WidthHeight = z.union([
  z.number(),
  z.enum(['auto', 'full', 'half', '1/3', '2/3', '1/4', '3/4']),
]);

const SpacingValue = z.union([SpacingToken, z.number()]);

const ColorToken = z.string(); // tokens or hex — validated separately

const VALID_COLOR_TOKENS = new Set([
  'background', 'surface', 'surface-raised', 'text', 'text-secondary',
  'text-disabled', 'border', 'border-strong', 'accent', 'accent-soft',
  'success', 'warning', 'error', 'placeholder',
]);

const VALID_ICON_NAMES = new Set([
  'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'bell', 'bookmark',
  'calendar', 'camera', 'chart', 'check', 'chevron-down', 'chevron-left',
  'chevron-right', 'chevron-up', 'clock', 'close', 'code', 'copy',
  'credit-card', 'dollar-sign', 'download', 'edit', 'error', 'eye', 'eye-off',
  'file', 'filter', 'folder', 'globe', 'heart', 'help', 'home', 'image',
  'inbox', 'info', 'link', 'lock', 'mail', 'map-pin', 'menu', 'mic', 'minus',
  'more-horizontal', 'more-vertical', 'pause', 'phone', 'play', 'plus',
  'refresh', 'search', 'settings', 'share', 'shield', 'skip-back',
  'skip-forward', 'sort', 'star', 'trash', 'unlock', 'upload', 'user',
  'users', 'video', 'warning', 'zap',
  // aliases that renderers accept
  'bar-chart', 'refresh-cw', 'git-branch',
]);

const VALID_ELEMENT_TYPES = new Set([
  'stack', 'row', 'grid', 'scroll', 'card', 'section', 'modal', 'bottomsheet',
  'text', 'image', 'icon', 'avatar', 'divider', 'spacer', 'badge', 'chip', 'progress',
  'button', 'input', 'textarea', 'checkbox', 'radio', 'toggle', 'select', 'slider',
  'navbar', 'tabbar', 'tabs', 'breadcrumb',
  'list', 'list-item', 'table', 'placeholder',
  'alert', 'toast', 'skeleton', 'empty-state', 'spinner',
  'annotation',
]);

const VALID_BLOCK_NAMES = new Set([
  'hero', 'page-header', 'announcement-bar', 'sidebar-nav', 'top-nav',
  'breadcrumb-header', 'bottom-nav', 'side-by-side', 'alternating-rows',
  'content-carousel', 'blog-card-grid', 'timeline', 'rich-text',
  'feature-grid', 'feature-list', 'checklist', 'how-it-works', 'logo-bar',
  'testimonial-card', 'testimonial-grid', 'stats-row', 'rating-block',
  'pricing-table', 'pricing-card', 'cta-banner', 'cta-inline', 'cta-with-input',
  'login-form', 'signup-form', 'contact-form', 'search-with-filters',
  'multi-step-form', 'settings-form', 'stat-cards-row', 'data-table',
  'activity-feed', 'chart-card', 'kanban-board', 'product-card-grid',
  'product-detail', 'cart-summary', 'checkout-steps', 'profile-header',
  'team-grid', 'avatar-list', 'card-grid', 'media-gallery', 'accordion',
  'ranked-list', 'empty-state-block', 'error-page', 'loading-skeleton',
  'confirmation', 'chat-thread', 'comment-thread', 'notification-list', 'footer',
]);

// ── Common layout props (shared by all elements) ─────────────────────

const COMMON_PROPS = new Set([
  'type', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  'grow', 'shrink', 'padding', 'padding-x', 'padding-y', 'margin', 'margin-x',
  'margin-y', 'gap', 'align', 'justify', 'align-self', 'background', 'border',
  'rounded', 'elevation', 'overflow', 'role', 'annotation', 'next', 'children', 'id',
]);

// ── Per-element known props ──────────────────────────────────────────

const ELEMENT_KNOWN_PROPS: Record<string, Set<string>> = {
  'stack':       new Set([]),
  'row':         new Set(['wrap']),
  'grid':        new Set(['columns', 'column-gap', 'row-gap']),
  'scroll':      new Set(['direction']),
  'card':        new Set(['variant']),
  'section':     new Set(['title', 'collapsible', 'collapsed']),
  'modal':       new Set(['title', 'close']),
  'bottomsheet': new Set(['handle']),
  'text':        new Set(['content', 'variant', 'color', 'weight', 'maxLines', 'max-lines', 'line-height']),
  'image':       new Set(['label', 'alt', 'src', 'rounded', 'aspect-ratio']),
  'icon':        new Set(['name', 'icon', 'size', 'color']),
  'avatar':      new Set(['initials', 'content', 'color', 'size']),
  'divider':     new Set(['color', 'thickness', 'direction']),
  'spacer':      new Set([]),
  'badge':       new Set(['content', 'color']),
  'chip':        new Set(['variant', 'label', 'content', 'color', 'removable', 'icon']),
  'progress':    new Set(['value', 'label', 'color', 'height']),
  'button':      new Set(['variant', 'size', 'label', 'content', 'icon', 'icon-leading', 'icon-trailing', 'disabled']),
  'input':       new Set(['variant', 'label', 'placeholder', 'value', 'helper', 'error', 'required', 'icon-leading', 'icon-trailing', 'type']),
  'textarea':    new Set(['label', 'placeholder', 'value', 'helper', 'error', 'required', 'rows']),
  'checkbox':    new Set(['checked', 'value', 'label']),
  'radio':       new Set(['label', 'options', 'value', 'direction']),
  'toggle':      new Set(['checked', 'value', 'label']),
  'select':      new Set(['label', 'placeholder', 'value', 'options', 'error', 'required']),
  'slider':      new Set(['min', 'max', 'value', 'label', 'color', 'show-value']),
  'navbar':      new Set(['title', 'leading', 'trailing']),
  'tabbar':      new Set(['items', 'active']),
  'tabs':        new Set(['items', 'tabs', 'active', 'variant']),
  'breadcrumb':  new Set(['items', 'separator']),
  'list':        new Set(['dividers', 'inset']),
  'list-item':   new Set(['title', 'subtitle', 'size', 'leading', 'trailing']),
  'table':       new Set(['columns', 'rows', 'data', 'striped', 'bordered', 'border']),
  'placeholder': new Set(['label', 'icon']),
  'alert':       new Set(['variant', 'title', 'message', 'content', 'icon', 'dismissable']),
  'toast':       new Set(['message', 'content', 'variant', 'action']),
  'skeleton':    new Set(['variant', 'lines']),
  'empty-state': new Set(['icon', 'title', 'message', 'action']),
  'spinner':     new Set(['color', 'size']),
  'annotation':  new Set(['number', 'text', 'content', 'color', 'position']),
};

// ── Per-element enum constraints ─────────────────────────────────────

interface EnumConstraint {
  prop: string;
  values: Set<string>;
  label: string;
}

const ELEMENT_ENUMS: Record<string, EnumConstraint[]> = {
  'text': [
    { prop: 'variant', values: new Set(['h1','h2','h3','h4','h5','h6','body','body-sm','caption','label','overline','code']), label: 'text variant' },
    { prop: 'align', values: new Set(['left','center','right']), label: 'text align' },
    { prop: 'weight', values: new Set(['normal','medium','semibold','bold']), label: 'font weight' },
  ],
  'button': [
    { prop: 'variant', values: new Set(['primary','secondary','outline','ghost','text','danger']), label: 'button variant' },
    { prop: 'size', values: new Set(['sm','md','lg']), label: 'button size' },
  ],
  'input': [
    { prop: 'variant', values: new Set(['outlined','filled','underline']), label: 'input variant' },
  ],
  'card': [
    { prop: 'variant', values: new Set(['outlined','elevated','filled']), label: 'card variant' },
  ],
  'chip': [
    { prop: 'variant', values: new Set(['filled','outlined']), label: 'chip variant' },
  ],
  'alert': [
    { prop: 'variant', values: new Set(['info','success','warning','error']), label: 'alert variant' },
  ],
  'toast': [
    { prop: 'variant', values: new Set(['info','success','warning','error']), label: 'toast variant' },
  ],
  'skeleton': [
    { prop: 'variant', values: new Set(['rect','text','circle','avatar','card','list-item']), label: 'skeleton variant' },
  ],
  'tabs': [
    { prop: 'variant', values: new Set(['underline','filled','pill']), label: 'tabs variant' },
  ],
  'list-item': [
    { prop: 'size', values: new Set(['sm','md','lg']), label: 'list-item size' },
  ],
  'divider': [
    { prop: 'direction', values: new Set(['horizontal','vertical']), label: 'divider direction' },
  ],
  'radio': [
    { prop: 'direction', values: new Set(['vertical','horizontal']), label: 'radio direction' },
  ],
  'scroll': [
    { prop: 'direction', values: new Set(['vertical','horizontal']), label: 'scroll direction' },
  ],
};

// ── Document-level schemas (Zod) ─────────────────────────────────────

const ViewportSchema = z.object({
  width: z.number().min(1).max(8000).optional(),
  height: z.number().min(1).max(8000).optional(),
}).strict();

const ThemeSchema = z.object({
  mode: z.enum(['light', 'dark']).optional(),
  accent: z.string().optional(),
}).strict();

const RoleSchema = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string(),
}).strict();

const MetaSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  viewport: ViewportSchema.optional(),
  theme: ThemeSchema.optional(),
  roles: z.array(RoleSchema).optional(),
}).strict();

const CustomBlockParamSchema = z.object({
  name: z.string(),
  required: z.boolean().optional(),
  default: z.any().optional(),
}).strict();

const CustomBlockDefSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  params: z.array(CustomBlockParamSchema),
  template: z.array(z.any()),
}).strict();

// Screens and elements validated manually (recursive, with custom diagnostics)

const DocumentShellSchema = z.object({
  riss: z.string(),
  meta: MetaSchema,
  blocks: z.array(CustomBlockDefSchema).optional(),
  screens: z.array(z.any()).min(1, 'Document must have at least one screen'),
});

// ── Main validation function ─────────────────────────────────────────

export function validate(doc: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  // Phase 1: document-level structure
  const parsed = DocumentShellSchema.safeParse(doc);
  if (!parsed.success) {
    for (const err of parsed.error.issues) {
      issues.push({
        severity: 'error',
        path: err.path.join('.') || 'document',
        message: err.message,
      });
    }
    // If top-level structure is broken, stop here
    return { issues, valid: false };
  }

  const rissDoc = doc as any;

  // Phase 2: validate accent color if present
  if (rissDoc.meta.theme?.accent) {
    const hex = rissDoc.meta.theme.accent;
    if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(hex)) {
      issues.push({
        severity: 'warning',
        path: 'meta.theme.accent',
        message: `Invalid hex color "${hex}" — must be #RGB, #RRGGBB, or #RRGGBBAA. Falling back to #2563EB.`,
      });
    }
  }

  // Phase 3: validate each screen
  const screens = rissDoc.screens as any[];
  const screenIds = new Set<string>();
  for (let si = 0; si < screens.length; si++) {
    const screen = screens[si];
    const sp = `screens[${si}]`;

    if (!screen || typeof screen !== 'object') {
      issues.push({ severity: 'error', path: sp, message: 'Screen must be an object.' });
      continue;
    }
    if (!screen.id) {
      issues.push({ severity: 'error', path: sp, message: 'Screen is missing required "id" field.' });
    } else if (screenIds.has(screen.id)) {
      issues.push({ severity: 'error', path: `${sp}.id`, message: `Duplicate screen id "${screen.id}".` });
    } else {
      screenIds.add(screen.id);
    }
    if (!screen.title) {
      issues.push({ severity: 'warning', path: sp, message: 'Screen is missing "title" field.' });
    }
    if (!screen.children || !Array.isArray(screen.children)) {
      issues.push({ severity: 'error', path: sp, message: 'Screen is missing "children" array.' });
      continue;
    }
    if (screen.children.length === 0) {
      issues.push({ severity: 'warning', path: `${sp}.children`, message: 'Screen has no children — it will render empty.' });
    }

    // Validate children recursively
    validateChildren(screen.children, `${sp}.children`, rissDoc, issues);
  }

  // Phase 4: validate `next` references point to existing screen ids
  validateNextReferences(rissDoc, screenIds, issues);

  return {
    issues,
    valid: !issues.some(i => i.severity === 'error'),
  };
}

// ── Recursive child validation ───────────────────────────────────────

function validateChildren(
  children: any[],
  basePath: string,
  doc: any,
  issues: ValidationIssue[],
): void {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const cp = `${basePath}[${i}]`;

    if (!child || typeof child !== 'object') {
      issues.push({ severity: 'error', path: cp, message: 'Child must be an object.' });
      continue;
    }

    if (child.block) {
      validateBlock(child, cp, doc, issues);
    } else if (child.type) {
      validateElement(child, cp, doc, issues);
    } else {
      issues.push({
        severity: 'error',
        path: cp,
        message: 'Child must have either "type" (element) or "block" (block usage) field.',
      });
    }
  }
}

function validateBlock(
  block: any,
  path: string,
  doc: any,
  issues: ValidationIssue[],
): void {
  const name = block.block;

  // Check core blocks
  if (!VALID_BLOCK_NAMES.has(name)) {
    // Check custom blocks
    const customBlocks = doc.blocks as any[] | undefined;
    const isCustom = customBlocks?.some((b: any) => b.id === name);
    if (!isCustom) {
      issues.push({
        severity: 'error',
        path: `${path}.block`,
        message: `Unknown block "${name}". Did you mean one of: ${suggestSimilar(name, VALID_BLOCK_NAMES)}?`,
      });
    }
  }
}

function validateElement(
  el: any,
  path: string,
  doc: any,
  issues: ValidationIssue[],
): void {
  const type = el.type as string;

  // Check element type is known
  if (!VALID_ELEMENT_TYPES.has(type)) {
    issues.push({
      severity: 'error',
      path: `${path}.type`,
      message: `Unknown element type "${type}". Did you mean one of: ${suggestSimilar(type, VALID_ELEMENT_TYPES)}?`,
    });
    return; // can't validate props on unknown type
  }

  // Check for unknown properties
  const knownForType = ELEMENT_KNOWN_PROPS[type];
  if (knownForType) {
    for (const key of Object.keys(el)) {
      if (COMMON_PROPS.has(key) || knownForType.has(key)) continue;
      issues.push({
        severity: 'warning',
        path: `${path}.${key}`,
        message: `Unknown property "${key}" on <${type}> element. This property will be ignored.`,
      });
    }
  }

  // Check enum constraints
  const enums = ELEMENT_ENUMS[type];
  if (enums) {
    for (const ec of enums) {
      const val = el[ec.prop];
      if (val !== undefined && typeof val === 'string' && !ec.values.has(val)) {
        issues.push({
          severity: 'warning',
          path: `${path}.${ec.prop}`,
          message: `Invalid ${ec.label} "${val}". Valid values: ${[...ec.values].join(', ')}.`,
        });
      }
    }
  }

  // Validate spacing tokens
  for (const prop of ['gap', 'padding', 'padding-x', 'padding-y', 'margin', 'margin-x', 'margin-y']) {
    const val = el[prop];
    if (val !== undefined && typeof val === 'string') {
      if (!SpacingToken.safeParse(val).success) {
        issues.push({
          severity: 'warning',
          path: `${path}.${prop}`,
          message: `Invalid spacing token "${val}". Valid values: none, xs, sm, md, lg, xl, 2xl, 3xl.`,
        });
      }
    }
  }

  // Validate rounded token
  if (el.rounded !== undefined && typeof el.rounded === 'string') {
    if (!RadiusToken.safeParse(el.rounded).success) {
      issues.push({
        severity: 'warning',
        path: `${path}.rounded`,
        message: `Invalid border-radius token "${el.rounded}". Valid values: none, sm, md, lg, xl, full.`,
      });
    }
  }

  // Validate elevation token
  if (el.elevation !== undefined && typeof el.elevation === 'string') {
    if (!ElevationToken.safeParse(el.elevation).success) {
      issues.push({
        severity: 'warning',
        path: `${path}.elevation`,
        message: `Invalid elevation token "${el.elevation}". Valid values: none, sm, md, lg.`,
      });
    }
  }

  // Validate color tokens used in background
  if (el.background !== undefined && typeof el.background === 'string') {
    validateColorRef(el.background, `${path}.background`, issues);
  }

  // Validate icon names on elements that use them
  validateIconProps(el, type, path, issues);

  // Recurse into children
  if (el.children && Array.isArray(el.children)) {
    validateChildren(el.children, `${path}.children`, doc, issues);
  }
}

// ── Icon validation ──────────────────────────────────────────────────

function validateIconProps(el: any, type: string, path: string, issues: ValidationIssue[]): void {
  const iconProps: string[] = [];
  if (type === 'icon') iconProps.push('name', 'icon');
  if (['button', 'input', 'chip', 'empty-state'].includes(type)) iconProps.push('icon', 'icon-leading', 'icon-trailing');

  for (const prop of iconProps) {
    const val = el[prop];
    if (val && typeof val === 'string' && !VALID_ICON_NAMES.has(val)) {
      issues.push({
        severity: 'warning',
        path: `${path}.${prop}`,
        message: `Unknown icon name "${val}". It will render as a placeholder square.`,
      });
    }
  }
}

// ── Color validation ─────────────────────────────────────────────────

function validateColorRef(value: string, path: string, issues: ValidationIssue[]): void {
  // Accept known tokens, hex colors, or transparent
  if (VALID_COLOR_TOKENS.has(value)) return;
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value)) return;
  if (value === 'transparent') return;

  issues.push({
    severity: 'warning',
    path,
    message: `Unknown color "${value}". Use a color token (${[...VALID_COLOR_TOKENS].slice(0, 5).join(', ')}, ...) or a hex value (#RRGGBB).`,
  });
}

// ── next reference validation ────────────────────────────────────────

function validateNextReferences(doc: any, screenIds: Set<string>, issues: ValidationIssue[]): void {
  const screens = doc.screens as any[];
  for (let si = 0; si < screens.length; si++) {
    const screen = screens[si];
    if (!screen.children) continue;
    walkNextRefs(screen.children, `screens[${si}].children`, screenIds, issues);
  }
}

function walkNextRefs(children: any[], basePath: string, screenIds: Set<string>, issues: ValidationIssue[]): void {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (!child || typeof child !== 'object') continue;
    const cp = `${basePath}[${i}]`;

    if (child.next) {
      const targets = Array.isArray(child.next) ? child.next : [child.next];
      for (const t of targets) {
        if (typeof t === 'string' && !screenIds.has(t)) {
          issues.push({
            severity: 'warning',
            path: `${cp}.next`,
            message: `Navigation target "${t}" does not match any screen id. Available: ${[...screenIds].join(', ')}.`,
          });
        }
      }
    }

    if (child.children && Array.isArray(child.children)) {
      walkNextRefs(child.children, `${cp}.children`, screenIds, issues);
    }
  }
}

// ── Fuzzy suggestion helper ──────────────────────────────────────────

function suggestSimilar(input: string, candidates: Set<string>): string {
  const scores: [string, number][] = [];
  for (const c of candidates) {
    const d = levenshtein(input.toLowerCase(), c.toLowerCase());
    if (d <= 3) scores.push([c, d]);
  }
  scores.sort((a, b) => a[1] - b[1]);
  const top = scores.slice(0, 3).map(s => s[0]);
  return top.length > 0 ? top.join(', ') : '(no close matches)';
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ── Format issues for clipboard ──────────────────────────────────────

export function formatIssuesForClipboard(issues: ValidationIssue[], fileName: string): string {
  if (issues.length === 0) return 'No validation issues found.';

  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  let out = `Riss validation report for: ${fileName}\n`;
  out += `${errors.length} error(s), ${warnings.length} warning(s)\n`;
  out += '─'.repeat(60) + '\n\n';

  if (errors.length > 0) {
    out += 'ERRORS:\n';
    for (const e of errors) {
      out += `  [ERROR] ${e.path}: ${e.message}\n`;
    }
    out += '\n';
  }

  if (warnings.length > 0) {
    out += 'WARNINGS:\n';
    for (const w of warnings) {
      out += `  [WARN]  ${w.path}: ${w.message}\n`;
    }
    out += '\n';
  }

  out += '─'.repeat(60) + '\n';
  out += 'Fix these issues in the .riss.yaml file and reload.\n';

  return out;
}
