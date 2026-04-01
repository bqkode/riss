import fs from 'fs';
import path from 'path';
import YAML from 'js-yaml';

const VALID_ELEMENT_TYPES = new Set([
  'alert', 'annotation', 'avatar', 'badge', 'bottomsheet', 'breadcrumb',
  'button', 'card', 'checkbox', 'chip', 'divider', 'empty-state', 'grid',
  'icon', 'image', 'input', 'list', 'list-item', 'modal', 'navbar',
  'placeholder', 'progress', 'radio', 'row', 'scroll', 'section', 'select',
  'skeleton', 'slider', 'spacer', 'spinner', 'stack', 'tabbar', 'table',
  'tabs', 'text', 'textarea', 'toast', 'toggle',
]);

const VALID_BLOCK_NAMES = new Set([
  'hero', 'page-header', 'announcement-bar', 'sidebar-nav', 'top-nav',
  'breadcrumb-header', 'bottom-nav', 'side-by-side', 'alternating-rows',
  'content-carousel', 'blog-card-grid', 'timeline', 'rich-text',
  'feature-grid', 'feature-list', 'checklist', 'how-it-works', 'logo-bar',
  'testimonial-card', 'testimonial-grid', 'stats-row', 'rating-block',
  'pricing-table', 'pricing-card', 'cta-banner', 'cta-inline',
  'cta-with-input', 'login-form', 'signup-form', 'contact-form',
  'search-with-filters', 'multi-step-form', 'settings-form',
  'stat-cards-row', 'data-table', 'activity-feed', 'chart-card',
  'kanban-board', 'product-card-grid', 'product-detail', 'cart-summary',
  'checkout-steps', 'profile-header', 'team-grid', 'avatar-list',
  'card-grid', 'media-gallery', 'accordion', 'ranked-list',
  'empty-state-block', 'error-page', 'loading-skeleton', 'confirmation',
  'chat-thread', 'comment-thread', 'notification-list', 'footer',
]);

function findYamlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findYamlFiles(full));
    else if (entry.name.endsWith('.riss.yaml')) results.push(full);
  }
  return results;
}

function validateNode(node, pathStr, errors, customBlockIds) {
  if (!node || typeof node !== 'object') return;

  if (node.block) {
    // Block usage
    if (!VALID_BLOCK_NAMES.has(node.block) && !customBlockIds.has(node.block)) {
      errors.push(`${pathStr}: unknown block "${node.block}"`);
    }
  } else if (node.type) {
    // Element
    if (!VALID_ELEMENT_TYPES.has(node.type)) {
      errors.push(`${pathStr}: unknown element type "${node.type}"`);
    }
  } else {
    errors.push(`${pathStr}: node has neither 'type' nor 'block' field (keys: ${Object.keys(node).join(', ')})`);
  }

  // Recurse into children
  if (Array.isArray(node.children)) {
    node.children.forEach((child, i) => {
      validateNode(child, `${pathStr}.children[${i}]`, errors, customBlockIds);
    });
  }
  // Check items (for list elements)
  if (Array.isArray(node.items)) {
    node.items.forEach((item, i) => {
      if (item && typeof item === 'object' && (item.type || item.block)) {
        validateNode(item, `${pathStr}.items[${i}]`, errors, customBlockIds);
      }
    });
  }
  // Check columns in table
  if (Array.isArray(node.columns)) {
    node.columns.forEach((col, i) => {
      if (col && typeof col === 'object' && col.type) {
        validateNode(col, `${pathStr}.columns[${i}]`, errors, customBlockIds);
      }
    });
  }
}

