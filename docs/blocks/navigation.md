# Navigation Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `sidebar-nav`

A vertical sidebar navigation panel. Typically used inside a `row` alongside main content.

```yaml
- block: sidebar-nav
  logo: "AppName"
  items:
    - icon: home
      label: "Dashboard"
      active: true
    - icon: users
      label: "Users"
    - icon: file
      label: "Reports"
    - icon: settings
      label: "Settings"
  footer:
    avatar: "BQ"
    name: "Bear"
    subtitle: "Admin"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `logo` | String | — | App name or logo label. |
| `logo-icon` | String | — | Icon beside the logo. |
| `items` | **Array (required)** | — | Nav items: `{ icon, label, active?, badge? }`. |
| `groups` | Array | — | Grouped items: `{ title, items[] }`. Alternative to flat `items`. |
| `footer` | Object | — | Bottom section: `{ avatar?, name?, subtitle? }`. |
| `width` | Number | `260` | Sidebar width in pixels. |
| `collapsible` | Boolean | `false` | Can collapse to icon-only mode. |
| `background` | Color | `surface` | Background color. |

---

## `top-nav`

A horizontal top navigation bar for marketing pages and desktop layouts.

> **Relation to core element:** For a simpler mobile-style app bar with leading/trailing icons, see the [`navbar`](../RISS_SPEC.md#65-navigation-elements) element. Use `top-nav` for marketing sites and desktop apps with logo, nav links, and CTA buttons.

```yaml
- block: top-nav
  logo: "Riss"
  items:
    - label: "Product"
    - label: "Docs"
    - label: "Pricing"
  cta-label: "Sign Up"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `logo` | String | — | App name / logo label. |
| `logo-icon` | String | — | Icon beside the logo. |
| `items` | Array | `[]` | Nav links: `{ label, active? }`. |
| `cta-label` | String | — | Right-side CTA button label. |
| `cta-secondary-label` | String | — | Ghost/outline button before primary CTA. |
| `search` | Boolean | `false` | Show search input. |
| `avatar` | String | — | User avatar initials (shows user menu area). |
| `sticky` | Boolean | `false` | Note: sticky rendering (annotation only in v0.1). |

---

## `breadcrumb-header`

Breadcrumb navigation + page title combined.

```yaml
- block: breadcrumb-header
  breadcrumb: ["Home", "Products", "Running Shoes"]
  title: "Running Shoes"
  description: "High-performance footwear for every terrain."
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `breadcrumb` | **String[] (required)** | — | Path items. Last item = current page. |
| `title` | String | — | Page heading (defaults to last breadcrumb item). |
| `description` | String | — | Subtitle text. |

---

## `bottom-nav`

A bottom tab-style navigation bar for mobile apps.

> **Relation to core element:** This block is a parameterized version of the [`tabbar`](../RISS_SPEC.md#65-navigation-elements) element. Use the core `tabbar` element when you need full control over the bar; use this block for quick mobile navigation with sensible defaults.

```yaml
- block: bottom-nav
  items:
    - icon: home
      label: "Home"
      active: true
    - icon: search
      label: "Explore"
    - icon: plus
      label: "Create"
    - icon: bell
      label: "Notifications"
      badge: "3"
    - icon: user
      label: "Profile"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | **Array (required)** | — | Tab items: `{ icon, label, active?, badge? }`. |
| `variant` | `icon-label`, `icon-only`, `label-only` | `icon-label` | Display mode for tab items. |
| `background` | Color | `background` | Bar background color. |
| `active-color` | Color | `accent` | Color for the active tab icon and label. |
