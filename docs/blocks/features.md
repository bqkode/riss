# Features & Benefits Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `feature-grid`

A grid of feature cards with icon, title, and description.

```yaml
- block: feature-grid
  title: "Why choose Riss?"
  columns: 3
  items:
    - icon: edit
      title: "AI-First"
      description: "Trivial for language models to generate correctly."
    - icon: eye
      title: "Visually Honest"
      description: "Wireframes set correct expectations."
    - icon: check
      title: "Deterministic"
      description: "Same file, same output. Always."
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `subtitle` | String | — | Section subtitle. |
| `columns` | Number (2-4) | `3` | Grid columns. |
| `items` | **Array (required)** | — | Each: `{ icon?, title, description }`. |
| `variant` | `icon-top`, `icon-left`, `card` | `icon-top` | Layout of each feature item. |
| `align` | `left`, `center` | `center` for icon-top, `left` for icon-left | Text alignment. |

---

## `feature-list`

A vertical list of features with icons and descriptions.

```yaml
- block: feature-list
  items:
    - icon: check
      title: "Unlimited projects"
      description: "Create as many wireframes as you need."
    - icon: check
      title: "Real-time preview"
      description: "See changes as you type."
    - icon: check
      title: "Export to PNG/PDF"
      description: "Share wireframes with anyone."
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | **Array (required)** | — | Each: `{ icon?, title, description? }`. |
| `icon-color` | Color | `accent` | Default icon color. |
| `dividers` | Boolean | `false` | Show dividers between items. |

---

## `checklist`

A list of checkmark items — commonly used for feature comparison or plan inclusions.

```yaml
- block: checklist
  title: "Everything you need"
  columns: 2
  items:
    - "Unlimited wireframes"
    - "Team collaboration"
    - "Export to PNG & PDF"
    - "Dark mode support"
    - "Version history"
    - "Custom blocks"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `items` | **String[] (required)** | — | Checklist item labels. |
| `columns` | Number (1-3) | `1` | Number of columns. |
| `icon` | String | `check` | Icon for each item. |
| `icon-color` | Color | `success` | Icon color. |

---

## `how-it-works`

Numbered steps explaining a process.

```yaml
- block: how-it-works
  title: "How it works"
  items:
    - title: "Describe"
      description: "Tell the AI what you want to build."
      icon: edit
    - title: "Generate"
      description: "AI produces a .riss.yaml wireframe file."
      icon: refresh
    - title: "Validate"
      description: "Review the visual wireframe with your team."
      icon: check
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `items` | **Array (required)** | — | Each: `{ title, description, icon? }`. |
| `variant` | `horizontal`, `vertical` | `horizontal` | Step layout direction. |
| `numbered` | Boolean | `true` | Show step numbers. |
| `connector` | Boolean | `true` | Show connecting line/arrow between steps. |

> **Responsive note:** On narrow viewports (mobile), the `horizontal` variant should gracefully degrade to a vertical stack. Renderers should treat `horizontal` as a preference, not a guarantee.
