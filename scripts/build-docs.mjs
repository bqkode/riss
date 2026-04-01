/**
 * Converts markdown docs from ../docs/ to versioned static HTML pages in public/docs/<version>/
 * with proper anchors, navigation, and inter-document links for AI agents.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs';
import { join, basename, relative } from 'path';
import { marked } from 'marked';

const DOCS_SRC = join(import.meta.dirname, '..', 'docs');
const VERSION = 'v0.1';
const DOCS_OUT = join(import.meta.dirname, '..', 'public', 'docs', VERSION);

// Document mapping: source file -> output slug + title
const MAIN_DOCS = [
  { src: 'RISS_SPEC.md', slug: 'spec', title: 'Riss Specification v0.1' },
  { src: 'AI_GENERATION_GUIDE.md', slug: 'ai-guide', title: 'Riss AI Generation Guide v0.1' },
  { src: 'RISSBLOCKS_SPEC.md', slug: 'blocks', title: 'RissBlocks Specification v0.1' },
];

// Block docs
const BLOCK_DOCS_DIR = join(DOCS_SRC, 'blocks');

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Custom renderer to add id anchors to headings
const renderer = new marked.Renderer();
renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const raw = tokens.map(t => t.raw || t.text || '').join('');
  // Generate anchor from raw text (strip markdown formatting)
  const clean = raw.replace(/[`*_~\[\]()]/g, '').trim();
  const id = slugify(clean);
  return `<h${depth} id="${id}"><a href="#${id}" class="anchor">#</a> ${text}</h${depth}>\n`;
};

// Rewrite .md links to .html links
renderer.link = function ({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens);
  let resolvedHref = href || '';

  // Fix relative .md links to .html
  if (resolvedHref.endsWith('.md')) {
    resolvedHref = resolvedHref.replace(/\.md$/, '.html');
  }
  // Fix links like blocks/foo.md -> blocks/foo.html
  if (resolvedHref.includes('.md#')) {
    resolvedHref = resolvedHref.replace('.md#', '.html#');
  }
  // Map known docs
  resolvedHref = resolvedHref
    .replace('RISS_SPEC.html', `/docs/${VERSION}/spec.html`)
    .replace('AI_GENERATION_GUIDE.html', `/docs/${VERSION}/ai-guide.html`)
    .replace('RISSBLOCKS_SPEC.html', `/docs/${VERSION}/blocks.html`);

  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${resolvedHref}"${titleAttr}>${text}</a>`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
});

function buildNav(currentSlug) {
  const mainLinks = MAIN_DOCS.map(d => {
    const active = d.slug === currentSlug ? ' class="active"' : '';
    return `<li><a href="/docs/${VERSION}/${d.slug}.html"${active}>${d.title.replace(/ v0\.1$/, '')}</a></li>`;
  });

  // Block docs
  const blockFiles = existsSync(BLOCK_DOCS_DIR)
    ? readdirSync(BLOCK_DOCS_DIR).filter(f => f.endsWith('.md')).sort()
    : [];
  const blockLinks = blockFiles.map(f => {
    const slug = f.replace('.md', '');
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const active = currentSlug === `blocks/${slug}` ? ' class="active"' : '';
    return `<li><a href="/docs/${VERSION}/blocks/${slug}.html"${active}>${title}</a></li>`;
  });

  return `
    <nav class="docs-nav" aria-label="Documentation">
      <a href="/" class="nav-logo">Riss</a>
      <a href="/docs/${VERSION}/" class="nav-home">Documentation</a>
      <h3>Core Docs</h3>
      <ul>${mainLinks.join('\n')}</ul>
      <h3>Block Reference</h3>
      <ul>${blockLinks.join('\n')}</ul>
    </nav>
  `;
}

function htmlPage(title, content, currentSlug) {
  const nav = buildNav(currentSlug);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Riss Documentation</title>
  <meta name="description" content="${escapeHtml(title)} - YAML-based wireframe description format documentation">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { font-size: 15px; line-height: 1.65; color: #1a1a1a; background: #fff; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex; min-height: 100vh;
    }
    .docs-nav {
      width: 260px; min-width: 260px; padding: 20px 16px;
      border-right: 1px solid #e5e7eb; background: #fafafa;
      position: sticky; top: 0; height: 100vh; overflow-y: auto;
    }
    .nav-logo {
      font-weight: 700; font-size: 17px; color: #111; text-decoration: none;
      display: block; margin-bottom: 4px;
    }
    .nav-home {
      font-size: 13px; color: #6b7280; text-decoration: none; display: block; margin-bottom: 16px;
    }
    .nav-home:hover { color: #2563eb; }
    .docs-nav h3 {
      font-size: 11px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.5px; color: #9ca3af; margin: 16px 0 6px;
    }
    .docs-nav ul { list-style: none; }
    .docs-nav li a {
      display: block; padding: 3px 8px; font-size: 13px; color: #374151;
      text-decoration: none; border-radius: 4px; transition: background 0.15s;
    }
    .docs-nav li a:hover { background: #e5e7eb; }
    .docs-nav li a.active { background: #2563eb; color: #fff; }

    .docs-content {
      flex: 1; max-width: 800px; padding: 40px 48px; margin: 0 auto;
    }
    .docs-content h1 { font-size: 28px; font-weight: 700; margin-bottom: 16px; line-height: 1.3; }
    .docs-content h2 { font-size: 22px; font-weight: 600; margin: 32px 0 12px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
    .docs-content h3 { font-size: 17px; font-weight: 600; margin: 24px 0 8px; }
    .docs-content h4 { font-size: 15px; font-weight: 600; margin: 20px 0 6px; }
    .docs-content p { margin: 0 0 12px; }
    .docs-content ul, .docs-content ol { margin: 0 0 12px; padding-left: 24px; }
    .docs-content li { margin: 2px 0; }
    .docs-content a { color: #2563eb; text-decoration: none; }
    .docs-content a:hover { text-decoration: underline; }
    .anchor { color: #d1d5db; text-decoration: none; margin-right: 4px; font-weight: 400; }
    .anchor:hover { color: #2563eb; }

    .docs-content code {
      font-family: "SF Mono", "Fira Code", Consolas, monospace;
      font-size: 0.88em; background: #f3f4f6; padding: 2px 5px; border-radius: 3px;
    }
    .docs-content pre {
      background: #1e1e2e; color: #cdd6f4; border-radius: 8px;
      padding: 16px 20px; margin: 0 0 16px; overflow-x: auto; line-height: 1.5;
    }
    .docs-content pre code {
      background: none; padding: 0; font-size: 13px; color: inherit;
    }
    .docs-content table {
      width: 100%; border-collapse: collapse; margin: 0 0 16px; font-size: 14px;
    }
    .docs-content th, .docs-content td {
      text-align: left; padding: 8px 12px; border: 1px solid #e5e7eb;
    }
    .docs-content th { background: #f9fafb; font-weight: 600; }
    .docs-content blockquote {
      border-left: 3px solid #2563eb; padding: 8px 16px; margin: 0 0 16px;
      background: #f0f7ff; color: #374151; font-size: 14px;
    }
    .docs-content hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .docs-content img { max-width: 100%; }

    @media (max-width: 768px) {
      body { flex-direction: column; }
      .docs-nav {
        width: 100%; min-width: auto; height: auto; position: static;
        border-right: none; border-bottom: 1px solid #e5e7eb;
      }
      .docs-content { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  ${nav}
  <main class="docs-content">
    ${content}
  </main>
</body>
</html>`;
}

function buildIndexPage() {
  const content = `
    <h1>Riss Documentation</h1>
    <p>Riss (Norwegian: <em>sketch, outline</em>) is a YAML-based wireframe description format designed for AI generation and human validation.</p>

    <h2 id="core-documentation"><a href="#core-documentation" class="anchor">#</a> Core Documentation</h2>
    <ul>
      <li><a href="/docs/${VERSION}/spec.html"><strong>Riss Specification</strong></a> &mdash; Complete format specification: document structure, layout system, styling, element reference, roles, annotations</li>
      <li><a href="/docs/${VERSION}/ai-guide.html"><strong>AI Generation Guide</strong></a> &mdash; Comprehensive guide for AI models generating <code>.riss.yaml</code> files, with patterns, rules, and examples</li>
      <li><a href="/docs/${VERSION}/blocks.html"><strong>RissBlocks Specification</strong></a> &mdash; Pre-built reusable block components and their parameters</li>
    </ul>

    <h2 id="block-reference"><a href="#block-reference" class="anchor">#</a> Block Reference</h2>
    <p>Detailed documentation for each category of pre-built blocks:</p>
    <ul>
      ${getBlockDocLinks().join('\n      ')}
    </ul>

    <h2 id="viewer"><a href="#viewer" class="anchor">#</a> Viewer</h2>
    <p>Use the <a href="/">Riss Wireframe Viewer</a> to open and preview <code>.riss.yaml</code> files in your browser.</p>

    <h2 id="for-ai-agents"><a href="#for-ai-agents" class="anchor">#</a> For AI Agents</h2>
    <p>If you are an AI agent generating Riss wireframes, start with the <a href="/docs/${VERSION}/ai-guide.html">AI Generation Guide</a>. It contains everything you need: file structure, element reference, block usage, validation rules, and complete examples.</p>
    <p>All documentation pages have stable anchor links and are served as plain HTML for easy fetching.</p>
  `;
  return htmlPage('Documentation', content, 'index');
}

function getBlockDocLinks() {
  if (!existsSync(BLOCK_DOCS_DIR)) return [];
  return readdirSync(BLOCK_DOCS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => {
      const slug = f.replace('.md', '');
      const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return `<li><a href="/docs/${VERSION}/blocks/${slug}.html">${title}</a></li>`;
    });
}

function convertMarkdown(mdPath) {
  const md = readFileSync(mdPath, 'utf-8');
  return marked.parse(md);
}

// --- Build ---
console.log('Building docs...');

// Ensure output dirs
mkdirSync(DOCS_OUT, { recursive: true });
mkdirSync(join(DOCS_OUT, 'blocks'), { recursive: true });

// Build index
writeFileSync(join(DOCS_OUT, 'index.html'), buildIndexPage());
console.log('  docs/index.html');

// Build main docs
for (const doc of MAIN_DOCS) {
  const srcPath = join(DOCS_SRC, doc.src);
  if (!existsSync(srcPath)) {
    console.warn(`  SKIP: ${doc.src} not found`);
    continue;
  }
  const html = convertMarkdown(srcPath);
  const page = htmlPage(doc.title, html, doc.slug);
  writeFileSync(join(DOCS_OUT, `${doc.slug}.html`), page);
  console.log(`  docs/${doc.slug}.html`);
}

// Build block docs
if (existsSync(BLOCK_DOCS_DIR)) {
  for (const file of readdirSync(BLOCK_DOCS_DIR).filter(f => f.endsWith('.md'))) {
    const slug = file.replace('.md', '');
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const srcPath = join(BLOCK_DOCS_DIR, file);
    const html = convertMarkdown(srcPath);
    const page = htmlPage(title, html, `blocks/${slug}`);
    writeFileSync(join(DOCS_OUT, 'blocks', `${slug}.html`), page);
    console.log(`  docs/blocks/${slug}.html`);
  }
}

console.log(`Done! Built docs into public/docs/${VERSION}/`);
