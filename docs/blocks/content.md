# Content Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `side-by-side`

Two-column layout: content on one side, media on the other.

```yaml
- block: side-by-side
  heading: "Built for speed"
  body: "Our engine processes 10x faster than alternatives."
  image-label: "Performance Dashboard Screenshot"
  image-position: right
  cta-label: "Learn More"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `heading` | **String (required)** | — | Section heading. |
| `body` | String | — | Body text. |
| `image-label` | String | `"Image"` | Placeholder label for the media side. |
| `image-position` | `left`, `right` | `right` | Which side the image is on. |
| `image-aspect` | String | `"4/3"` | Aspect ratio of the image placeholder. |
| `cta-label` | String | — | Optional CTA button. |
| `bullets` | String[] | — | Bullet points instead of (or in addition to) body text. |
| `split` | `"50/50"`, `"60/40"`, `"40/60"` | `"50/50"` | Column width ratio. |

---

## `alternating-rows`

Multiple side-by-side sections that alternate image position (zigzag layout).

```yaml
- block: alternating-rows
  items:
    - heading: "Easy to write"
      body: "YAML that any AI can generate correctly."
      image-label: "Code Editor"
    - heading: "Easy to read"
      body: "Non-technical stakeholders understand it at a glance."
      image-label: "Wireframe Preview"
    - heading: "Easy to render"
      body: "Deterministic output, every time."
      image-label: "Rendered Output"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | **Array (required)** | — | Each item: `{ heading, body?, image-label?, cta-label?, bullets? }`. |
| `start-position` | `left`, `right` | `right` | Image position for the first row (alternates after). |
| `gap` | Spacing | `2xl` | Vertical gap between rows. |

---

## `content-carousel`

A horizontally scrollable row of cards.

```yaml
- block: content-carousel
  title: "Recently Viewed"
  items:
    - image-label: "Product A"
      title: "Trail Runner Pro"
      subtitle: "kr 1,299"
    - image-label: "Product B"
      title: "Summit Jacket"
      subtitle: "kr 2,499"
    - image-label: "Product C"
      title: "Base Layer"
      subtitle: "kr 599"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading above the carousel. |
| `items` | **Array (required)** | — | Each item: `{ image-label?, title, subtitle?, cta-label? }`. |
| `card-width` | Number | `200` | Width of each card in pixels. |
| `show-more` | String | — | "View all" link label. |

---

## `blog-card-grid`

A grid of article/blog post cards.

```yaml
- block: blog-card-grid
  title: "Latest Posts"
  columns: 3
  items:
    - image-label: "Cover Image"
      category: "Engineering"
      title: "How we built Riss"
      excerpt: "A deep dive into our YAML-based wireframe format."
      author: "Bear"
      date: "Mar 15, 2026"
    - image-label: "Cover Image"
      category: "Design"
      title: "Wireframes vs Mockups"
      excerpt: "Why wireframes are still the best starting point."
      author: "Kari"
      date: "Mar 10, 2026"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `columns` | Number (1-4) | `3` | Number of columns. |
| `items` | **Array (required)** | — | Each: `{ image-label?, category?, title, excerpt?, author?, date?, read-time? }`. |
| `show-more` | String | — | "View all" link label. |

---

## `timeline`

A vertical timeline of events.

```yaml
- block: timeline
  items:
    - date: "March 2026"
      title: "v0.1 Released"
      description: "Core elements, layout system, and annotations."
    - date: "June 2026"
      title: "v0.2 — Templates"
      description: "Custom reusable component definitions."
    - date: "Q4 2026"
      title: "v1.0 — Stable"
      description: "Multi-file support and interactive prototypes."
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | **Array (required)** | — | Each: `{ date?, title, description?, icon? }`. |
| `variant` | `default`, `alternating`, `compact` | `default` | Layout style. |
| `color` | Color | `accent` | Line/dot color. |

---

## `rich-text`

A long-form content block with typographic hierarchy (article body, documentation, etc.).

```yaml
- block: rich-text
  content:
    - type: h2
      text: "Getting Started"
    - type: paragraph
      text: "Riss files use standard YAML syntax with a small set of well-defined elements."
    - type: paragraph
      text: "Each file describes one or more screens as a tree of layout and content nodes."
    - type: h3
      text: "Installation"
    - type: code
      text: "npm install @riss/renderer"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `content` | **Array (required)** | — | Each: `{ type, text }`. Types: `h2`, `h3`, `h4`, `paragraph`, `code`, `blockquote`, `list`. |
| `max-width` | Number | `720` | Max content width for readability. |

> **Note:** The `type` values in the `content` array (`h2`, `paragraph`, `code`, etc.) are rich-text content node types, not Riss element types. The renderer maps them to appropriate `text` elements internally (e.g., `type: h2` becomes a `text` element with `variant: h2`).
