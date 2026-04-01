# Call to Action Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `cta-banner`

A full-width call-to-action section.

```yaml
- block: cta-banner
  heading: "Ready to get started?"
  subheading: "Join thousands of teams already using Riss."
  cta-label: "Start Free"
  cta-secondary-label: "Book a Demo"
  background: accent-soft
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `heading` | **String (required)** | — | CTA heading. |
| `subheading` | String | — | Supporting text. |
| `cta-label` | String | — | Primary button label. |
| `cta-secondary-label` | String | — | Secondary button label. |
| `background` | Color | `surface` | Section background. |
| `align` | `left`, `center` | `center` | Text alignment. |

---

## `cta-inline`

A compact inline CTA card embedded between content sections.

```yaml
- block: cta-inline
  heading: "Want to learn more?"
  cta-label: "Read the docs"
  icon: file
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `heading` | **String (required)** | — | CTA text. |
| `cta-label` | String | — | Button label. |
| `icon` | String | — | Icon beside the text. |
| `variant` | `card`, `banner` | `card` | Visual style. |

---

## `cta-with-input`

A CTA section with an email/text input (newsletter signup, waitlist, etc.).

```yaml
- block: cta-with-input
  heading: "Stay in the loop"
  subheading: "Get notified when we launch new features."
  placeholder: "you@example.com"
  cta-label: "Subscribe"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `heading` | **String (required)** | — | CTA heading. |
| `subheading` | String | — | Supporting text. |
| `placeholder` | String | `"Enter your email"` | Input placeholder. |
| `cta-label` | String | `"Submit"` | Button label. |
| `background` | Color | `surface` | Section background. |
