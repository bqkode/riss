# Social Proof Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `logo-bar`

A row of partner/client/press logos.

```yaml
- block: logo-bar
  title: "Trusted by leading teams"
  logos: 5
  labels: ["Acme", "Globex", "Initech", "Umbrella", "Stark"]
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Label above logos (e.g., "As seen in", "Trusted by"). |
| `logos` | Number | `5` | Number of logo placeholders. |
| `labels` | String[] | — | Optional labels for each logo placeholder. |
| `variant` | `inline`, `scrolling` | `inline` | Display mode. |

---

## `testimonial-card`

A single testimonial quote.

```yaml
- block: testimonial-card
  quote: "Riss saved us weeks of back-and-forth on wireframes."
  author: "Ola Nordmann"
  role: "Product Lead"
  company: "Acme Corp"
  rating: 5
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `quote` | **String (required)** | — | Testimonial text. |
| `author` | String | — | Author name. |
| `role` | String | — | Author's role/title. |
| `company` | String | — | Company name. |
| `avatar` | String | — | Avatar initials. |
| `rating` | Number (1-5) | — | Star rating. |

---

## `testimonial-grid`

Multiple testimonials in a grid.

```yaml
- block: testimonial-grid
  title: "What people are saying"
  columns: 3
  items:
    - quote: "Finally, a wireframe format AI gets right."
      author: "Kari Nordmann"
      role: "CTO, Globex"
    - quote: "We validated our entire app concept in one afternoon."
      author: "Per Hansen"
      role: "Designer, Initech"
    - quote: "Simple, clean, exactly what we needed."
      author: "Lisa Berg"
      role: "PM, Umbrella"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `columns` | Number (1-3) | `3` | Grid columns. |
| `items` | **Array (required)** | — | Each: same params as `testimonial-card`. |

---

## `stats-row`

A row of large stat numbers with labels.

```yaml
- block: stats-row
  items:
    - value: "10K+"
      label: "Users"
    - value: "50M"
      label: "Wireframes rendered"
    - value: "99.9%"
      label: "Uptime"
    - value: "4.8"
      label: "App Store rating"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | **Array (required)** | — | Each: `{ value, label, icon?, trend? }`. |
| `variant` | `inline`, `card` | `inline` | Display style. |
| `background` | Color | `background` | Section background. |

---

## `rating-block`

An aggregate rating display with star visualization.

```yaml
- block: rating-block
  rating: 4.8
  total-reviews: 2847
  breakdown:
    5: 72
    4: 18
    3: 6
    2: 3
    1: 1
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `rating` | **Number (required)** | — | Average rating (1-5). |
| `total-reviews` | Number | — | Total review count. |
| `breakdown` | Object | — | Percentage per star: `{ 5: %, 4: %, ... }`. |
| `variant` | `compact`, `detailed` | `compact` | Show breakdown bars or just stars + number. |
