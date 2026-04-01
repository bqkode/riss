# Riss AI Generation Guide v0.1

> A complete reference for AI language models generating `.riss.yaml` wireframe files. This guide covers the full format specification, structural rules, and best practices needed to produce valid, high-quality wireframes.

> **Documentation Policy:** The markdown files in `docs/` are the source of truth. Running `npm run build:docs` generates versioned HTML in `public/docs/<version>/` for AI agents. When updating docs, edit the markdown sources in `docs/` and rebuild.

---

## Table of Contents

1. [Overview](#1-overview)
2. [File Structure](#2-file-structure)
3. [Meta Configuration](#3-meta-configuration)
4. [Screens](#4-screens)
5. [Screen Navigation & Flows](#5-screen-navigation--flows)
6. [User Roles](#6-user-roles)
7. [Layout System](#7-layout-system)
8. [Styling System](#8-styling-system)
9. [Element Reference](#9-element-reference)
10. [RissBlocks (Pre-built Patterns)](#10-rissblocks-pre-built-patterns)
11. [Custom Blocks](#11-custom-blocks)
12. [Annotations](#12-annotations)
13. [Generation Rules & Best Practices](#13-generation-rules--best-practices)
14. [Validation Checklist](#14-validation-checklist)
15. [Complete Examples](#15-complete-examples)

---

## 1. Overview

**Riss** (Norwegian: *sketch, outline*) is a YAML-based wireframe description format. A `.riss.yaml` file describes one or more application screens as a tree of layout and content elements. The renderer produces clean wireframe visualizations — not finished UI.

### What you are generating

- Static wireframes, not interactive prototypes
- Grayscale layouts with an optional accent color
- Visual communication tools for human stakeholders to validate before development begins

### Key principles

1. **Predictable structure** — Minimal ambiguity, small set of well-defined elements
2. **Visually honest** — Wireframe style sets correct expectations
3. **Deterministic** — Same file always produces the same visual output
4. **Composable** — Few element types with composable properties, plus 57 pre-built blocks

---

## 2. File Structure

### File requirements

- **Extension:** `.riss.yaml`
- **Encoding:** UTF-8
- **YAML version:** 1.2 (2-space indentation)
- **Scope:** One project/app per file, may contain multiple screens

### Top-level document structure

Every `.riss.yaml` file MUST have this shape:

```yaml
riss: "0.1"                   # Required — spec version, always "0.1"

meta:                          # Required — project metadata
  name: "Project Name"        # Required — project/app name
  description: "..."          # Optional
  viewport:                    # Optional (defaults to 390x844)
    width: 390
    height: 844
  theme:                       # Optional
    mode: light                # light | dark (default: light)
    accent: "#2563EB"          # Hex color (default: #2563EB)
  roles: []                    # Optional — user role definitions

blocks: []                     # Optional — custom block definitions

screens:                       # Required — at least one screen
  - id: screen_id
    title: "Screen Title"
    children: [...]
```

### Top-level fields

| Field | Required | Description |
|-------|----------|-------------|
| `riss` | **Yes** | Must be `"0.1"` |
| `meta` | **Yes** | Project metadata and defaults |
| `blocks` | No | Custom block definitions |
| `screens` | **Yes** | Screen definitions (min 1) |

---

## 3. Meta Configuration

### `meta` object

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `name` | **Yes** | — | Project or app name |
| `description` | No | `null` | Brief project description |
| `viewport` | No | `{ width: 390, height: 844 }` | Default viewport size in pixels |
| `theme` | No | `{ mode: light }` | Visual theme settings |
| `theme.mode` | No | `light` | `light` or `dark` |
| `theme.accent` | No | `"#2563EB"` | Accent color hex — the only hex you should set |
| `roles` | No | `[]` | Role definitions (see [Section 6](#6-user-roles)) |

### Viewport presets

Choose the viewport that matches your target device:

| Device | Width | Height | Use for |
|--------|-------|--------|---------|
| iPhone (standard) | 390 | 844 | Mobile apps (default) |
| iPhone SE | 375 | 667 | Compact mobile |
| Android (standard) | 412 | 915 | Android apps |
| iPad | 820 | 1180 | Tablet apps |
| Desktop (laptop) | 1440 | 900 | Web apps, dashboards |
| Desktop (wide) | 1920 | 1080 | Full-width web apps |

**Always specify the viewport explicitly** — don't rely on the default. It signals intent.

```yaml
# Mobile app
meta:
  name: "MyApp"
  viewport: { width: 390, height: 844 }

# Desktop web app
meta:
  name: "AdminPanel"
  viewport: { width: 1440, height: 900 }
```

---

## 4. Screens

Each screen is a single viewport representing one page, view, or state of the application.

### Screen definition

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `id` | **Yes** | — | Unique identifier (snake_case, alphanumeric + underscores) |
| `title` | **Yes** | — | Display name, rendered above the frame |
| `path` | No | — | URL path or route (e.g., `/login`, `/products/:id`) |
| `viewport` | No | Inherits from `meta.viewport` | Override viewport for this screen |
| `background` | No | `background` token | Screen background color |
| `statusbar` | No | `true` | Show device status bar (mobile viewports) |
| `role` | No | — | Restrict entire screen to role(s) |
| `children` | **Yes** | `[]` | Element tree |

### Screen ID conventions

- Use `snake_case`: `home`, `product_detail`, `user_settings`
- Be descriptive: `checkout_payment` not `step3`
- Each ID must be unique within the file

```yaml
screens:
  - id: home
    title: "Home"
    path: "/"
    children: [...]

  - id: product_detail
    title: "Product Detail"
    path: "/products/:id"
    children: [...]
```

---

## 5. Screen Navigation & Flows

The `next` property on any **element or block** declares which screen(s) the user can navigate to by interacting with it. This creates a directed graph of navigation flow. Place `next` on the element that represents the user action — a button, a link, a card, or a CTA block.

### Single target (on an element)

```yaml
- id: login
  title: "Login"
  children:
    - type: scroll
      children: [...]
    - type: button
      label: "Log in"
      variant: primary
      next: home              # String — one target
```

### Single target (on a block)

```yaml
- id: signup
  title: "Sign Up"
  children:
    - type: scroll
      children: [...]
    - block: cta-banner
      cta-label: "Create account"
      next: onboarding        # Works on blocks too
```

### Multiple targets (branching)

```yaml
- id: welcome
  title: "Welcome"
  children:
    - type: button
      label: "Sign up"
      next: signup
    - type: button
      label: "Log in"
      next: login             # Each button points to a different screen
```

### No target (endpoint)

```yaml
- id: confirmation
  title: "Order Confirmed"
  # No element with `next` — this is an end screen
  children: [...]
```

### Building a complete flow

A typical app flow creates a directed graph:

```yaml
screens:
  # Entry point — CTA branches to login or signup
  - id: welcome
    title: "Welcome"
    children:
      - block: cta-banner
        heading: "Get started"
        cta-label: "Sign up"
        cta-secondary-label: "Log in"
        next: [login, signup]

  # Login converges to home
  - id: login
    title: "Login"
    path: "/login"
    children:
      - type: scroll
        children: [...]
      - block: cta-banner
        cta-label: "Log in"
        next: home

  # Signup goes through onboarding first
  - id: signup
    title: "Sign Up"
    path: "/signup"
    children:
      - type: scroll
        children: [...]
      - block: cta-banner
        cta-label: "Create account"
        next: onboarding

  # Onboarding converges to home
  - id: onboarding
    title: "Onboarding"
    path: "/onboarding"
    children:
      - type: scroll
        children: [...]
      - block: cta-banner
        cta-label: "Get started"
        next: home

  # Home — CTA branches to detail views
  - id: home
    title: "Home"
    path: "/"
    children:
      - type: scroll
        children: [...]
      - block: cta-inline
        heading: "Explore"
        cta-label: "See all"
        next: [product_detail, search]

  # End screens (no block with next)
  - id: product_detail
    title: "Product Detail"
    path: "/products/:id"
    children: [...]

  - id: search
    title: "Search"
    path: "/search"
    children: [...]
```

This creates the flow:
```
welcome ──→ login ──→ home ──→ product_detail
    │                  │
    └──→ signup ──→ onboarding
                       │
                       └──→ home ──→ search
```

### Navigation flow rules

1. Every `next` value must reference a valid screen `id` defined in the same file
2. The first screen in the `screens` array is the entry point
3. Flows can branch (one-to-many via array) and converge (many-to-one)
4. Circular references are allowed (e.g., `home → settings → home`)
5. Place `next` on the element or block that represents the user action (button, link, card, CTA block, etc.)
6. Multiple elements in a screen can each have their own `next` — flow arrows originate from each element's position

```yaml
- type: button
  label: "Sign Up"
  variant: primary
  annotation: "Navigates to screen: signup"
```

---

## 6. User Roles

Roles annotate which user types can see specific screens, elements, or blocks. They are a **visual communication tool** — they don't enforce access control, they communicate intent on the wireframe.

### Defining roles

Roles are defined in `meta.roles`. Each role needs a unique `id`, a human-readable `label`, and a `color` for visual distinction.

```yaml
meta:
  name: "TeamApp"
  roles:
    - id: admin
      label: "Admin"
      color: "#DC2626"      # Red
    - id: manager
      label: "Manager"
      color: "#D97706"      # Amber
    - id: member
      label: "Member"
      color: "#2563EB"      # Blue
    - id: guest
      label: "Guest"
      color: "#9333EA"      # Purple
```

### Role definition fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | **Yes** | Unique identifier (snake_case) |
| `label` | **Yes** | Human-readable display name |
| `color` | **Yes** | Hex color for visual marking (`#RGB`, `#RRGGBB`, or `#RRGGBBAA`) |

### Applying roles

The `role` property can be set on **any screen, element, or block**. It accepts a single role id or an array.

#### Restrict an entire screen

When a screen has a `role`, the entire screen — including all children — is considered restricted. The role badge appears on the screen frame itself.

```yaml
screens:
  - id: admin_dashboard
    title: "Admin Dashboard"
    role: admin
    children: [...]
```

#### Restrict a specific element

```yaml
- type: button
  label: "Delete User"
  variant: primary
  color: error
  role: admin
```

#### Restrict to multiple roles

```yaml
- type: card
  padding: lg
  role: [admin, manager]
  children:
    - type: text
      variant: h4
      content: "Budget Overview"
```

#### Restrict a block

```yaml
- block: data-table
  title: "User Management"
  role: admin
  columns: [...]
```

### How roles render

Elements with a `role` property get:
1. A **colored dashed outline** using the role's color
2. A **role badge** (small label) at the top-right corner
3. A **role legend** at the bottom of the screen listing all roles used

```
┌─────────────────────────────────┐
│  User List                      │  ← no role (visible to all)
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  ╎ [Admin]        Delete All ╎  │  ← red dashed outline + badge
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                                 │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  ╎ [Admin] [Manager]        ╎  │  ← multi-role: both badges
│  ╎ Edit User Details        ╎  │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                                 │
│  ──────────────────────────     │
│  Roles: ● Admin  ● Manager     │  ← legend
└─────────────────────────────────┘
```

### Role behavior rules

1. **No inheritance.** A child inside a role-restricted parent does NOT automatically carry that role. Each `role` is independent.
2. **Screen-level role = all children restricted.** If the *screen* has a `role`, the entire screen is restricted — you don't need to mark each child.
3. **Elements without `role` are visible to all.** This is the default.
4. **Validation:** Every `role` value must reference a role `id` defined in `meta.roles`. If `role` is used anywhere, `meta.roles` must exist and be non-empty.

### When to use roles

- **Do** apply roles at the highest meaningful level — prefer marking a whole `card` or `section` over individual children
- **Do** use distinct, contrasting colors so role boundaries are easy to scan
- **Do** mark screens that are entirely restricted (admin panels, settings pages)
- **Don't** mark every element — most elements are visible to all users
- **Don't** use roles for feature flags or A/B tests — roles are for user types

### Complete role example

```yaml
riss: "0.1"

meta:
  name: "TeamApp"
  viewport: { width: 1440, height: 900 }
  theme:
    mode: light
    accent: "#2563EB"
  roles:
    - id: admin
      label: "Admin"
      color: "#DC2626"
    - id: manager
      label: "Manager"
      color: "#D97706"
    - id: member
      label: "Member"
      color: "#2563EB"

screens:
  # Admin-only screen
  - id: user_management
    title: "User Management"
    path: "/admin/users"
    role: admin
    children:
      - type: navbar
        title: "User Management"
      - type: scroll
        grow: 1
        padding: xl
        children:
          - type: table
            columns:
              - label: "Name"
                width: "1/3"
              - label: "Role"
                width: "1/3"
              - label: "Actions"
                width: "1/3"
            rows:
              - ["Alice", "Admin", "Edit"]
              - ["Bob", "Manager", "Edit"]

  # Shared screen with role-restricted elements
  - id: dashboard
    title: "Dashboard"
    path: "/dashboard"
    children:
      - type: navbar
        title: "Dashboard"

      - type: scroll
        grow: 1
        padding: xl
        gap: lg
        children:
          # Visible to everyone
          - type: card
            padding: lg
            children:
              - type: text
                variant: h4
                content: "Team Activity"
              - type: text
                content: "Sprint 12 started today"
                color: text-secondary

          # Only managers and admins
          - type: card
            padding: lg
            role: [admin, manager]
            children:
              - type: text
                variant: h4
                content: "Budget Overview"
              - type: progress
                value: 80
                color: warning

          # Only admins
          - type: card
            padding: lg
            role: admin
            children:
              - type: text
                variant: h4
                content: "Danger Zone"
                color: error
              - type: button
                label: "Delete Team"
                variant: outline
                color: error
```

---

## 7. Layout System

Riss uses a flexbox-inspired layout model. Every element that accepts `children` is a layout container.

### Layout direction

| Value | Description | Default |
|-------|-------------|---------|
| `stack` | Children flow top to bottom (column) | **Default** |
| `row` | Children flow left to right | — |
| `grid` | Multi-column grid (requires `columns`) | — |

### Alignment

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| `align` | `start`, `center`, `end`, `stretch` | `stretch` | Cross-axis alignment |
| `justify` | `start`, `center`, `end`, `between`, `around`, `evenly` | `start` | Main-axis distribution |
| `align-self` | `start`, `center`, `end`, `stretch` | Inherits | Override parent alignment |

### Sizing

| Value | Meaning |
|-------|---------|
| Number | Pixels (`width: 200`) |
| `"full"` | 100% of parent |
| `"half"` | 50% of parent |
| `"1/3"`, `"2/3"` | 33.33%, 66.67% |
| `"1/4"`, `"3/4"` | 25%, 75% |
| `"auto"` | Size to content (default) |

Additional sizing properties: `min-width`, `min-height`, `max-width`, `max-height`, `grow` (flex-grow), `shrink` (flex-shrink).

### Spacing

**Always use tokens, not pixel values:**

| Token | Pixels |
|-------|--------|
| `none` | 0 |
| `xs` | 4 |
| `sm` | 8 |
| `md` | 16 |
| `lg` | 24 |
| `xl` | 32 |
| `2xl` | 48 |
| `3xl` | 64 |

Properties: `padding`, `padding-x`, `padding-y`, `margin`, `margin-x`, `margin-y`, `gap`

Raw pixel numbers are also accepted (`padding: 12`) but tokens are preferred.

### Grid properties

| Property | Description |
|----------|-------------|
| `columns` | Number of columns (1-12) |
| `column-gap` | Override horizontal gap |
| `row-gap` | Override vertical gap |
| `span` | On child: how many columns to span (1-12) |

---

## 8. Styling System

### Color tokens

**Always use tokens, not hex values.** The only hex you should set is `meta.theme.accent`.

| Token | Usage |
|-------|-------|
| `background` | Screen/page background |
| `surface` | Card/container backgrounds |
| `surface-raised` | Elevated surfaces (modals) |
| `text` | Primary text |
| `text-secondary` | Muted/secondary text |
| `text-disabled` | Disabled text |
| `border` | Default border color |
| `border-strong` | Emphasized border |
| `accent` | Primary action color (from `meta.theme.accent`) |
| `accent-soft` | Accent at 15% opacity |
| `success` | Success states |
| `warning` | Warning states |
| `error` | Error states |
| `placeholder` | Image/content placeholders |

### Border

```yaml
# Shorthand
border: true                  # 1px solid border-color on all sides

# Object form
border:
  color: border-strong
  width: 2
  style: dashed               # solid | dashed
  sides: [top, bottom]        # all | top | bottom | left | right | array
```

### Border radius

| Token | Pixels |
|-------|--------|
| `none` | 0 |
| `sm` | 4 |
| `md` | 8 |
| `lg` | 12 |
| `xl` | 16 |
| `full` | 9999 (circular) |

### Elevation

`elevation: none | sm | md | lg` — Drop shadow. Use sparingly, primarily for cards and modals.

### Overflow

`overflow: visible | hidden | scroll` — `scroll` renders scroll indicators in the wireframe.

---

## 9. Element Reference

### Quick reference — all element types

| Category | Types |
|----------|-------|
| **Layout** | `stack`, `row`, `grid`, `scroll` |
| **Container** | `card`, `section`, `modal`, `bottomsheet` |
| **Content** | `text`, `image`, `icon`, `avatar`, `divider`, `spacer`, `badge`, `chip`, `progress` |
| **Interactive** | `button`, `input`, `textarea`, `checkbox`, `radio`, `toggle`, `select`, `slider` |
| **Navigation** | `navbar`, `tabbar`, `tabs`, `breadcrumb` |
| **Data** | `list`, `list-item`, `table`, `placeholder` |
| **Feedback** | `alert`, `toast`, `skeleton`, `empty-state`, `spinner` |
| **Meta** | `annotation` |

### Layout elements

#### `stack` — Vertical container

```yaml
- type: stack
  gap: md
  padding: lg
  children:
    - type: text
      content: "First"
    - type: text
      content: "Second"
```

#### `row` — Horizontal container

```yaml
- type: row
  gap: sm
  align: center
  children:
    - type: icon
      name: star
    - type: text
      content: "Starred"
```

Key property: `wrap: true` enables line wrapping.

#### `grid` — Multi-column grid

```yaml
- type: grid
  columns: 3
  gap: md
  children:
    - type: card
      children: [...]
    - type: card
      span: 2              # Spans 2 columns
      children: [...]
```

#### `scroll` — Scrollable container

```yaml
- type: scroll
  direction: horizontal    # vertical (default) | horizontal
  height: 200
  gap: md
  children: [...]
```

### Container elements

#### `card`

```yaml
- type: card
  variant: outlined         # outlined (default) | elevated | filled
  padding: md
  elevation: sm
  rounded: md
  children: [...]
```

#### `section` — Logical grouping (no visible boundary)

```yaml
- type: section
  title: "Recent Activity"
  children: [...]
```

#### `modal`

```yaml
- type: modal
  title: "Confirm Delete"
  width: "2/3"
  closable: true
  children: [...]
```

#### `bottomsheet`

```yaml
- type: bottomsheet
  title: "Options"
  height: "half"            # "auto" | "half" | "full" | number
  handle: true
  children: [...]
```

### Content elements

#### `text`

```yaml
- type: text
  variant: h1               # h1-h6, body, body-sm, caption, label, overline, code
  content: "Heading Text"   # Required
  color: text-secondary
  weight: bold              # normal | medium | semibold | bold
  align: center             # left | center | right
  max-lines: 2              # Truncate with ellipsis
```

Typography scale:

| Variant | Size | Weight |
|---------|------|--------|
| `h1` | 32px | bold |
| `h2` | 24px | bold |
| `h3` | 20px | semibold |
| `h4` | 18px | semibold |
| `h5` | 16px | semibold |
| `h6` | 14px | semibold |
| `body` | 16px | normal |
| `body-sm` | 14px | normal |
| `caption` | 12px | normal |
| `label` | 12px | medium |
| `overline` | 10px | semibold |
| `code` | 14px | normal (mono) |

#### `image` — Image placeholder

```yaml
- type: image
  aspect: "16/9"             # "W/H" format
  label: "Hero Banner"
  rounded: md
```

#### `icon`

```yaml
- type: icon
  name: heart                # Required — from standard icon set
  size: 24                   # Default: 20
  color: accent
```

Standard icon set (v0.1):

`home`, `search`, `settings`, `user`, `users`, `bell`, `mail`, `heart`, `star`, `bookmark`, `share`, `edit`, `trash`, `plus`, `minus`, `close`, `check`, `chevron-left`, `chevron-right`, `chevron-up`, `chevron-down`, `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`, `menu`, `more-horizontal`, `more-vertical`, `filter`, `sort`, `download`, `upload`, `camera`, `image`, `video`, `mic`, `phone`, `map-pin`, `clock`, `calendar`, `link`, `lock`, `unlock`, `eye`, `eye-off`, `info`, `help`, `warning`, `error`, `play`, `pause`, `skip-forward`, `skip-back`, `refresh`, `copy`, `file`, `folder`, `chart`, `globe`, `inbox`, `dollar-sign`, `credit-card`, `shield`, `zap`, `code`

#### `avatar`

```yaml
- type: avatar
  size: 48                   # Diameter in pixels (default: 40)
  initials: "BQ"
```

#### `divider`, `spacer`, `badge`, `chip`, `progress`

```yaml
- type: divider
  margin-y: sm

- type: spacer
  size: 16                   # Omit for flexible spacer (grow: 1)

- type: badge
  content: "3"               # 1-3 chars, or omit for dot
  color: error

- type: chip
  label: "Outdoor"           # Required
  variant: outlined          # filled (default) | outlined
  removable: true

- type: progress
  value: 65                  # 0-100
  color: accent
```

### Interactive elements

#### `button`

```yaml
- type: button
  label: "Get Started"        # Required
  variant: primary             # primary | secondary | outline | ghost | text
  size: lg                     # sm | md | lg
  full-width: true
  leading-icon: plus
  trailing-icon: arrow-right
  icon-only: true              # Render as icon button (needs leading-icon)
  disabled: false
```

#### `input`

```yaml
- type: input
  label: "Email"
  placeholder: "you@example.com"
  value: ""
  helper: "We'll never share your email"
  error: "Invalid email address"
  leading-icon: mail
  variant: outlined            # outlined | filled | underline
  required: true
  disabled: false
```

#### `textarea`

```yaml
- type: textarea
  label: "Message"
  placeholder: "Write your message..."
  rows: 4
```

#### `checkbox`, `radio`, `toggle`, `select`, `slider`

```yaml
- type: checkbox
  label: "I agree to the terms"
  checked: false

- type: radio
  label: "Delivery method"
  options: ["Standard", "Express", "Same day"]
  selected: 0                  # 0-based index
  direction: vertical          # vertical | horizontal

- type: toggle
  label: "Dark mode"
  checked: true

- type: select
  label: "Country"
  placeholder: "Choose..."
  options: ["Norway", "Sweden", "Denmark"]
  selected: 0

- type: slider
  label: "Volume"
  min: 0
  max: 100
  value: 75
```

### Navigation elements

#### `navbar` — Top navigation bar (mobile)

```yaml
- type: navbar
  title: "Settings"
  leading: icon:arrow-left      # Shortcuts: "icon:NAME", "avatar", "menu"
  trailing:
    - icon:search
    - icon:more-vertical
```

Fixed height of 56px, always at top.

#### `tabbar` — Bottom tab bar

```yaml
- type: tabbar
  items:
    - icon: home
      label: "Home"
      active: true
    - icon: search
      label: "Search"
    - icon: user
      label: "Profile"
```

Fixed height of 56px + safe area, always at bottom.

#### `tabs` — Inline tab strip

```yaml
- type: tabs
  variant: underline           # underline | filled | pill
  items:
    - label: "Overview"
      active: true
    - label: "Details"
    - label: "Reviews"
```

#### `breadcrumb`

```yaml
- type: breadcrumb
  items: ["Home", "Products", "Running Shoes"]
  separator: "/"
```

### Data display elements

#### `list` + `list-item`

```yaml
- type: list
  dividers: true
  children:
    - type: list-item
      leading: avatar           # "avatar", "icon:NAME", "checkbox", "image"
      title: "Ola Nordmann"
      subtitle: "Online now"
      trailing: icon:chevron-right   # "icon:NAME", "toggle", "badge:N", "text:VALUE"
      size: md                  # sm | md | lg
```

#### `table`

```yaml
- type: table
  striped: true
  columns:
    - label: "Name"
      width: "1/3"
    - label: "Status"
      width: "1/3"
      align: center
  rows:
    - ["Alice", "Active"]
    - ["Bob", "Inactive"]
```

#### `placeholder` — Generic content placeholder

```yaml
- type: placeholder
  label: "Interactive Map"
  icon: map-pin
  aspect: "4/3"
```

Use for charts, maps, video players, or any complex content without a specific element type.

### Feedback elements

```yaml
- type: alert
  variant: warning              # info | success | warning | error
  title: "Connection unstable"
  message: "Some features may not work."
  dismissable: true

- type: toast
  message: "Item saved"
  variant: success
  action: "Undo"

- type: skeleton
  variant: text                 # text | rect | circle | card | avatar | list-item
  lines: 3

- type: empty-state
  icon: inbox
  title: "No messages yet"
  message: "Messages will appear here."
  action: "Compose"

- type: spinner
  size: 32
  color: accent
```

---

## 10. RissBlocks (Pre-built Patterns)

RissBlocks are parameterized, pre-built wireframe sections composed of Riss primitives. Use them for common UI patterns instead of manually building element trees.

### Using a block

```yaml
children:
  - block: hero                 # Block type (required)
    heading: "Ship faster"      # Block-specific parameters
    subheading: "AI-generated wireframes."
    cta-label: "Get Started"
```

### Block syntax

| Field | Required | Description |
|-------|----------|-------------|
| `block` | **Yes** | Block type name |
| `id` | No | Instance identifier |
| `role` | No | Role restriction (same as elements) |
| `annotation` | No | Annotation text |
| Other fields | Varies | Block-specific parameters |

### When to use blocks vs. raw elements

**Use blocks when:**
- The pattern matches a core block closely
- You want consistent, best-practice layout
- The screen structure should be quickly scannable

**Use raw elements when:**
- The section is highly custom
- You need precise layout control that block parameters don't expose
- You're building something the blocks weren't designed for

**Mixing is encouraged.** A screen can contain both blocks and raw elements.

### Block placement rules

1. **Blocks are direct screen children only.** Do NOT nest blocks inside other blocks, or place blocks inside `stack`, `row`, `grid`, or other layout elements.
2. **Use realistic content.** Fill parameters with real-sounding data, not "Lorem ipsum."
3. **Override only what you need.** Rely on defaults for parameters you don't customize.

### All 57 core blocks

| Category | Blocks |
|----------|--------|
| **Hero & Header** | `hero`, `page-header`, `announcement-bar` |
| **Navigation** | `sidebar-nav`, `top-nav`, `breadcrumb-header`, `bottom-nav` |
| **Content** | `side-by-side`, `alternating-rows`, `content-carousel`, `blog-card-grid`, `timeline`, `rich-text` |
| **Features & Benefits** | `feature-grid`, `feature-list`, `checklist`, `how-it-works` |
| **Social Proof** | `logo-bar`, `testimonial-card`, `testimonial-grid`, `stats-row`, `rating-block` |
| **Pricing** | `pricing-table`, `pricing-card` |
| **Call to Action** | `cta-banner`, `cta-inline`, `cta-with-input` |
| **Forms** | `login-form`, `signup-form`, `contact-form`, `search-with-filters`, `multi-step-form`, `settings-form` |
| **Data & Dashboard** | `stat-cards-row`, `data-table`, `activity-feed`, `chart-card`, `kanban-board` |
| **E-Commerce** | `product-card-grid`, `product-detail`, `cart-summary`, `checkout-steps` |
| **User & Profile** | `profile-header`, `team-grid`, `avatar-list` |
| **Lists & Collections** | `card-grid`, `media-gallery`, `accordion`, `ranked-list` |
| **Feedback & State** | `empty-state-block`, `error-page`, `loading-skeleton`, `confirmation` |
| **Communication** | `chat-thread`, `comment-thread`, `notification-list` |
| **Footer** | `footer` |

### Common block parameters

These parameter names recur across many blocks with consistent meaning:

| Parameter | Type | Description |
|-----------|------|-------------|
| `title` | String | Section heading |
| `subtitle` | String | Secondary text below title |
| `items` | Array | Primary data array (cards, features, etc.) |
| `columns` | Number | Grid column count |
| `cta-label` | String | Primary CTA button label |
| `cta-secondary-label` | String | Secondary button label |
| `variant` | String | Visual/layout variation |
| `icon` | String | Icon name from standard set |
| `image-label` | String | Label on image placeholder |
| `show-more` | String | "View all" link label |
| `background` | Color | Section background color |

### Blocks vs. elements disambiguation

| Element | Block | Use element when | Use block when |
|---------|-------|-----------------|----------------|
| `navbar` | `top-nav` | Mobile app bars with icons | Marketing pages with logo, links, CTA |
| `tabbar` | `bottom-nav` | Full control over bottom bar | Quick mobile nav with defaults |
| `table` | `data-table` | Simple static tables | Tables with search, filters, pagination |
| `skeleton` | `loading-skeleton` | Single shimmer shape | Full-section loading pattern |
| `empty-state` | `empty-state-block` | Simple inline empty state | Full-section with illustration and CTA |

---

## 11. Custom Blocks

You can define reusable blocks within a `.riss.yaml` file for patterns that aren't covered by core blocks.

### Defining a custom block

```yaml
blocks:
  - id: metric-card
    description: "A card showing a single metric with trend"
    params:
      - name: label
        required: true
      - name: value
        required: true
      - name: trend
        default: null
      - name: trend-direction
        default: null
      - name: icon
        default: null
    template:
      - type: card
        padding: lg
        children:
          - type: row
            align: center
            justify: between
            children:
              - type: stack
                gap: xs
                children:
                  - type: text
                    variant: caption
                    content: "{{label}}"
                    color: text-secondary
                  - type: text
                    variant: h2
                    content: "{{value}}"
              - type: icon
                name: "{{icon}}"
                size: 24
                color: text-secondary
                if: "{{icon}}"
          - type: text
            variant: caption
            content: "{{trend}}"
            color: "{{trend-direction == 'up' ? 'success' : trend-direction == 'down' ? 'error' : 'text-secondary'}}"
            if: "{{trend}}"
```

### Using a custom block

```yaml
screens:
  - id: dashboard
    title: "Dashboard"
    children:
      - type: grid
        columns: 3
        gap: md
        children:
          - block: metric-card
            label: "Users"
            value: "12,847"
            trend: "+12%"
            trend-direction: up
            icon: users
```

### Template interpolation

| Syntax | Description |
|--------|-------------|
| `{{param_name}}` | Replaced with parameter value |
| `if: "{{param_name}}"` | Conditionally render element only if param is truthy |
| `{{param == 'value' ? 'a' : 'b'}}` | Ternary expression (only `==` comparisons) |
| Nested ternary | `{{x == 'a' ? 'r1' : x == 'b' ? 'r2' : 'r3'}}` |

### Limitations in v0.1

- No nested property access — keep parameters flat
- Only `==` comparisons — no `!=`, `>`, `<`, or boolean operators
- No arithmetic expressions
- Custom block `id` must not conflict with core block names

---

## 12. Annotations

Annotations are comments that render visually on the wireframe. Use them to communicate design intent, requirements, or behavioral notes.

### Inline annotations (on any element)

```yaml
- type: button
  label: "Submit"
  annotation: "Must validate all required fields before enabling"
```

### Standalone annotation element

```yaml
- type: annotation
  content: "This section should pull data from the activity feed API"
  position: top-right         # top-left | top-right | bottom-left | bottom-right | inline
  color: warning              # default | info | warning | accent
```

The renderer auto-numbers annotations (1, 2, 3...) and renders a legend below the screen.

### When to annotate

- Interactive behavior that isn't obvious from the wireframe
- API or data source requirements
- Navigation targets (`"Taps navigate to screen: product_detail"`)
- Conditional visibility logic
- Placeholder content that represents dynamic data

---

## 13. Generation Rules & Best Practices

### Structure checklist

Every generated file MUST include:

```yaml
riss: "0.1"
meta:
  name: "..."
  viewport: { ... }
  theme:
    mode: light
screens:
  - id: ...
    title: "..."
    children: [...]
```

### Golden rules

1. **Start with the screen skeleton.** Think: navbar at top? Tabbar at bottom? Scrollable content in the middle? Build the structure first, then fill details.

2. **Use `stack` as the default layout.** Only use `row` for horizontal arrangements, `grid` for uniform grids.

3. **Nest meaningfully.** Each level should represent a visual or logical grouping. Don't wrap single elements in unnecessary containers.

4. **Use spacing tokens, not pixels.** `gap: md` not `gap: 16`.

5. **Use color tokens, not hex.** `color: text-secondary` not `color: "#6B7280"`. Only set hex for `meta.theme.accent`.

6. **Establish visual hierarchy.** Use heading variants (`h1`–`h6`) to show importance.

7. **Annotate ambiguous elements.** If a placeholder, chart, or interaction isn't obvious, add an `annotation`.

8. **Use the right element.** Don't build a list with `stack` + `divider` — use `list` + `list-item`. Don't build a card with bordered `stack` — use `card`.

9. **Realistic, concise content.** Real-sounding names, prices, dates — not "Lorem ipsum" or "Text here".

10. **Every screen needs navigation context.** Mobile screens need `navbar` and/or `tabbar`. Desktop screens need a sidebar or top navigation.

11. **Prefer blocks over manual construction.** If a section maps to a core block, use the block.

12. **Blocks are direct screen children only.** Never nest blocks inside other elements or other blocks.

### Common screen skeletons

#### Mobile app screen

```yaml
- id: screen_name
  title: "Screen Name"
  children:
    - type: navbar
      title: "Screen Name"
      leading: icon:arrow-left

    - type: scroll
      grow: 1
      padding: lg
      gap: md
      children:
        # ... screen content

    - type: tabbar
      items:
        - icon: home
          label: "Home"
          active: true
        - icon: search
          label: "Search"
        - icon: user
          label: "Profile"
```

#### Desktop app screen

```yaml
- id: screen_name
  title: "Screen Name"
  viewport: { width: 1440, height: 900 }
  children:
    - type: row
      height: "full"
      children:
        # Sidebar
        - type: stack
          width: 240
          background: surface
          border: { sides: right }
          children:
            # ... nav items

        # Main
        - type: stack
          grow: 1
          children:
            # Top bar
            - type: row
              padding: lg
              border: { sides: bottom }
              children:
                # ... search, actions

            # Content
            - type: scroll
              grow: 1
              padding: xl
              children:
                # ... page content
```

#### Landing page (blocks-based)

```yaml
- id: landing
  title: "Landing Page"
  viewport: { width: 1440, height: 900 }
  children:
    - block: top-nav
      logo: "AppName"
      items:
        - label: "Features"
        - label: "Pricing"
        - label: "Docs"
      cta-label: "Sign Up"

    - block: hero
      heading: "Your main value proposition"
      subheading: "Supporting text that elaborates."
      cta-label: "Get Started"

    - block: feature-grid
      columns: 3
      items:
        - icon: zap
          title: "Fast"
          description: "Built for speed."
        - icon: shield
          title: "Secure"
          description: "Enterprise-grade security."
        - icon: users
          title: "Collaborative"
          description: "Built for teams."

    - block: footer
      variant: simple
```

### Multi-screen best practices

- Give each screen a unique, descriptive `id`
- Keep navigation elements consistent across screens at the same level
- Mark the active tab/nav item correctly per screen
- Use `next` on blocks to declare screen flow
- Use `annotation` on interactive elements to clarify navigation targets

---

## 14. Validation Checklist

Before outputting a `.riss.yaml` file, verify:

| # | Rule |
|---|------|
| 1 | `riss` field is `"0.1"` |
| 2 | `meta.name` is a non-empty string |
| 3 | `screens` is a non-empty array |
| 4 | Every screen has a unique `id` (snake_case) |
| 5 | Every screen has `title` and `children` |
| 6 | Every element has a valid `type` from the element reference |
| 7 | Required properties for each element type are present |
| 8 | `children` only appears on container/layout elements (`stack`, `row`, `grid`, `scroll`, `card`, `section`, `modal`, `bottomsheet`, `list`, screen root) |
| 9 | Content elements do NOT have `children` |
| 10 | Color values are recognized tokens or valid hex (`#RGB`, `#RRGGBB`, `#RRGGBBAA`) |
| 11 | Spacing values are recognized tokens or non-negative numbers |
| 12 | Size values are numbers, fraction strings, `"full"`, `"half"`, or `"auto"` |
| 13 | Every `role` value references a role `id` defined in `meta.roles` |
| 14 | If `role` is used anywhere, `meta.roles` is defined and non-empty |
| 15 | Every block `next` value references a valid screen `id` in the same file |
| 16 | Blocks appear only as direct screen children, not nested inside elements or other blocks |
| 17 | Custom block `id` does not conflict with core block names |

---

## 15. Complete Examples

### Example 1: Multi-screen mobile app with navigation flow and roles

```yaml
riss: "0.1"

meta:
  name: "TaskFlow"
  description: "Team task management app"
  viewport: { width: 390, height: 844 }
  theme:
    mode: light
    accent: "#6366F1"
  roles:
    - id: admin
      label: "Admin"
      color: "#DC2626"
    - id: member
      label: "Member"
      color: "#2563EB"

screens:
  - id: login
    title: "Login"
    path: "/login"
    children:
      - type: stack
        padding: xl
        justify: center
        height: "full"
        gap: lg
        children:
          - type: stack
            align: center
            gap: sm
            children:
              - type: icon
                name: zap
                size: 48
                color: accent
              - type: text
                variant: h2
                content: "TaskFlow"
                align: center
              - type: text
                variant: body
                content: "Sign in to your workspace"
                color: text-secondary
                align: center

          - type: input
            label: "Email"
            placeholder: "you@company.com"
            leading-icon: mail

          - type: input
            label: "Password"
            placeholder: "Enter password"
            leading-icon: lock
            trailing-icon: eye-off

      - block: cta-banner
        heading: "Sign In"
        cta-label: "Sign In"
        next: home

  - id: home
    title: "Home"
    path: "/"
    children:
      - type: navbar
        title: "TaskFlow"
        trailing:
          - icon:bell
          - icon:settings

      - type: scroll
        grow: 1
        padding: lg
        gap: lg
        children:
          - type: text
            variant: h2
            content: "Good morning, Ola"

          - type: grid
            columns: 2
            gap: md
            children:
              - type: card
                padding: md
                children:
                  - type: text
                    variant: caption
                    content: "Open Tasks"
                    color: text-secondary
                  - type: text
                    variant: h2
                    content: "12"

              - type: card
                padding: md
                children:
                  - type: text
                    variant: caption
                    content: "Due Today"
                    color: text-secondary
                  - type: text
                    variant: h2
                    content: "3"
                    color: warning

          - type: text
            variant: h4
            content: "Recent Tasks"

          - type: list
            children:
              - type: list-item
                leading: "icon:check"
                title: "Update API documentation"
                subtitle: "Due tomorrow"
                trailing: "icon:chevron-right"
              - type: list-item
                leading: "icon:check"
                title: "Review pull request #42"
                subtitle: "Due today"
                trailing: "icon:chevron-right"
              - type: list-item
                leading: "icon:check"
                title: "Deploy staging environment"
                subtitle: "Overdue"
                trailing: "icon:chevron-right"

      - block: cta-inline
        heading: "View tasks"
        cta-label: "See all"
        next: [task_detail, settings]

      - type: tabbar
        items:
          - icon: home
            label: "Home"
            active: true
          - icon: inbox
            label: "Tasks"
          - icon: plus
            label: "New"
          - icon: users
            label: "Team"
          - icon: user
            label: "Profile"

  - id: task_detail
    title: "Task Detail"
    path: "/tasks/:id"
    children:
      - type: navbar
        title: "Task Detail"
        leading: icon:arrow-left
        trailing: icon:more-vertical

      - type: scroll
        grow: 1
        padding: lg
        gap: md
        children:
          - type: chip
            label: "In Progress"
            variant: filled

          - type: text
            variant: h3
            content: "Update API documentation"

          - type: text
            content: "Review and update the REST API docs to reflect the v2 endpoints. Include request/response examples for each route."
            color: text-secondary

          - type: divider

          - type: row
            gap: lg
            children:
              - type: stack
                gap: xs
                children:
                  - type: text
                    variant: label
                    content: "ASSIGNEE"
                    color: text-secondary
                  - type: row
                    gap: sm
                    align: center
                    children:
                      - type: avatar
                        size: 24
                        initials: "ON"
                      - type: text
                        variant: body-sm
                        content: "Ola Nordmann"

              - type: stack
                gap: xs
                children:
                  - type: text
                    variant: label
                    content: "DUE DATE"
                    color: text-secondary
                  - type: text
                    variant: body-sm
                    content: "Apr 15, 2026"

          - type: divider

          # Admin-only: reassign and delete
          - type: card
            padding: md
            role: admin
            children:
              - type: text
                variant: label
                content: "ADMIN ACTIONS"
              - type: row
                gap: sm
                children:
                  - type: button
                    label: "Reassign"
                    variant: outline
                    size: sm
                  - type: button
                    label: "Delete Task"
                    variant: outline
                    size: sm
                    color: error

  - id: settings
    title: "Settings"
    path: "/settings"
    role: admin
    children:
      - type: navbar
        title: "Settings"
        leading: icon:arrow-left

      - type: scroll
        grow: 1
        padding: lg
        gap: md
        children:
          - type: text
            variant: h3
            content: "Workspace Settings"

          - type: input
            label: "Workspace Name"
            value: "Acme Corp"

          - type: select
            label: "Default Role"
            options: ["Admin", "Member"]
            selected: 1

          - type: toggle
            label: "Allow member invitations"
            checked: true

          - type: divider

          - type: button
            label: "Save Changes"
            variant: primary
            full-width: true
```

### Example 2: SaaS landing page with blocks

```yaml
riss: "0.1"

meta:
  name: "CloudSync"
  viewport: { width: 1440, height: 900 }
  theme:
    mode: light
    accent: "#6366F1"

screens:
  - id: landing
    title: "Landing Page"
    children:
      - block: top-nav
        logo: "CloudSync"
        items:
          - label: "Features"
          - label: "Pricing"
          - label: "Docs"
          - label: "Blog"
        cta-label: "Start Free"
        cta-secondary-label: "Log In"

      - block: hero
        variant: split
        heading: "Sync your data across every cloud"
        subheading: "One API. Every provider. Zero vendor lock-in."
        cta-label: "Start Free"
        cta-secondary-label: "View Demo"
        next: [signup, login]
        image-label: "Dashboard Preview"

      - block: logo-bar
        title: "Trusted by 500+ companies"
        logos: 5
        labels: ["AWS", "Azure", "GCP", "Vercel", "Cloudflare"]

      - block: feature-grid
        title: "Why teams choose CloudSync"
        columns: 3
        items:
          - icon: refresh
            title: "Real-time Sync"
            description: "Changes propagate in under 100ms across all connected clouds."
          - icon: lock
            title: "End-to-end Encryption"
            description: "Your data is encrypted at rest and in transit. Always."
          - icon: chart
            title: "Usage Analytics"
            description: "Track sync volume, latency, and errors from one dashboard."

      - block: pricing-table
        title: "Simple pricing"
        subtitle: "No hidden fees. Scale as you grow."
        tiers:
          - name: "Starter"
            price: "$0"
            period: "/month"
            description: "For side projects."
            features: ["1 connection", "1GB/month", "Community support"]
            cta-label: "Get Started"
            cta-variant: outline
          - name: "Pro"
            price: "$49"
            period: "/month"
            description: "For growing teams."
            features: ["Unlimited connections", "100GB/month", "Priority support", "SSO"]
            cta-label: "Start Trial"
            highlighted: true
          - name: "Enterprise"
            price: "Custom"
            description: "For large organizations."
            features: ["Everything in Pro", "Dedicated support", "SLA", "On-premise option"]
            cta-label: "Contact Sales"
            cta-variant: outline

      - block: cta-banner
        heading: "Ready to unify your cloud?"
        subheading: "Start syncing in under 5 minutes."
        cta-label: "Start Free"
        background: accent-soft

      - block: footer
        variant: multi-column
        logo: "CloudSync"
        tagline: "One API. Every cloud."
        columns:
          - title: "Product"
            links: ["Features", "Pricing", "Changelog"]
          - title: "Resources"
            links: ["Docs", "API Reference", "Status"]
          - title: "Company"
            links: ["About", "Blog", "Careers"]
        copyright: "2026 CloudSync Inc."

  - id: signup
    title: "Sign Up"
    path: "/signup"
    children:
      - block: signup-form
        heading: "Create your account"
        fields: ["name", "email", "password"]
        cta-label: "Create Account"
        social: ["google", "github"]
        footer-text: "Already have an account?"
        footer-link: "Log in"
        next: dashboard

  - id: login
    title: "Log In"
    path: "/login"
    children:
      - block: login-form
        heading: "Welcome back"
        cta-label: "Sign In"
        social: ["google", "github"]
        footer-text: "Don't have an account?"
        footer-link: "Sign up"
        next: dashboard

  - id: dashboard
    title: "Dashboard"
    path: "/dashboard"
    children:
      - block: top-nav
        logo: "CloudSync"
        items:
          - label: "Dashboard"
          - label: "Connections"
          - label: "Logs"

      - block: stat-cards-row
        items:
          - label: "Active Connections"
            value: "8"
            trend: "+2 this week"
          - label: "Data Synced"
            value: "42.8 GB"
            trend: "+12% from last month"
          - label: "Sync Errors"
            value: "0"
            trend: "All clear"
          - label: "Avg Latency"
            value: "47ms"
            trend: "-8ms from last week"

      - block: chart-card
        title: "Sync Volume (Last 30 Days)"
        chart-type: line
        height: 300

      - block: data-table
        title: "Recent Sync Operations"
        columns: ["Timestamp", "Source", "Destination", "Size", "Status"]
        rows:
          - ["2 min ago", "AWS S3", "GCP Storage", "128 MB", "Success"]
          - ["15 min ago", "Azure Blob", "AWS S3", "2.4 GB", "Success"]
          - ["1 hour ago", "GCP Storage", "Azure Blob", "512 MB", "Success"]
        show-search: true
        show-pagination: true
```

---

## Appendix: Quick Reference

### Spacing & sizing cheatsheet

```
Spacing:  none=0  xs=4  sm=8  md=16  lg=24  xl=32  2xl=48  3xl=64
Radius:   none=0  sm=4  md=8  lg=12  xl=16  full=9999
Sizes:    "auto"  "full"  "half"  "1/3"  "2/3"  "1/4"  "3/4"  or pixels
```

### Element children rules

**Can have children:** `stack`, `row`, `grid`, `scroll`, `card`, `section`, `modal`, `bottomsheet`, `list`

**Cannot have children:** `text`, `image`, `icon`, `avatar`, `divider`, `spacer`, `badge`, `chip`, `progress`, `button`, `input`, `textarea`, `checkbox`, `radio`, `toggle`, `select`, `slider`, `placeholder`, `alert`, `toast`, `skeleton`, `empty-state`, `spinner`, `table`, `breadcrumb`, `tabs`, `tabbar`, `annotation`

---

*Riss AI Generation Guide v0.1 — because every great product starts as a sketch.*