function validateFile(filePath) {
  const errors = [];
  const rel = path.relative(process.cwd(), filePath);
  let text, doc;

  try {
    text = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return [`${rel}: cannot read file: ${e.message}`];
  }

  try {
    doc = YAML.load(text);
  } catch (e) {
    return [`${rel}: YAML parse error: ${e.message}`];
  }

  if (!doc || typeof doc !== 'object') {
    return [`${rel}: document is not an object`];
  }

  // Top-level checks
  if (!doc.riss) errors.push(`${rel}: missing 'riss' version field`);
  if (!doc.meta) errors.push(`${rel}: missing 'meta' field`);
  else if (!doc.meta.name) errors.push(`${rel}: missing 'meta.name'`);

  if (!doc.screens) {
    errors.push(`${rel}: missing 'screens' field`);
    return errors;
  }
  if (!Array.isArray(doc.screens)) {
    errors.push(`${rel}: 'screens' is not an array`);
    return errors;
  }
  if (doc.screens.length === 0) {
    errors.push(`${rel}: 'screens' array is empty`);
    return errors;
  }

  // Collect custom block IDs
  const customBlockIds = new Set();
  if (Array.isArray(doc.blocks)) {
    for (const b of doc.blocks) {
      if (b.id) customBlockIds.add(b.id);
    }
  }

  // Check for unknown top-level keys
  const validTopKeys = new Set(['riss', 'meta', 'blocks', 'screens']);
  for (const key of Object.keys(doc)) {
    if (!validTopKeys.has(key)) {
      errors.push(`${rel}: unknown top-level key "${key}"`);
    }
  }

  // Validate theme
  if (doc.meta?.theme?.mode && !['light', 'dark'].includes(doc.meta.theme.mode)) {
    errors.push(`${rel}: invalid theme mode "${doc.meta.theme.mode}"`);
  }

  // Validate screens
  const screenIds = new Set();
  for (let i = 0; i < doc.screens.length; i++) {
    const screen = doc.screens[i];
    const sp = `${rel}.screens[${i}]`;

    if (!screen || typeof screen !== 'object') {
      errors.push(`${sp}: screen is not an object`);
      continue;
    }
    if (!screen.id) errors.push(`${sp}: missing 'id'`);
    if (!screen.title) errors.push(`${sp}: missing 'title'`);

    if (screen.id && screenIds.has(screen.id)) {
      errors.push(`${sp}: duplicate screen id "${screen.id}"`);
    }
    screenIds.add(screen.id);

    if (!screen.children) {
      errors.push(`${sp}: missing 'children'`);
      continue;
    }
    if (!Array.isArray(screen.children)) {
      errors.push(`${sp}: 'children' is not an array`);
      continue;
    }

    for (let j = 0; j < screen.children.length; j++) {
      validateNode(screen.children[j], `${sp}.children[${j}]`, errors, customBlockIds);
    }
  }

  // Validate 'next' references point to valid screen IDs
  function checkNextRefs(node, nodePath) {
    if (!node) return;
    if (node.next) {
      const nexts = Array.isArray(node.next) ? node.next : [node.next];
      for (const n of nexts) {
        if (typeof n === 'string' && !screenIds.has(n)) {
          errors.push(`${nodePath}: 'next' references non-existent screen "${n}"`);
        }
      }
    }
    if (Array.isArray(node.children)) {
      node.children.forEach((child, i) => checkNextRefs(child, `${nodePath}.children[${i}]`));
    }
  }
  for (let i = 0; i < doc.screens.length; i++) {
    const screen = doc.screens[i];
    if (screen.next) {
      const nexts = Array.isArray(screen.next) ? screen.next : [screen.next];
      for (const n of nexts) {
        if (typeof n === 'string' && !screenIds.has(n)) {
          errors.push(`${rel}.screens[${i}]: screen 'next' references non-existent screen "${n}"`);
        }
      }
    }
    if (Array.isArray(screen.children)) {
      screen.children.forEach((child, j) => checkNextRefs(child, `${rel}.screens[${i}].children[${j}]`));
    }
  }

  // Check custom block definitions
  if (Array.isArray(doc.blocks)) {
    for (let i = 0; i < doc.blocks.length; i++) {
      const block = doc.blocks[i];
      const bp = `${rel}.blocks[${i}]`;
      if (!block.id) errors.push(`${bp}: missing 'id'`);
      if (!block.template) errors.push(`${bp}: missing 'template'`);
      else if (!Array.isArray(block.template)) errors.push(`${bp}: 'template' is not an array`);
      if (!block.params) errors.push(`${bp}: missing 'params'`);
      else if (!Array.isArray(block.params)) errors.push(`${bp}: 'params' is not an array`);
    }
  }

  return errors;
}

// Main
const testsDir = path.resolve(process.cwd(), 'tests');
const files = findYamlFiles(testsDir).sort();
let totalErrors = 0;
const fileErrors = {};

for (const f of files) {
  const errs = validateFile(f);
  if (errs.length > 0) {
    fileErrors[path.relative(process.cwd(), f)] = errs;
    totalErrors += errs.length;
  }
}

console.log(`\nValidated ${files.length} files\n`);

if (totalErrors === 0) {
  console.log('All files valid!');
} else {
  // Group errors by category
  const categories = { yaml: [], structure: [], type: [], reference: [] };

  for (const [file, errs] of Object.entries(fileErrors)) {
    for (const err of errs) {
      if (err.includes('YAML parse')) categories.yaml.push(err);
      else if (err.includes('unknown element type') || err.includes('unknown block') || err.includes('unknown top-level key')) categories.type.push(err);
      else if (err.includes('non-existent screen')) categories.reference.push(err);
      else categories.structure.push(err);
    }
  }

  console.log(`Found ${totalErrors} errors in ${Object.keys(fileErrors).length} files:\n`);

  if (categories.yaml.length) {
    console.log(`=== YAML Parse Errors (${categories.yaml.length}) ===`);
    categories.yaml.forEach(e => console.log(`  ${e}`));
    console.log();
  }
  if (categories.structure.length) {
    console.log(`=== Structure Errors (${categories.structure.length}) ===`);
    categories.structure.forEach(e => console.log(`  ${e}`));
    console.log();
  }
  if (categories.type.length) {
    console.log(`=== Type/Block Errors (${categories.type.length}) ===`);
    categories.type.forEach(e => console.log(`  ${e}`));
    console.log();
  }
  if (categories.reference.length) {
    console.log(`=== Reference Errors (${categories.reference.length}) ===`);
    categories.reference.forEach(e => console.log(`  ${e}`));
    console.log();
  }
}

process.exit(totalErrors > 0 ? 1 : 0);
