# Hero & Header Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `hero`

The primary above-the-fold section. Supports multiple layout variants.

```yaml
- block: hero
  variant: centered
  heading: "Build something great"
  subheading: "A short value proposition that explains the product."
  cta-label: "Get Started"
  cta-secondary-label: "Learn More"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `centered`, `split`, `split-reverse`, `with-search`, `with-input` | `centered` | Layout variant. |
| `heading` | **String (required)** | — | Primary heading. |
| `subheading` | String | — | Supporting text below the heading. |
| `cta-label` | String | — | Primary CTA button label. |
| `cta-secondary-label` | String | — | Secondary CTA button label. |
| `image` | Boolean or String | `false` | Show image placeholder. String sets the label. |
| `image-position` | `right`, `left`, `bottom`, `background` | `right` | Image placement (for `split` variants, auto-inferred). |
| `background` | Color | `background` | Section background. |
| `align` | `left`, `center` | Depends on variant | Text alignment. |
| `badge` | String | — | Small badge/label above the heading (e.g., "New", "Beta"). |

Variant behavior:
- `centered` — Full-width, text centered, optional image below text.
- `split` — Text left, image right (50/50).
- `split-reverse` — Image left, text right.
- `with-search` — Centered text + prominent search input instead of CTA buttons.
- `with-input` — Centered text + email input + submit button (newsletter/waitlist).

---

## `page-header`

A simpler header for inner pages. Heading + optional breadcrumb, description, and actions.

```yaml
- block: page-header
  title: "Team Settings"
  description: "Manage your team members and their permissions."
  breadcrumb: ["Home", "Settings", "Team"]
  actions:
    - label: "Invite Member"
      icon: plus
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | **String (required)** | — | Page heading. |
| `description` | String | — | Subtitle / description text. |
| `breadcrumb` | String[] | — | Breadcrumb path items. |
| `actions` | Array of `{ label, icon?, variant? }` | — | Action buttons aligned right. |
| `tabs` | Array of `{ label, active? }` | — | Tab strip below the header. |
| `divider` | Boolean | `true` | Bottom divider line. |

---

## `announcement-bar`

A thin, dismissible banner at the top of the screen.

```yaml
- block: announcement-bar
  message: "🎉 v2.0 is here — see what's new"
  action: "Read changelog"
  color: accent
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `message` | **String (required)** | — | Banner text. |
| `action` | String | — | Link/button label. |
| `color` | Color | `accent-soft` | Background color. |
| `dismissable` | Boolean | `true` | Show close button. |
