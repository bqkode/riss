# Riss

**Riss** (Norwegian: *sketch, outline*) is a YAML-based wireframe description format with a browser-based renderer. Write `.riss.yaml` files to describe application screens, and Riss renders them as clean, grayscale wireframes on an HTML canvas.

## Why Riss?

- **Text-first wireframing** — describe screens in YAML instead of dragging boxes around
- **AI-friendly** — structured format that LLMs can generate and validate
- **Deterministic** — same file always produces the same visual output
- **Composable** — 40+ primitive elements and 57 pre-built blocks (hero sections, pricing tables, footers, etc.)

## Quick example

```yaml
riss: "0.1"
meta:
  name: "My App"
  viewport: { width: 390, height: 844 }
  theme:
    mode: light
    accent: "#2563EB"

screens:
  - id: home
    title: "Home"
    children:
      - type: stack
        gap: md
        padding: lg
        children:
          - type: text
            variant: h1
            content: "Welcome"
          - type: text
            variant: body
            content: "This is a wireframe described in YAML."
          - type: button
            label: "Get Started"
            style: primary
```

## Getting started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open the viewer in your browser, then drag and drop any `.riss.yaml` file onto the canvas — or use the file picker to open one. The `tests/` directory has 166 example fixtures to try.

## How it works

```
.riss.yaml → YAML parse → block expansion → layout computation → Canvas 2D rendering
```

1. **Parse** — `js-yaml` parses YAML into a typed document model
2. **Block expansion** — shorthand like `block: hero` expands into full element trees
3. **Layout** — computes position and size for every element
4. **Render** — draws to a `<canvas>` element with pan/zoom support

### Elements vs Blocks

**Elements** are primitives — text, button, image, card, stack, row, grid, input, toggle, and more (40+ types). They're the building blocks.

**Blocks** are higher-level patterns — hero sections, navigation bars, pricing tables, footers, and more (57 pre-built). Each block expands into a tree of elements, so you get complex layouts from a single declaration:

```yaml
# Instead of manually composing dozens of elements:
- block: hero
  params:
    title: "Ship faster"
    subtitle: "Wireframe in YAML"
    cta: "Try it now"
```

## Project structure

```
src/
  engine/
    elements/     # Element renderers (40+ types)
    blocks/       # Block system and 57 block definitions
    layout.ts     # Layout computation
    renderer.ts   # Render orchestration
    canvas.ts     # Canvas 2D abstraction
    chrome/       # Screen decorations (status bar, headers)
    theme/        # Colors, typography, spacing tokens
  types/          # TypeScript interfaces
  main.ts         # Browser viewer app
docs/             # Format specification (source of truth)
tests/            # 166 .riss.yaml visual test fixtures
```

## Documentation

The full format specification lives in `docs/`:

- **RISS_SPEC.md** — core format, layout system, element reference
- **RISSBLOCKS_SPEC.md** — block system and all 57 block definitions
- **AI_GENERATION_GUIDE.md** — combined reference for AI-assisted generation

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run build:docs` | Rebuild HTML docs from markdown sources |
| `npm run preview` | Preview production build |
