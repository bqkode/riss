# RissBlocks Specification v0.1

> **RissBlocks** are pre-built, composable wireframe patterns that ship with Riss. Each block is a template composed of Riss primitives (elements from the core spec) that represents a commonly used UI section. Screens contain RissBlocks as children, and the renderer expands them into their underlying element trees.

---

## Table of Contents

1. [Concept](#1-concept)
2. [Block Structure](#2-block-structure)
3. [Core Blocks Reference](#3-core-blocks-reference)
4. [Blocks vs. Elements Disambiguation](#4-blocks-vs-elements-disambiguation)
5. [Common Block Parameters](#5-common-block-parameters)
6. [Versioning](#6-versioning)
7. [Custom Blocks](blocks/custom-blocks.md)
8. [AI Generation Guidelines](blocks/ai-guidelines.md)

---

## 1. Concept

### What is a RissBlock?

A RissBlock is a **reusable, parameterized wireframe section**. It sits between raw Riss elements (primitives) and full screens in the abstraction hierarchy:

```
Screen
  └─ RissBlock (e.g., hero, pricing-table, feature-grid)
       └─ Riss Elements (stack, row, text, button, card, ...)
```

### Why RissBlocks?

1. **Faster AI generation** — Instead of generating 40+ lines of nested primitives for a hero section, the AI writes `block: hero` with a few parameters. Less room for structural errors.
2. **Consistent patterns** — Blocks encode best-practice layout and spacing. A `testimonial-carousel` always looks right.
3. **Human readability** — A stakeholder can scan a screen and see `hero`, `feature-grid`, `pricing-table`, `footer` — instantly understanding the page structure.
4. **Customizable** — Every block parameter has a sensible default. Override only what you need.

### Core vs. Custom

- **Core blocks** ship with Riss. They cover the most common UI patterns across web and mobile. Renderers MUST support all core blocks.
- **Custom blocks** can be defined by AI or users within a `.riss.yaml` file using the `blocks` top-level field (see [Custom Blocks](blocks/custom-blocks.md)). Renderers expand them using the block definition.

---

## 2. Block Structure

### Using a block in a screen

```yaml
screens:
  - id: landing
    title: "Landing Page"
    children:
      - block: hero
        heading: "Ship faster with Riss"
        subheading: "AI-generated wireframes your team can actually validate."
        cta-label: "Get Started"
        cta-secondary-label: "See Demo"
        image: true

      - block: logo-bar
        title: "Trusted by"
        logos: 6

      - block: feature-grid
        columns: 3
        items:
          - icon: edit
            title: "AI-First"
            description: "Generated correctly by language models, every time."
          - icon: eye
            title: "Visually Honest"
            description: "Wireframes set correct expectations."
          - icon: refresh
            title: "Deterministic"
            description: "Same file, same output. Always."

      - block: footer
        variant: multi-column
```

### Block syntax

| Field | Required | Description |
|-------|----------|-------------|
| `block` | **Yes** | Block type identifier. Must match a core block name or a custom block defined in the file's `blocks` section. |
| `id` | No | Optional unique identifier for this block instance. |
| `role` | No | Role id or array of role ids. Restricts this block to the specified role(s). Renders a colored outline and badge. See [Roles](../RISS_SPEC.md#7-roles). |
| `annotation` | No | Annotation text (same as element annotations). |
| `next` | No | Navigation target(s) — screen id(s) this block navigates to. Creates flow arrows between screens. |
| All other fields | Varies | Block-specific parameters. Each block defines its own parameters with defaults. |

### How blocks render

The renderer expands each block into its underlying Riss element tree, applying the provided parameters. The expanded tree is then rendered identically to hand-written elements. Blocks are a **convenience layer**, not a new rendering primitive.

**Scrolling behavior:** Blocks are placed sequentially in the screen's `children` list. If the combined height of all blocks exceeds the viewport, the screen scrolls vertically. Blocks do not create their own scroll containers — the screen itself is the scroll boundary.

**Responsive behavior:** RissBlocks v0.1 does not define a formal breakpoint system. Each block renders for the viewport size specified in `meta.viewport`. Blocks with a `columns` parameter should gracefully reduce columns on narrow viewports (e.g., a 3-column grid on a 390px viewport may render as a single column). Formal responsive breakpoints are planned for a future version.

### Parameter types

Block parameter tables reference the following types from the core [Riss Specification](RISS_SPEC.md):

| Type | Definition | Reference |
|------|-----------|-----------|
| **Color** | A semantic color token (`accent`, `surface`, `text-secondary`, etc.) or a hex string (`#RRGGBB`). | [RISS_SPEC.md § 5 — Styling System](RISS_SPEC.md#5-styling-system) |
| **Spacing** | A spacing token (`none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`) or a pixel number. | [RISS_SPEC.md § 4 — Layout System](RISS_SPEC.md#4-layout-system) |
| **Icon name** | A string from the standard icon set. Unrecognized names render as a labeled square. | [RISS_SPEC.md § 6.3 — `icon` element](RISS_SPEC.md#63-content-elements) |

---

## 3. Core Blocks Reference

### Category Overview

| Category | Blocks | Spec |
|----------|--------|------|
| **Hero & Header** | `hero`, `page-header`, `announcement-bar` | [hero-header.md](blocks/hero-header.md) |
| **Navigation** | `sidebar-nav`, `top-nav`, `breadcrumb-header`, `bottom-nav` | [navigation.md](blocks/navigation.md) |
| **Content** | `side-by-side`, `alternating-rows`, `content-carousel`, `blog-card-grid`, `timeline`, `rich-text` | [content.md](blocks/content.md) |
| **Features & Benefits** | `feature-grid`, `feature-list`, `checklist`, `how-it-works` | [features.md](blocks/features.md) |
| **Social Proof** | `logo-bar`, `testimonial-card`, `testimonial-grid`, `stats-row`, `rating-block` | [social-proof.md](blocks/social-proof.md) |
| **Pricing** | `pricing-table`, `pricing-card` | [pricing.md](blocks/pricing.md) |
| **Call to Action** | `cta-banner`, `cta-inline`, `cta-with-input` | [cta.md](blocks/cta.md) |
| **Forms** | `login-form`, `signup-form`, `contact-form`, `search-with-filters`, `multi-step-form`, `settings-form` | [forms.md](blocks/forms.md) |
| **Data & Dashboard** | `stat-cards-row`, `data-table`, `activity-feed`, `chart-card`, `kanban-board` | [dashboard.md](blocks/dashboard.md) |
| **E-Commerce** | `product-card-grid`, `product-detail`, `cart-summary`, `checkout-steps` | [ecommerce.md](blocks/ecommerce.md) |
| **User & Profile** | `profile-header`, `team-grid`, `avatar-list` | [user-profile.md](blocks/user-profile.md) |
| **Lists & Collections** | `card-grid`, `media-gallery`, `accordion`, `ranked-list` | [collections.md](blocks/collections.md) |
| **Feedback & State** | `empty-state-block`, `error-page`, `loading-skeleton`, `confirmation` | [feedback.md](blocks/feedback.md) |
| **Communication** | `chat-thread`, `comment-thread`, `notification-list` | [communication.md](blocks/communication.md) |
| **Footer** | `footer` | [footer.md](blocks/footer.md) |

---

## Quick Reference — All 57 Core Blocks

| Block | Category | Description |
|-------|----------|-------------|
| `hero` | Hero & Header | Above-the-fold section with heading, CTA, optional image |
| `page-header` | Hero & Header | Inner page header with breadcrumb and actions |
| `announcement-bar` | Hero & Header | Thin dismissible banner |
| `sidebar-nav` | Navigation | Vertical sidebar navigation |
| `top-nav` | Navigation | Horizontal top navigation bar |
| `breadcrumb-header` | Navigation | Breadcrumb + page title |
| `bottom-nav` | Navigation | Bottom tab navigation bar (mobile) |
| `side-by-side` | Content | Two-column: text + image |
| `alternating-rows` | Content | Zigzag text/image rows |
| `content-carousel` | Content | Horizontal scrollable cards |
| `blog-card-grid` | Content | Article card grid |
| `timeline` | Content | Vertical timeline |
| `rich-text` | Content | Long-form content block |
| `feature-grid` | Features | Icon + title + description grid |
| `feature-list` | Features | Vertical feature list |
| `checklist` | Features | Checkmark item list |
| `how-it-works` | Features | Numbered process steps |
| `logo-bar` | Social Proof | Partner/client logo row |
| `testimonial-card` | Social Proof | Single testimonial |
| `testimonial-grid` | Social Proof | Multiple testimonials grid |
| `stats-row` | Social Proof | Large stat numbers row |
| `rating-block` | Social Proof | Aggregate rating display |
| `pricing-table` | Pricing | Multi-tier pricing |
| `pricing-card` | Pricing | Single pricing plan |
| `cta-banner` | CTA | Full-width call to action |
| `cta-inline` | CTA | Compact inline CTA card |
| `cta-with-input` | CTA | CTA with email input |
| `login-form` | Forms | Standard login |
| `signup-form` | Forms | Registration form |
| `contact-form` | Forms | Contact/inquiry form |
| `search-with-filters` | Forms | Search + filter controls |
| `multi-step-form` | Forms | Form wizard with steps |
| `settings-form` | Forms | Grouped settings |
| `stat-cards-row` | Dashboard | Metric/KPI cards |
| `data-table` | Dashboard | Filterable data table |
| `activity-feed` | Dashboard | Timestamped event list |
| `chart-card` | Dashboard | Chart placeholder card |
| `kanban-board` | Dashboard | Columnar card board |
| `product-card-grid` | E-Commerce | Product cards grid |
| `product-detail` | E-Commerce | Full product info section |
| `cart-summary` | E-Commerce | Cart + order total |
| `checkout-steps` | E-Commerce | Checkout step indicator |
| `profile-header` | User & Profile | User profile header |
| `team-grid` | User & Profile | Team member cards |
| `avatar-list` | User & Profile | Compact user list |
| `card-grid` | Collections | Generic card grid |
| `media-gallery` | Collections | Image/video grid |
| `accordion` | Collections | Expandable Q&A / sections |
| `ranked-list` | Collections | Numbered ranked list |
| `empty-state-block` | Feedback | Empty state with CTA |
| `error-page` | Feedback | Full-page error state |
| `loading-skeleton` | Feedback | Skeleton loading pattern |
| `confirmation` | Feedback | Success/confirmation state |
| `chat-thread` | Communication | Chat messages + input |
| `comment-thread` | Communication | Comment section with replies |
| `notification-list` | Communication | Notification feed |
| `footer` | Footer | Page footer |

---

## 4. Blocks vs. Elements Disambiguation

Several core blocks have names similar to core Riss elements. They serve different purposes:

| Core Element | RissBlock | When to use the element | When to use the block |
|-------------|-----------|------------------------|----------------------|
| `navbar` | `top-nav` | Mobile app bars with leading/trailing icons and a center title. | Marketing pages and desktop apps with logo, nav links, and CTA buttons. |
| `tabbar` | `bottom-nav` | When you need full control over the bottom bar within a hand-built screen. | Quick mobile bottom navigation with sensible defaults and variants. |
| `table` | `data-table` | Simple static tables without controls. | Tables with search, filters, pagination, and bulk actions. |
| `skeleton` | `loading-skeleton` | A single shimmer shape (text line, circle, rectangle). | A full-section loading pattern composed of multiple skeleton shapes. |
| `empty-state` | `empty-state-block` | A simple inline empty state with icon, title, and action. | A full-section empty state with richer structure, illustration, and CTA. |

Additionally, two blocks share similar step-indicator UIs but serve different purposes:

| Block | Purpose |
|-------|---------|
| `checkout-steps` | A read-only step indicator for e-commerce checkout flows. No form fields. |
| `multi-step-form` | A full form wizard with fields per step, forward/back navigation buttons. |

---

## 5. Common Block Parameters

These parameter names recur across many blocks with consistent meaning:

| Parameter | Type | Description |
|-----------|------|-------------|
| `title` | String | Section heading rendered above the block content. |
| `subtitle` | String | Secondary text below the title. |
| `items` | Array | The primary data array for the block (cards, features, list entries, etc.). |
| `columns` | Number | Number of grid columns for layout. |
| `cta-label` | String | Primary call-to-action button label. |
| `cta-secondary-label` | String | Secondary/outline button label. |
| `variant` | String (enum) | Visual or layout variation of the block. |
| `icon` | String | Icon name from the [standard icon set](RISS_SPEC.md#63-content-elements). |
| `image-label` | String | Text label rendered centered on an image placeholder rectangle. |
| `show-more` | String | "View all" link label shown below the block content. |
| `background` | Color | Section background color. Accepts [color tokens](RISS_SPEC.md#5-styling-system). |
| `next` | String \| String[] | Navigation target(s) — screen id(s) this block navigates to. Creates flow arrows between screens. |

---

## 6. Versioning

RissBlocks follows the same version numbering as the core Riss specification. All blocks in this document are part of **v0.1**.

- **v0.1** (this document) — 57 core blocks across 15 categories. Custom block definitions with parameter interpolation.
- Future versions may add new core blocks. Renderers should gracefully ignore unrecognized block types (render a labeled placeholder rather than failing).
- Core block names are reserved across all versions. Custom blocks must not reuse core block names.

---

*RissBlocks — compose screens from proven patterns.*
