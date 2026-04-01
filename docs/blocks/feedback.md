# Feedback & State Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `empty-state-block`

A composed empty state with illustration, message, and action.

> **Relation to core element:** This block expands to a layout built around the [`empty-state`](../RISS_SPEC.md#67-feedback-elements) element. Use the core `empty-state` element for a simple inline empty state; use this block for a full-section pattern with richer structure.

```yaml
- block: empty-state-block
  icon: inbox
  title: "No messages yet"
  message: "When you receive messages, they'll appear here."
  cta-label: "Compose"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `icon` | String | — | Icon name. |
| `title` | **String (required)** | — | Heading. |
| `message` | String | — | Body text. |
| `cta-label` | String | — | Action button label. |
| `image-label` | String | — | Illustration placeholder instead of icon. |

---

## `error-page`

A full-page error state (404, 500, maintenance, etc.).

```yaml
- block: error-page
  code: "404"
  title: "Page not found"
  message: "The page you're looking for doesn't exist or has been moved."
  cta-label: "Go Home"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `code` | String | — | Error code (e.g., "404", "500"). |
| `title` | **String (required)** | — | Error heading. |
| `message` | String | — | Error description. |
| `cta-label` | String | `"Go Home"` | Primary button label. |
| `icon` | String | `warning` | Icon or illustration. |

---

## `loading-skeleton`

A configurable skeleton loading pattern composed of multiple skeleton shapes.

> **Relation to core element:** This block expands to a layout of multiple [`skeleton`](../RISS_SPEC.md#67-feedback-elements) elements. The core `skeleton` element represents a single shimmer shape (`text`, `rect`, `circle`, etc.); this block composes them into full-section loading patterns (`card-grid`, `list`, `form`, etc.).

```yaml
- block: loading-skeleton
  variant: card-grid
  count: 6
  columns: 3
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `card-grid`, `list`, `detail`, `form`, `feed` | `list` | Skeleton pattern shape. |
| `count` | Number | `3` | Number of skeleton items. |
| `columns` | Number | `1` | Columns (for grid variant). |

---

## `confirmation`

A success/confirmation state after an action.

```yaml
- block: confirmation
  icon: check
  icon-color: success
  title: "Order Confirmed!"
  message: "Your order #12345 has been placed. You'll receive a confirmation email shortly."
  details:
    - label: "Order Number"
      value: "#12345"
    - label: "Estimated Delivery"
      value: "April 5-7, 2026"
  cta-label: "Continue Shopping"
  cta-secondary-label: "View Order"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `icon` | String | `check` | Icon name. |
| `icon-color` | Color | `success` | Icon color. |
| `title` | **String (required)** | — | Confirmation heading. |
| `message` | String | — | Body text. |
| `details` | Array | — | Key-value details: `{ label, value }`. |
| `cta-label` | String | — | Primary button. |
| `cta-secondary-label` | String | — | Secondary button. |
