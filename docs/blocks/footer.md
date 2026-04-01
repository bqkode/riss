# Footer Block

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `footer`

Page footer with configurable layout.

```yaml
- block: footer
  variant: multi-column
  logo: "Riss"
  tagline: "Every great product starts as a sketch."
  columns:
    - title: "Product"
      links: ["Features", "Pricing", "Changelog", "Roadmap"]
    - title: "Company"
      links: ["About", "Blog", "Careers", "Contact"]
    - title: "Resources"
      links: ["Documentation", "API Reference", "Community", "Support"]
    - title: "Legal"
      links: ["Privacy", "Terms", "License"]
  social: ["twitter", "github", "linkedin"]
  copyright: "© 2026 Riss. All rights reserved."
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `simple`, `multi-column`, `compact` | `simple` | Footer layout. |
| `logo` | String | — | App name / logo label. |
| `tagline` | String | — | Short tagline below logo. |
| `columns` | Array | — | Link columns: `{ title, links[] }`. For `multi-column` variant. |
| `links` | String[] | — | Flat list of links. For `simple` variant. |
| `social` | String[] | — | Social icon names (rendered as icon placeholders). |
| `copyright` | String | — | Copyright line. |
| `newsletter` | Boolean | `false` | Show newsletter signup input. |

Variant behavior:
- `simple` — Single row: copyright + links + social icons.
- `multi-column` — Logo/tagline column + multiple link columns + social + copyright.
- `compact` — Two rows: links row + copyright/social row.
