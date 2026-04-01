# Lists & Collections Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `card-grid`

A generic grid of cards — the universal "collection" block.

```yaml
- block: card-grid
  title: "Popular Categories"
  columns: 3
  items:
    - image-label: "Running"
      title: "Running"
      subtitle: "248 products"
    - image-label: "Hiking"
      title: "Hiking"
      subtitle: "186 products"
    - image-label: "Camping"
      title: "Camping"
      subtitle: "124 products"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `columns` | Number (1-4) | `3` | Grid columns. |
| `items` | **Array (required)** | — | Each: `{ image-label?, title, subtitle?, cta-label?, badge? }`. |
| `image-aspect` | String | `"16/9"` | Image aspect ratio. |
| `show-more` | String | — | "View all" link label. |

---

## `media-gallery`

A grid of image/video thumbnails.

```yaml
- block: media-gallery
  columns: 3
  items:
    - label: "Photo 1"
    - label: "Photo 2"
    - label: "Photo 3"
    - label: "Photo 4"
    - label: "Photo 5"
    - label: "Photo 6"
      badge: "+12"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `columns` | Number (2-5) | `3` | Grid columns. |
| `items` | **Array (required)** | — | Each: `{ label?, aspect?, badge? }`. |
| `aspect` | String | `"1/1"` | Default image aspect ratio. |
| `gap` | Spacing | `xs` | Gap between items. |

---

## `accordion`

Expandable/collapsible content sections (FAQ, details, settings groups).

```yaml
- block: accordion
  title: "Frequently Asked Questions"
  items:
    - question: "What is Riss?"
      answer: "Riss is a YAML-based wireframe description format designed for AI generation and human validation."
    - question: "Is Riss free?"
      answer: "Yes, Riss is open source and free to use."
    - question: "Can I create custom blocks?"
      answer: "Yes, custom blocks can be defined in the blocks section of your .riss.yaml file."
      expanded: true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `items` | **Array (required)** | — | Each: `{ question, answer, expanded? }`. |
| `variant` | `default`, `bordered`, `separated` | `default` | Visual style. |
| `single-expand` | Boolean | `true` | Only one item open at a time. |

---

## `ranked-list`

A numbered/ranked list (leaderboard, top items, etc.).

```yaml
- block: ranked-list
  title: "Top Contributors"
  items:
    - title: "Bear Qode"
      subtitle: "142 contributions"
      avatar: "BQ"
    - title: "Kari Nordmann"
      subtitle: "98 contributions"
      avatar: "KN"
    - title: "Ola Nordmann"
      subtitle: "67 contributions"
      avatar: "ON"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `items` | **Array (required)** | — | Each: `{ title, subtitle?, avatar?, value?, badge? }`. |
| `numbered` | Boolean | `true` | Show rank numbers. |
| `show-medals` | Boolean | `false` | Show gold/silver/bronze for top 3. |
