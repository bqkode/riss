# Riss Specification v0.1

> **Riss** (Norwegian: *sketch, outline*) is a YAML-based wireframe description format designed for AI generation and human validation. A `.riss.yaml` file describes one or more application screens as a tree of layout and content elements, producing clean wireframe visualizations.

---

## Table of Contents

1. [Purpose & Design Goals](#1-purpose--design-goals)
2. [File Format](#2-file-format)
3. [Document Structure](#3-document-structure)
4. [Layout System](#4-layout-system)
5. [Styling System](#5-styling-system)
6. [Element Reference](#6-element-reference)
7. [Roles](#7-roles)
8. [Annotations](#8-annotations)
9. [Complete Examples](#9-complete-examples)
10. [AI Generation Guidelines](#10-ai-generation-guidelines)

---

## 1. Purpose & Design Goals

Riss exists to solve a specific problem: when AI generates an application concept, there is no reliable way for a human to **visually validate** what will be built before development begins. Riss bridges this gap.

### Design principles

1. **AI-first authoring** — The format must be trivial for language models to generate correctly. This means predictable structure, minimal ambiguity, and a small set of well-defined elements.
2. **Human-readable** — A non-technical stakeholder should be able to read a `.riss.yaml` file and roughly understand the screen layout.
3. **Visually honest** — Rendered output looks like a wireframe, not a finished UI. This sets correct expectations. Clean lines, grayscale with optional accent color, no decorative styling.
4. **Minimal viable surface** — Fewer element types with composable properties, rather than a large library of specialized components.
5. **Deterministic rendering** — The same file always produces the same visual output. No randomness, no interpretation.

### What Riss is NOT

- Not a design tool or Figma replacement
- Not a UI component library
- Not a prototype with working interactions (v0.1)
- Not a code generator (though downstream tools may consume it)

---

## 2. File Format

### Extension

```
.riss.yaml
```

### Encoding

UTF-8, always.

### YAML version

YAML 1.2. Standard YAML rules apply. Indentation is 2 spaces.

### File size

A single `.riss.yaml` file describes one project/app. It may contain multiple screens. There is no file size limit, but files should remain human-scannable — if a file exceeds ~2000 lines, consider splitting into multiple files with a manifest (future spec version).

### Comments

Standard YAML comments (`#`) are encouraged. They are stripped during parsing and do not appear in rendered output. Use the `annotation` system (section 8) for comments that should be visible on the canvas.

---

## 3. Document Structure

Every `.riss.yaml` file has this top-level structure:

```yaml
riss: "0.1"

meta:
  name: "Project Name"
  description: "Optional project description"
  viewport:
    width: 390
    height: 844
  theme:
    mode: light          # light | dark
    accent: "#2563EB"    # optional accent color (hex)
  roles:                 # optional — define user roles for visibility annotations
    - id: admin
      label: "Admin"
      color: "#DC2626"
    - id: editor
      label: "Editor"
      color: "#2563EB"
    - id: viewer
      label: "Viewer"
      color: "#16A34A"

screens:
  - id: screen_id
    title: "Screen Title"
    role: admin           # optional — restrict entire screen to a role
    children:
      - # ... elements
```

### Top-level fields

| Field | Required | Description |
|-------|----------|-------------|
| `riss` | **Yes** | Spec version string. Must be `"0.1"` for this version. |
| `meta` | **Yes** | Project metadata and defaults. |
| `blocks` | No | Array of custom block definitions. See [Custom Blocks](blocks/custom-blocks.md). |
| `screens` | **Yes** | Array of screen definitions. Must contain at least one screen. |

### `meta` object

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `meta.name` | **Yes** | — | Project or app name. |
| `meta.description` | No | `null` | Brief description of the project. |
| `meta.viewport` | No | `{ width: 390, height: 844 }` | Default viewport size in pixels. 390×844 = iPhone 14 equivalent. |
| `meta.viewport.width` | No | `390` | Viewport width in pixels. |
| `meta.viewport.height` | No | `844` | Viewport height in pixels. |
| `meta.theme` | No | `{ mode: light }` | Visual theme settings. |
| `meta.theme.mode` | No | `light` | Color scheme: `light` or `dark`. |
| `meta.theme.accent` | No | `"#2563EB"` | Accent color as hex. Used by elements that reference the `accent` color token. |
| `meta.roles` | No | `[]` | Array of role definitions for role-based visibility. See [Roles](#7-roles). |
| `meta.roles[].id` | **Yes** (if roles defined) | — | Unique role identifier. Snake_case. |
| `meta.roles[].label` | **Yes** (if roles defined) | — | Human-readable role name. |
| `meta.roles[].color` | **Yes** (if roles defined) | — | Hex color used to visually mark elements restricted to this role. |

#### Common viewport presets

| Device | Width | Height |
|--------|-------|--------|
| iPhone (standard) | 390 | 844 |
| iPhone SE | 375 | 667 |
| Android (standard) | 412 | 915 |
| iPad | 820 | 1180 |
| Desktop (laptop) | 1440 | 900 |
| Desktop (wide) | 1920 | 1080 |

### `screens` array

Each screen is an object:

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `id` | **Yes** | — | Unique identifier. Snake_case. Used for referencing and export filenames. |
| `title` | **Yes** | — | Screen name. Rendered as a label **above** the screen frame on the canvas. |
| `path` | No | — | URL path or route (e.g., `/login`, `/products/:id`). Rendered below the title in the canvas header. |
| `viewport` | No | Inherits from `meta.viewport` | Override viewport size for this specific screen. |
| `background` | No | `background` token | Background color for the screen. |
| `statusbar` | No | `true` | Whether to render a device status bar at the top (mobile viewports only). |
| `role` | No | — | Role id or array of role ids. Restricts the entire screen to the specified role(s). See [Roles](#7-roles). |
| `children` | **Yes** | `[]` | Array of child elements. This is the element tree. |

#### Screen canvas header

The renderer draws a **canvas header** above each screen frame. This header is outside the screen viewport — it is metadata about the screen, not content within it.

```
  Login                       ← title (bold, larger)
  /auth/login                 ← path (muted, monospace)
  ┌────────────────────────┐
  │ 9:41              ▐▐▐▐ │  ← status bar (if enabled)
  │                        │
  │  ... screen content ... │
  │                        │
  └────────────────────────┘
```

- **`title`** is always rendered. It uses bold text at a size larger than body.
- **`path`** is optional. When present, it renders below the title in monospace, `text-secondary` color. For mobile screens this represents a route; for web screens it represents the URL path.
- If the screen has a `role`, the role badge(s) render in the canvas header, right-aligned beside the title.

---

## 4. Layout System

Riss uses a flexbox-inspired layout model. Every element that accepts `children` is a layout container.

### Layout direction

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| `layout` | `stack`, `row`, `grid` | `stack` | How children are arranged. |

- **`stack`** — Children are arranged vertically, top to bottom (flex column).
- **`row`** — Children are arranged horizontally, left to right (flex row).
- **`grid`** — Children are arranged in a grid. Requires `columns` property.

### Alignment

| Property | Values | Default | Description |
|----------|--------|---------|-------------|
| `align` | `start`, `center`, `end`, `stretch` | `stretch` | Cross-axis alignment of children. |
| `justify` | `start`, `center`, `end`, `between`, `around`, `evenly` | `start` | Main-axis distribution of children. |
| `align-self` | `start`, `center`, `end`, `stretch` | Inherits | Override parent alignment for this element. |

### Sizing

| Property | Accepted values | Default | Description |
|----------|----------------|---------|-------------|
| `width` | Number, fraction string, `"full"`, `"auto"` | `"auto"` | Element width. |
| `height` | Number, fraction string, `"full"`, `"auto"` | `"auto"` | Element height. |
| `min-width` | Number | — | Minimum width in pixels. |
| `min-height` | Number | — | Minimum height in pixels. |
| `max-width` | Number | — | Maximum width in pixels. |
| `max-height` | Number | — | Maximum height in pixels. |
| `grow` | Number (0+) | `0` | Flex grow factor. |
| `shrink` | Number (0+) | `1` | Flex shrink factor. |

#### Size value types

| Value | Meaning | Example |
|-------|---------|---------|
| `number` | Pixels | `width: 200` |
| `"full"` | 100% of parent | `width: "full"` |
| `"half"` | 50% of parent | `width: "half"` |
| `"auto"` | Size to content | `width: "auto"` |
| `"1/3"` | 33.33% | `width: "1/3"` |
| `"2/3"` | 66.67% | `width: "2/3"` |
| `"1/4"` | 25% | `width: "1/4"` |
| `"3/4"` | 75% | `width: "3/4"` |

### Spacing

| Property | Accepted values | Default | Description |
|----------|----------------|---------|-------------|
| `padding` | Spacing value | `none` | Inner spacing. |
| `padding-x` | Spacing value | — | Horizontal padding (overrides `padding` on x-axis). |
| `padding-y` | Spacing value | — | Vertical padding (overrides `padding` on y-axis). |
| `margin` | Spacing value | `none` | Outer spacing. |
| `margin-x` | Spacing value | — | Horizontal margin. |
| `margin-y` | Spacing value | — | Vertical margin. |
| `gap` | Spacing value | `none` | Space between children (for containers). |

#### Spacing scale

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

A raw number is also accepted and interpreted as pixels: `padding: 12`.

### Grid-specific properties

| Property | Accepted values | Default | Description |
|----------|----------------|---------|-------------|
| `columns` | Number (1-12) | `2` | Number of grid columns. |
| `column-gap` | Spacing value | Inherits `gap` | Horizontal gap between grid cells. |
| `row-gap` | Spacing value | Inherits `gap` | Vertical gap between grid rows. |
| `span` | Number (1-12) | `1` | How many columns a child spans (set on child). |

---

## 5. Styling System

### Color tokens

Riss uses a semantic color token system. The renderer maps these tokens to actual colors based on `theme.mode`.

| Token | Light mode | Dark mode | Usage |
|-------|-----------|-----------|-------|
| `background` | `#FFFFFF` | `#1A1A1A` | Screen/page background. |
| `surface` | `#F5F5F5` | `#2A2A2A` | Card/container backgrounds. |
| `surface-raised` | `#FFFFFF` | `#333333` | Elevated surfaces (modals, popovers). |
| `text` | `#1A1A1A` | `#F5F5F5` | Primary text. |
| `text-secondary` | `#6B7280` | `#9CA3AF` | Secondary/muted text. |
| `text-disabled` | `#D1D5DB` | `#4B5563` | Disabled text. |
| `border` | `#E5E7EB` | `#374151` | Default border color. |
| `border-strong` | `#9CA3AF` | `#6B7280` | Emphasized border color. |
| `accent` | From `meta.theme.accent` | From `meta.theme.accent` | Primary action color. |
| `accent-soft` | Accent at 15% opacity | Accent at 15% opacity | Accent background tint. |
| `success` | `#16A34A` | `#22C55E` | Success states. |
| `warning` | `#D97706` | `#F59E0B` | Warning states. |
| `error` | `#DC2626` | `#EF4444` | Error states. |
| `placeholder` | `#E5E7EB` | `#374151` | Image/content placeholders. |

Elements accept color tokens by name or raw hex values:

```yaml
- type: text
  color: text-secondary     # token reference
- type: card
  background: "#FFF8E1"     # raw hex (use sparingly)
```

### Border

| Property | Accepted values | Default | Description |
|----------|----------------|---------|-------------|
| `border` | `true`, `false`, color token, or object | `false` | Border rendering. |
| `border.color` | Color token or hex | `border` | Border color. |
| `border.width` | Number | `1` | Border width in pixels. |
| `border.style` | `solid`, `dashed` | `solid` | Border style. |
| `border.sides` | `all`, `top`, `bottom`, `left`, `right` or array | `all` | Which sides to render. |

Shorthand: `border: true` applies a 1px solid `border`-colored border on all sides.

### Border radius

| Property | Accepted values | Default |
|----------|----------------|---------|
| `rounded` | `none`, `sm`, `md`, `lg`, `xl`, `full` | `none` |

| Token | Pixels |
|-------|--------|
| `none` | 0 |
| `sm` | 4 |
| `md` | 8 |
| `lg` | 12 |
| `xl` | 16 |
| `full` | 9999 (circular) |

### Shadow / elevation

| Property | Accepted values | Default |
|----------|----------------|---------|
| `elevation` | `none`, `sm`, `md`, `lg` | `none` |

Elevation renders as a subtle drop shadow in the wireframe. Used sparingly — primarily for `card` and `modal` elements.

### Overflow

| Property | Accepted values | Default |
|----------|----------------|---------|
| `overflow` | `visible`, `hidden`, `scroll` | `visible` |

Setting `overflow: scroll` renders scroll indicators in the wireframe.

---

## 6. Element Reference

### Navigation (`next`)

Any element or block can declare a `next` property to indicate navigation to another screen:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `next` | String \| String[] | — | Target screen id(s). Creates a flow arrow from this element to the target screen(s). |

```yaml
- type: button
  label: "Sign up"
  next: signup          # clicking this navigates to the signup screen
```

Flow arrows originate from the element's position, not the screen center. See [Screen Navigation & Flows](AI_GENERATION_GUIDE.md#5-screen-navigation--flows) for details.

### 6.1 Layout elements

These elements exist primarily to arrange children.

---

#### `stack`

Vertical container. Children flow top to bottom.

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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `gap` | Spacing | `none` | Vertical space between children. |
| `align` | Alignment | `stretch` | Horizontal alignment of children. |
| `justify` | Justification | `start` | Vertical distribution. |
| All common properties apply. ||||

---

#### `row`

Horizontal container. Children flow left to right.

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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `gap` | Spacing | `none` | Horizontal space between children. |
| `align` | Alignment | `center` | Vertical alignment of children. |
| `justify` | Justification | `start` | Horizontal distribution. |
| `wrap` | Boolean | `false` | Whether children wrap to next line. |
| All common properties apply. ||||

---

#### `grid`

Grid container.

```yaml
- type: grid
  columns: 2
  gap: md
  children:
    - type: card
      children:
        - type: text
          content: "Cell 1"
    - type: card
      children:
        - type: text
          content: "Cell 2"
    - type: card
      span: 2
      children:
        - type: text
          content: "Full width cell"
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `columns` | Number (1-12) | `2` | Number of columns. |
| `gap` | Spacing | `none` | Gap between cells. |
| `column-gap` | Spacing | — | Override horizontal gap. |
| `row-gap` | Spacing | — | Override vertical gap. |

Children can set `span: N` to span multiple columns.

---

#### `scroll`

Scrollable container. Renders with a scroll indicator.

```yaml
- type: scroll
  direction: horizontal
  height: 120
  children:
    - type: card
      width: 200
    - type: card
      width: 200
    - type: card
      width: 200
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `direction` | `vertical`, `horizontal` | `vertical` | Scroll direction. |

Children are laid out as `stack` (vertical) or `row` (horizontal) based on direction.

---

### 6.2 Container elements

Containers add visual boundaries around their children.

---

#### `card`

A bordered, optionally elevated container.

```yaml
- type: card
  padding: md
  elevation: sm
  children:
    - type: text
      variant: h3
      content: "Card Title"
    - type: text
      content: "Card body text goes here."
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `outlined`, `elevated`, `filled` | `outlined` | Visual style. |
| `padding` | Spacing | `md` | Inner padding. |
| `rounded` | Radius | `md` | Corner radius. |
| `elevation` | Elevation | Depends on variant | Shadow level. |
| `background` | Color | `surface` for filled, transparent for outlined | Background color. |
| `border` | Boolean/object | `true` for outlined | Border. |

Variant defaults:
- `outlined` → border: true, elevation: none, background: transparent
- `elevated` → border: false, elevation: md, background: surface-raised
- `filled` → border: false, elevation: none, background: surface

---

#### `section`

A semantic grouping with an optional title. Does not render a visible boundary — use for logical grouping.

```yaml
- type: section
  title: "Recent Activity"
  children:
    - type: list
      children:
        - type: list-item
          title: "Item 1"
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | String | — | Section heading. Rendered as a label above children. |
| `title-variant` | Text variant | `label` | Typography variant for the title. |

---

#### `modal`

An overlay dialog. Rendered as a centered card on a dimmed backdrop.

```yaml
- type: modal
  title: "Confirm Delete"
  children:
    - type: text
      content: "Are you sure you want to delete this item?"
    - type: row
      gap: sm
      justify: end
      children:
        - type: button
          label: "Cancel"
          variant: outline
        - type: button
          label: "Delete"
          variant: primary
          color: error
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | String | — | Modal header title. |
| `width` | Size | `"2/3"` | Modal width relative to viewport. |
| `closable` | Boolean | `true` | Whether to render a close (×) button. |

---

#### `bottomsheet`

A bottom-anchored overlay panel.

```yaml
- type: bottomsheet
  title: "Options"
  height: "half"
  children:
    - type: list
      children:
        - type: list-item
          leading: icon:share
          title: "Share"
        - type: list-item
          leading: icon:edit
          title: "Edit"
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | String | — | Sheet header title. |
| `height` | `"auto"`, `"half"`, `"full"`, Number | `"auto"` | Sheet height. |
| `handle` | Boolean | `true` | Whether to render a drag handle. |

---

### 6.3 Content elements

These elements display content and do not accept children.

---

#### `text`

Text content with typography variants.

```yaml
- type: text
  variant: h1
  content: "Welcome Back"

- type: text
  variant: body
  content: "This is a paragraph of body text that explains something useful."
  color: text-secondary
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | **String (required)** | — | The text to display. |
| `variant` | `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `body`, `body-sm`, `caption`, `label`, `overline`, `code` | `body` | Typography style. |
| `weight` | `normal`, `medium`, `semibold`, `bold` | Depends on variant | Font weight. |
| `align` | `left`, `center`, `right` | `left` | Text alignment. |
| `color` | Color token or hex | `text` | Text color. |
| `max-lines` | Number | — | Truncate with ellipsis after N lines. |

Typography scale (rendered sizes):

| Variant | Size | Weight | Line height |
|---------|------|--------|-------------|
| `h1` | 32px | bold | 1.2 |
| `h2` | 24px | bold | 1.25 |
| `h3` | 20px | semibold | 1.3 |
| `h4` | 18px | semibold | 1.35 |
| `h5` | 16px | semibold | 1.4 |
| `h6` | 14px | semibold | 1.4 |
| `body` | 16px | normal | 1.5 |
| `body-sm` | 14px | normal | 1.5 |
| `caption` | 12px | normal | 1.4 |
| `label` | 12px | medium | 1.3 |
| `overline` | 10px | semibold | 1.5 |
| `code` | 14px | normal (mono) | 1.5 |

---

#### `image`

An image placeholder. Renders as a filled rectangle with an image icon and optional label.

```yaml
- type: image
  aspect: 16/9
  label: "Hero Banner"
  rounded: md
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `aspect` | String (`"W/H"`) or Number | — | Aspect ratio. E.g. `"16/9"`, `"1/1"`, `"4/3"`. |
| `width` | Size | `"full"` | Width. If aspect is set, height is calculated. |
| `height` | Size | — | Explicit height. Overrides aspect ratio. |
| `label` | String | — | Text label rendered centered on the placeholder. |
| `background` | Color | `placeholder` | Placeholder background color. |
| `rounded` | Radius | `none` | Corner radius. |
| `icon` | Boolean | `true` | Whether to render a centered image icon. |

---

#### `icon`

An icon placeholder. Renders as a named icon glyph (from a standard wireframe icon set) or as a small labeled square if the name is unrecognized.

```yaml
- type: icon
  name: heart
  size: 24
  color: accent
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | **String (required)** | — | Icon name from the icon set. |
| `size` | Number | `20` | Icon size in pixels (square). |
| `color` | Color token or hex | `text` | Icon color. |

Standard icon names (v0.1 — renderers should support at minimum these):

`home`, `search`, `settings`, `user`, `users`, `bell`, `mail`, `heart`, `star`, `bookmark`,
`share`, `edit`, `trash`, `plus`, `minus`, `close`, `check`, `chevron-left`, `chevron-right`,
`chevron-up`, `chevron-down`, `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down`,
`menu`, `more-horizontal`, `more-vertical`, `filter`, `sort`, `download`, `upload`,
`camera`, `image`, `video`, `mic`, `phone`, `map-pin`, `clock`, `calendar`, `link`,
`lock`, `unlock`, `eye`, `eye-off`, `info`, `help`, `warning`, `error`,
`play`, `pause`, `skip-forward`, `skip-back`, `refresh`, `copy`, `file`, `folder`,
`chart`, `globe`, `inbox`, `dollar-sign`, `credit-card`, `shield`, `zap`, `code`

Unrecognized icon names render as a small square with the name as a tooltip.

---

#### `avatar`

A circular image placeholder representing a user.

```yaml
- type: avatar
  size: 48
  initials: "BQ"
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | Number | `40` | Diameter in pixels. |
| `initials` | String | — | 1-2 character initials to display. |
| `color` | Color | `placeholder` | Background color. |

---

#### `divider`

A horizontal or vertical line separator.

```yaml
- type: divider
  margin-y: sm
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `direction` | `horizontal`, `vertical` | `horizontal` | Line direction. |
| `color` | Color | `border` | Line color. |
| `thickness` | Number | `1` | Line thickness in pixels. |

---

#### `spacer`

An invisible element that takes up space. Useful for pushing elements apart.

```yaml
- type: row
  children:
    - type: text
      content: "Left"
    - type: spacer
    - type: text
      content: "Right"
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | Number or Spacing | — | Fixed size in pixels. If omitted, spacer is flexible (grow: 1). |

---

#### `badge`

A small counter or status indicator.

```yaml
- type: badge
  content: "3"
  color: error
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | String | — | Badge text (1-3 characters). If omitted, renders as a dot. |
| `color` | Color | `error` | Background color. |

---

#### `chip`

A small labeled tag.

```yaml
- type: chip
  label: "Outdoor"
  variant: outlined
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | **String (required)** | — | Chip text. |
| `variant` | `filled`, `outlined` | `filled` | Visual style. |
| `color` | Color | `surface` (filled), `border` (outlined) | Background/border color. |
| `removable` | Boolean | `false` | Whether to show an × icon. |

---

#### `progress`

A progress bar.

```yaml
- type: progress
  value: 65
  color: accent
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | Number (0-100) | `0` | Progress percentage. |
| `height` | Number | `4` | Bar height in pixels. |
| `color` | Color | `accent` | Fill color. |
| `background` | Color | `surface` | Track color. |
| `rounded` | Boolean | `true` | Whether bar is rounded. |
| `label` | String | — | Optional text label shown above/beside the bar. |

---

### 6.4 Interactive elements

These render as interactive controls in wireframe style. They are static in v0.1 — no actual interactivity.

---

#### `button`

```yaml
- type: button
  label: "Get Started"
  variant: primary
  size: lg
  full-width: true
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | **String (required)** | — | Button text. |
| `variant` | `primary`, `secondary`, `outline`, `ghost`, `text` | `primary` | Visual style. |
| `size` | `sm`, `md`, `lg` | `md` | Button size. |
| `color` | Color | `accent` (primary), `text` (others) | Button color. |
| `leading-icon` | String | — | Icon name before label. |
| `trailing-icon` | String | — | Icon name after label. |
| `icon-only` | Boolean | `false` | If true, render as icon button (requires `leading-icon`). |
| `full-width` | Boolean | `false` | Whether button stretches to container width. |
| `disabled` | Boolean | `false` | Render in disabled style. |

Variant rendering:
- `primary` — Filled background with `accent` color, white text.
- `secondary` — Filled background with `surface` color, default text.
- `outline` — Border only, transparent background.
- `ghost` — No border or background. Text only, hover-implied.
- `text` — Like ghost but with underline on text.

---

#### `input`

A text input field.

```yaml
- type: input
  placeholder: "Search..."
  leading-icon: search
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | String | — | Placeholder text. |
| `value` | String | — | Pre-filled value text. |
| `label` | String | — | Label text above the input. |
| `helper` | String | — | Helper text below the input. |
| `error` | String | — | Error message (renders in error color). |
| `leading-icon` | String | — | Icon inside the input, before text. |
| `trailing-icon` | String | — | Icon inside the input, after text. |
| `variant` | `outlined`, `filled`, `underline` | `outlined` | Visual style. |
| `disabled` | Boolean | `false` | Render as disabled. |
| `required` | Boolean | `false` | Show required indicator (*). |

---

#### `textarea`

A multi-line text input.

```yaml
- type: textarea
  placeholder: "Write your message..."
  rows: 4
  label: "Message"
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | String | — | Placeholder text. |
| `value` | String | — | Pre-filled value. |
| `label` | String | — | Label text. |
| `rows` | Number | `3` | Number of visible text rows. |
| `helper` | String | — | Helper text. |
| `error` | String | — | Error message. |

---

#### `checkbox`

```yaml
- type: checkbox
  label: "I agree to the terms"
  checked: false
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | **String (required)** | — | Checkbox label. |
| `checked` | Boolean | `false` | Whether rendered as checked. |
| `disabled` | Boolean | `false` | Render as disabled. |

---

#### `radio`

A radio button group.

```yaml
- type: radio
  label: "Delivery method"
  options:
    - "Standard (3-5 days)"
    - "Express (1-2 days)"
    - "Same day"
  selected: 0
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | — | Group label. |
| `options` | **String[] (required)** | — | List of option labels. |
| `selected` | Number | — | Index of selected option (0-based). `null` = none selected. |
| `direction` | `vertical`, `horizontal` | `vertical` | Layout direction. |

---

#### `toggle`

A switch/toggle control.

```yaml
- type: toggle
  label: "Dark mode"
  checked: true
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | **String (required)** | — | Toggle label. |
| `checked` | Boolean | `false` | Whether rendered as on. |
| `disabled` | Boolean | `false` | Render as disabled. |

---

#### `select`

A dropdown select control.

```yaml
- type: select
  label: "Country"
  placeholder: "Choose..."
  options:
    - "Norway"
    - "Sweden"
    - "Denmark"
  selected: 0
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | — | Label text. |
| `placeholder` | String | — | Placeholder when nothing selected. |
| `options` | **String[] (required)** | — | Dropdown options. |
| `selected` | Number | — | Index of selected option. |
| `error` | String | — | Error message. |

---

#### `slider`

A range slider.

```yaml
- type: slider
  label: "Volume"
  min: 0
  max: 100
  value: 75
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | — | Label text. |
| `min` | Number | `0` | Minimum value. |
| `max` | Number | `100` | Maximum value. |
| `value` | Number | `50` | Current value. |
| `show-value` | Boolean | `true` | Display current value. |

---

### 6.5 Navigation elements

---

#### `navbar`

A top navigation bar.

```yaml
- type: navbar
  title: "Settings"
  leading: icon:arrow-left
  trailing:
    - icon:search
    - icon:more-vertical
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | String | — | Center title text. |
| `subtitle` | String | — | Subtitle below title. |
| `leading` | String or element | — | Left side content. Shortcuts: `"icon:NAME"`, `"avatar"`, `"menu"`. |
| `trailing` | String, element, or array | — | Right side content. Same shortcuts as leading. |
| `background` | Color | `background` | Bar background. |
| `border-bottom` | Boolean | `true` | Bottom border. |
| `elevated` | Boolean | `false` | Subtle elevation shadow. |

The navbar is always rendered at the **top of the screen**, full width, with a fixed height of 56px.

> **See also:** For a richer top navigation bar with logo, links, CTA, and search (typical for marketing/desktop pages), see the [`top-nav`](blocks/navigation.md) RissBlock.

---

#### `tabbar`

A bottom tab bar.

```yaml
- type: tabbar
  items:
    - icon: home
      label: "Home"
      active: true
    - icon: search
      label: "Search"
    - icon: plus
      label: "Create"
    - icon: heart
      label: "Saved"
    - icon: user
      label: "Profile"
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | **Array (required)** | — | Tab items. |
| `items[].icon` | String | — | Icon name. |
| `items[].label` | String | — | Tab label. |
| `items[].active` | Boolean | `false` | Whether this tab is active. |
| `items[].badge` | String or Number | — | Badge content on the tab. |
| `background` | Color | `background` | Bar background. |

The tabbar is always rendered at the **bottom of the screen**, full width, with a fixed height of 56px + safe area.

> **See also:** For a parameterized bottom navigation bar with badges and variants, see the [`bottom-nav`](blocks/navigation.md) RissBlock.

---

#### `tabs`

An inline tab strip (not bottom navigation).

```yaml
- type: tabs
  items:
    - label: "Overview"
      active: true
    - label: "Details"
    - label: "Reviews"
  variant: underline
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | **Array (required)** | — | Tab items. |
| `items[].label` | String | — | Tab label. |
| `items[].active` | Boolean | `false` | Whether active. |
| `variant` | `underline`, `filled`, `pill` | `underline` | Tab style. |

---

#### `breadcrumb`

```yaml
- type: breadcrumb
  items:
    - "Home"
    - "Products"
    - "Running Shoes"
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | **String[] (required)** | — | Breadcrumb path items. Last item is rendered as current/bold. |
| `separator` | String | `"/"` | Separator character. |

---

### 6.6 Data display elements

---

#### `list`

A list container. Children should be `list-item` elements.

```yaml
- type: list
  dividers: true
  children:
    - type: list-item
      leading: avatar
      title: "Ola Nordmann"
      subtitle: "Online now"
      trailing: icon:chevron-right
    - type: list-item
      leading: avatar
      title: "Kari Nordmann"
      subtitle: "Last seen 2h ago"
      trailing: icon:chevron-right
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dividers` | Boolean | `true` | Render divider lines between items. |
| `inset-dividers` | Boolean | `false` | Inset dividers to align with text (skip leading area). |

---

#### `list-item`

An individual list item with structured content zones.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | **String (required)** | — | Primary text. |
| `subtitle` | String | — | Secondary text below title. |
| `leading` | String or element | — | Left content. Shortcuts: `"avatar"`, `"icon:NAME"`, `"checkbox"`, `"image"`. |
| `trailing` | String or element | — | Right content. Shortcuts: `"icon:NAME"`, `"toggle"`, `"badge:N"`, `"text:VALUE"`. |
| `size` | `sm`, `md`, `lg` | `md` | Item height. |

---

#### `table`

A data table.

```yaml
- type: table
  columns:
    - label: "Name"
      width: "1/3"
    - label: "Role"
      width: "1/3"
    - label: "Status"
      width: "1/3"
  rows:
    - ["Alice", "Admin", "Active"]
    - ["Bob", "Editor", "Inactive"]
    - ["Carol", "Viewer", "Active"]
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `columns` | **Array (required)** | — | Column definitions. |
| `columns[].label` | String | — | Column header text. |
| `columns[].width` | Size | Equal distribution | Column width. |
| `columns[].align` | `left`, `center`, `right` | `left` | Text alignment. |
| `rows` | **Array[] (required)** | — | Row data. Each row is an array of strings matching column count. |
| `striped` | Boolean | `false` | Alternate row backgrounds. |
| `border` | Boolean | `true` | Table borders. |

> **See also:** For a full-featured data table with search, filters, pagination, and bulk actions, see the [`data-table`](blocks/dashboard.md) RissBlock.

---

#### `placeholder`

A generic content placeholder. Use for complex content areas that don't have a specific element type (maps, charts, video players, etc.).

```yaml
- type: placeholder
  label: "Interactive Map"
  icon: map-pin
  aspect: 4/3
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | `"Content"` | Descriptive label. |
| `icon` | String | — | Icon name to render centered. |
| `aspect` | String | — | Aspect ratio. |
| `height` | Size | `200` | Height if no aspect ratio. |
| `background` | Color | `placeholder` | Background color. |

---

### 6.7 Feedback elements

---

#### `alert`

A banner/alert message.

```yaml
- type: alert
  variant: warning
  title: "Connection unstable"
  message: "Some features may not work correctly."
  dismissable: true
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `info`, `success`, `warning`, `error` | `info` | Alert type (determines color). |
| `title` | String | — | Alert title. |
| `message` | String | — | Alert body text. |
| `dismissable` | Boolean | `false` | Show dismiss (×) button. |
| `icon` | Boolean | `true` | Show variant-appropriate icon. |

---

#### `toast`

A toast notification (rendered floating at bottom of screen).

```yaml
- type: toast
  message: "Item saved successfully"
  variant: success
  action: "Undo"
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `message` | **String (required)** | — | Toast text. |
| `variant` | `default`, `success`, `error` | `default` | Color style. |
| `action` | String | — | Action button label. |

---

#### `skeleton`

A loading skeleton placeholder. Renders as animated shimmer blocks.

```yaml
- type: skeleton
  variant: text
  lines: 3

- type: skeleton
  variant: card
  height: 200

- type: skeleton
  variant: avatar
  size: 48
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `text`, `rect`, `circle`, `card`, `avatar`, `list-item` | `rect` | Shape of skeleton. |
| `lines` | Number | `1` | Number of text lines (for `text` variant). |
| `width` | Size | `"full"` | Width. |
| `height` | Size | Depends on variant | Height. |
| `size` | Number | — | For circle/avatar, the diameter. |

> **See also:** For a complete skeleton loading pattern (multiple skeletons arranged as a card-grid, list, form, etc.), see the [`loading-skeleton`](blocks/feedback.md) RissBlock.

---

#### `empty-state`

An empty state message with icon and optional action.

```yaml
- type: empty-state
  icon: inbox
  title: "No messages yet"
  message: "When you receive messages, they'll appear here."
  action: "Compose"
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `icon` | String | — | Icon name. |
| `title` | String | — | Empty state heading. |
| `message` | String | — | Descriptive text. |
| `action` | String | — | CTA button label. |

> **See also:** For a full-page empty state with structured heading, body, details, and CTA, see the [`empty-state-block`](blocks/feedback.md) RissBlock.

---

#### `spinner`

A loading spinner.

```yaml
- type: spinner
  size: 32
  color: accent
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | Number | `24` | Spinner diameter. |
| `color` | Color | `text-secondary` | Spinner color. |

---

## 7. Roles

Roles allow you to annotate which user types can see or access specific screens, elements, or blocks. This is a **visual communication tool** — roles do not enforce access control, they communicate intent on the wireframe so stakeholders can validate that the right content is shown to the right users.

### Defining roles

Roles are defined in `meta.roles`. Each role has a unique `id`, a human-readable `label`, and a `color` that the renderer uses to visually distinguish role-restricted elements.

```yaml
meta:
  name: "MyApp"
  roles:
    - id: admin
      label: "Admin"
      color: "#DC2626"    # red
    - id: editor
      label: "Editor"
      color: "#2563EB"    # blue
    - id: viewer
      label: "Viewer"
      color: "#16A34A"    # green
    - id: guest
      label: "Guest"
      color: "#9333EA"    # purple
```

### Applying roles

The `role` property can be set on **any element, any screen, and any block**. It accepts a single role id or an array of role ids.

```yaml
# Restrict an entire screen
screens:
  - id: admin_dashboard
    title: "Admin Dashboard"
    role: admin
    children: [...]

# Restrict a specific element
- type: button
  label: "Delete User"
  variant: primary
  color: error
  role: admin

# Restrict to multiple roles
- type: section
  title: "Edit Panel"
  role: [admin, editor]
  children: [...]

# Restrict a block
- block: data-table
  title: "User Management"
  role: admin
  columns: [...]
```

### Rendering behavior

When an element has a `role` property, the renderer MUST:

1. **Draw a colored outline** around the element using the role's `color`. The outline should be clearly visible but not interfere with the wireframe content — a 2px dashed border is recommended.
2. **Show a role badge** — a small label with the role name, positioned at the top-right corner of the element, using the role's color as background with white text.
3. **Render a role legend** — at the bottom or side of each screen, list all roles used on that screen with their color swatches and labels.

When multiple roles are assigned (`role: [admin, editor]`), the renderer should:
- Show all role badges stacked or inline.
- Use a multi-colored dashed outline (alternating segments) or a single outline with the first role's color and all role badges displayed.

#### Visual example (conceptual)

```
┌─────────────────────────────────┐
│  User List                      │  ← no role (visible to all)
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  ╎ [Admin]        Delete All ╎  │  ← red dashed outline, "Admin" badge
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                                 │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │
│  ╎ [Admin] [Editor]         ╎  │  ← blue dashed outline, both badges
│  ╎ Edit User Details        ╎  │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │
│                                 │
│  ──────────────────────────     │
│  Roles: ● Admin  ● Editor      │  ← role legend
└─────────────────────────────────┘
```

### Inheritance

Roles do **not** inherit. A child element inside a role-restricted parent does not automatically carry that role. Each `role` annotation is independent — it marks exactly the element it's set on.

However, if a **screen** has a `role`, the entire screen (including all children) is considered restricted to that role. The renderer draws the role badge on the screen frame itself rather than on every child.

### Elements without roles

Elements without a `role` property are considered **visible to all users**. No outline or badge is rendered. This is the default for the vast majority of elements.

### Validation rules

1. Every `role` value must reference a role `id` defined in `meta.roles`.
2. `meta.roles[].id` must be unique, snake_case, alphanumeric + underscores.
3. `meta.roles[].color` must be a valid hex string (`#RGB`, `#RRGGBB`, `#RRGGBBAA`).
4. If `role` is used anywhere in the file, `meta.roles` must be defined and non-empty.

---

## 8. Annotations

Annotations are comments that render visually on the wireframe canvas. They are the primary mechanism for communicating design intent, requirements, or clarifications.

### Inline annotations

Any element can have an `annotation` property. The renderer draws a small numbered marker on the element and lists the annotation text in a sidebar or footer.

```yaml
- type: button
  label: "Submit"
  variant: primary
  annotation: "Must validate all required fields before enabling"
```

### Standalone annotations

A dedicated `annotation` element can be placed anywhere in the tree. It renders as a callout on the canvas.

```yaml
- type: annotation
  content: "This section should pull data from the user's activity feed API"
  position: top-right
  color: warning
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `content` | **String (required)** | — | Annotation text. |
| `position` | `top-left`, `top-right`, `bottom-left`, `bottom-right`, `inline` | `inline` | Where the callout is anchored relative to its position in the tree. |
| `color` | `default`, `info`, `warning`, `accent` | `default` | Callout color. |

### Annotation numbering

The renderer auto-numbers annotations sequentially (①, ②, ③...) across the entire screen. A legend is rendered below or beside the screen with the full annotation text.

---

## 9. Complete Examples

### Example 1: Mobile Login Screen

```yaml
riss: "0.1"

meta:
  name: "MyApp"
  viewport: { width: 390, height: 844 }
  theme:
    mode: light
    accent: "#6366F1"

screens:
  - id: login
    title: "Login"
    path: "/auth/login"
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
                name: lock
                size: 48
                color: accent
              - type: text
                variant: h2
                content: "Welcome Back"
                align: center
              - type: text
                variant: body
                content: "Sign in to continue"
                color: text-secondary
                align: center

          - type: spacer
            size: 16

          - type: input
            label: "Email"
            placeholder: "you@example.com"
            leading-icon: mail

          - type: input
            label: "Password"
            placeholder: "••••••••"
            leading-icon: lock
            trailing-icon: eye-off
            annotation: "Minimum 8 characters. Show/hide toggle required."

          - type: row
            justify: between
            align: center
            children:
              - type: checkbox
                label: "Remember me"
              - type: button
                label: "Forgot password?"
                variant: text
                size: sm

          - type: button
            label: "Sign In"
            variant: primary
            size: lg
            full-width: true

          - type: divider
            margin-y: sm

          - type: button
            label: "Continue with Google"
            variant: outline
            size: lg
            full-width: true
            leading-icon: link
            annotation: "OAuth 2.0 — redirect to Google consent screen"

          - type: spacer

          - type: row
            justify: center
            gap: xs
            children:
              - type: text
                variant: body-sm
                content: "Don't have an account?"
                color: text-secondary
              - type: button
                label: "Sign Up"
                variant: text
                size: sm
```

### Example 2: Dashboard with Data

```yaml
riss: "0.1"

meta:
  name: "AdminPanel"
  viewport: { width: 1440, height: 900 }
  theme:
    mode: light
    accent: "#2563EB"

screens:
  - id: dashboard
    title: "Dashboard"
    path: "/dashboard"
    children:
      - type: row
        height: "full"
        children:
          # Sidebar
          - type: stack
            width: 260
            background: surface
            border:
              sides: right
            padding-y: lg
            children:
              - type: row
                padding-x: lg
                gap: sm
                align: center
                children:
                  - type: icon
                    name: folder
                    color: accent
                    size: 24
                  - type: text
                    variant: h4
                    content: "AdminPanel"

              - type: spacer
                size: 24

              - type: list
                dividers: false
                children:
                  - type: list-item
                    leading: "icon:home"
                    title: "Dashboard"
                    size: sm
                  - type: list-item
                    leading: "icon:users"
                    title: "Users"
                    size: sm
                  - type: list-item
                    leading: "icon:file"
                    title: "Reports"
                    size: sm
                  - type: list-item
                    leading: "icon:settings"
                    title: "Settings"
                    size: sm

              - type: spacer

              - type: row
                padding: lg
                gap: sm
                align: center
                children:
                  - type: avatar
                    size: 32
                    initials: "BQ"
                  - type: stack
                    gap: none
                    children:
                      - type: text
                        variant: body-sm
                        content: "Bear"
                        weight: medium
                      - type: text
                        variant: caption
                        content: "Admin"
                        color: text-secondary

          # Main content
          - type: stack
            grow: 1
            children:
              # Top bar
              - type: row
                padding: lg
                padding-x: xl
                align: center
                border:
                  sides: bottom
                children:
                  - type: text
                    variant: h3
                    content: "Dashboard"
                  - type: spacer
                  - type: input
                    placeholder: "Search..."
                    leading-icon: search
                    width: 280
                  - type: spacer
                    size: 16
                  - type: icon
                    name: bell
                    size: 20
                    annotation: "Shows notification badge when unread count > 0"

              # Content area
              - type: scroll
                padding: xl
                gap: lg
                grow: 1
                children:
                  # Stat cards
                  - type: grid
                    columns: 4
                    gap: md
                    children:
                      - type: card
                        padding: lg
                        children:
                          - type: text
                            variant: caption
                            content: "Total Users"
                            color: text-secondary
                          - type: text
                            variant: h2
                            content: "12,847"
                          - type: text
                            variant: caption
                            content: "+12% from last month"
                            color: success

                      - type: card
                        padding: lg
                        children:
                          - type: text
                            variant: caption
                            content: "Active Now"
                            color: text-secondary
                          - type: text
                            variant: h2
                            content: "342"
                          - type: text
                            variant: caption
                            content: "+3% from last hour"
                            color: success

                      - type: card
                        padding: lg
                        children:
                          - type: text
                            variant: caption
                            content: "Revenue"
                            color: text-secondary
                          - type: text
                            variant: h2
                            content: "$48,290"
                          - type: text
                            variant: caption
                            content: "-2% from last month"
                            color: error

                      - type: card
                        padding: lg
                        children:
                          - type: text
                            variant: caption
                            content: "Conversion"
                            color: text-secondary
                          - type: text
                            variant: h2
                            content: "3.24%"
                          - type: text
                            variant: caption
                            content: "No change"
                            color: text-secondary

                  # Chart + Recent activity
                  - type: row
                    gap: lg
                    children:
                      - type: card
                        grow: 1
                        padding: lg
                        children:
                          - type: text
                            variant: h4
                            content: "Revenue Over Time"
                          - type: placeholder
                            label: "Line Chart — Monthly Revenue"
                            icon: arrow-up
                            aspect: "16/7"
                            annotation: "Recharts line chart. X = months, Y = revenue. Show tooltip on hover."

                      - type: card
                        width: 360
                        padding: lg
                        children:
                          - type: text
                            variant: h4
                            content: "Recent Activity"
                          - type: spacer
                            size: 8
                          - type: list
                            dividers: true
                            children:
                              - type: list-item
                                leading: "icon:user"
                                title: "New user signup"
                                subtitle: "2 minutes ago"
                                size: sm
                              - type: list-item
                                leading: "icon:download"
                                title: "Report exported"
                                subtitle: "15 minutes ago"
                                size: sm
                              - type: list-item
                                leading: "icon:edit"
                                title: "Settings updated"
                                subtitle: "1 hour ago"
                                size: sm
```

### Example 3: Mobile E-Commerce Product Screen

```yaml
riss: "0.1"

meta:
  name: "ShopApp"
  viewport: { width: 390, height: 844 }
  theme:
    mode: light
    accent: "#059669"

screens:
  - id: product_detail
    title: "Product Detail"
    path: "/products/:id"
    statusbar: true
    children:
      - type: navbar
        leading: icon:arrow-left
        trailing:
          - icon:heart
          - icon:share

      - type: scroll
        grow: 1
        children:
          - type: image
            aspect: "1/1"
            label: "Product Photo"
            annotation: "Swipeable image carousel. Dot indicators at bottom."

          - type: stack
            padding: lg
            gap: md
            children:
              - type: row
                justify: between
                align: start
                children:
                  - type: stack
                    gap: xs
                    shrink: 1
                    children:
                      - type: text
                        variant: overline
                        content: "OUTDOOR GEAR"
                        color: text-secondary
                      - type: text
                        variant: h3
                        content: "Fjelljakke Pro Hardshell"
                  - type: text
                    variant: h3
                    content: "kr 2,499"
                    color: accent

              - type: row
                gap: xs
                align: center
                children:
                  - type: icon
                    name: star
                    size: 16
                    color: warning
                  - type: icon
                    name: star
                    size: 16
                    color: warning
                  - type: icon
                    name: star
                    size: 16
                    color: warning
                  - type: icon
                    name: star
                    size: 16
                    color: warning
                  - type: icon
                    name: star
                    size: 16
                    color: border
                  - type: text
                    variant: body-sm
                    content: "4.0 (128 reviews)"
                    color: text-secondary

              - type: divider

              - type: text
                variant: label
                content: "SIZE"
              - type: row
                gap: sm
                children:
                  - type: chip
                    label: "S"
                  - type: chip
                    label: "M"
                    variant: outlined
                  - type: chip
                    label: "L"
                    variant: outlined
                  - type: chip
                    label: "XL"
                    variant: outlined

              - type: text
                variant: label
                content: "COLOR"
              - type: row
                gap: sm
                children:
                  - type: chip
                    label: "Black"
                  - type: chip
                    label: "Navy"
                    variant: outlined
                  - type: chip
                    label: "Olive"
                    variant: outlined

              - type: divider

              - type: text
                variant: h4
                content: "Description"
              - type: text
                content: "Premium hardshell jacket designed for demanding alpine conditions. Fully waterproof, windproof, and breathable with taped seams and adjustable hood."
                color: text-secondary
                max-lines: 3
                annotation: "Expandable — 'Read more' link shows full description"

              - type: spacer
                size: 80

      # Bottom bar (fixed)
      - type: row
        padding: lg
        gap: md
        border:
          sides: top
        background: background
        children:
          - type: button
            label: "Add to Cart"
            variant: primary
            size: lg
            grow: 1
            leading-icon: plus
          - type: button
            variant: outline
            size: lg
            leading-icon: heart
            icon-only: true
```

### Example 4: Role-Based Admin Screen

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
  # This entire screen is admin-only
  - id: user_management
    title: "User Management"
    path: "/admin/users"
    role: admin
    children:
      - type: navbar
        title: "User Management"
        leading: icon:arrow-left

      - type: scroll
        grow: 1
        padding: xl
        gap: lg
        children:
          - type: table
            columns:
              - label: "Name"
                width: "1/3"
              - label: "Role"
                width: "1/4"
              - label: "Status"
                width: "1/4"
              - label: "Actions"
                width: "1/6"
            rows:
              - ["Alice", "Admin", "Active", "..."]
              - ["Bob", "Manager", "Active", "..."]
              - ["Carol", "Member", "Inactive", "..."]

  # This screen is visible to all, but has role-restricted elements
  - id: team_dashboard
    title: "Team Dashboard"
    path: "/team"
    children:
      - type: navbar
        title: "Team Dashboard"
        trailing:
          - icon:bell
          - icon:settings

      - type: scroll
        grow: 1
        padding: xl
        gap: lg
        children:
          - type: text
            variant: h2
            content: "Welcome back"

          # Visible to everyone
          - type: card
            padding: lg
            children:
              - type: text
                variant: h4
                content: "Team Activity"
              - type: list
                children:
                  - type: list-item
                    title: "Sprint 12 started"
                    subtitle: "Today"

          # Only managers and admins see the budget card
          - type: card
            padding: lg
            role: [admin, manager]
            children:
              - type: text
                variant: h4
                content: "Budget Overview"
              - type: text
                content: "$48,290 spent of $60,000"
                color: text-secondary
              - type: progress
                value: 80
                color: warning
                annotation: "Show warning state when > 75% spent"

          # Only admins see the danger zone
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

## 10. AI Generation Guidelines

This section is for **AI language models** that will generate `.riss.yaml` files. Follow these rules to produce valid, high-quality wireframes.

### 10.1 Structure checklist

Every generated file MUST include:

```yaml
riss: "0.1"          # Always this exact string
meta:
  name: "..."        # Always provide a project name
  viewport: { ... }  # Always specify explicitly
  theme:
    mode: light      # Always specify explicitly
screens:
  - id: ...          # At least one screen
    title: "..."
    children: [...]   # At least one child element
```

### 10.2 Golden rules

1. **Always start with the screen structure.** Think: what are the major sections of this screen? Navbar at top? Tabbar at bottom? Scrollable content in the middle? Establish the skeleton first, then fill in details.

2. **Use `stack` as the default layout.** Most screens are vertical stacks. Only use `row` when elements are explicitly side-by-side, and `grid` for uniform grids.

3. **Nest meaningfully.** Each nesting level should represent a visual or logical grouping. Don't wrap single elements in unnecessary containers.

4. **Use spacing tokens, not pixel values.** Prefer `gap: md` over `gap: 16`. Tokens are `none`, `xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32), `2xl` (48), `3xl` (64).

5. **Use color tokens, not hex values.** Prefer `color: text-secondary` over `color: "#6B7280"`. The only hex value you should set is `meta.theme.accent`.

6. **Every screen should have clear visual hierarchy.** Use heading variants (`h1`-`h6`) to establish importance. Don't make everything `body`.

7. **Annotate ambiguous elements.** If a placeholder, chart, or interaction isn't obvious from the wireframe alone, add an `annotation` explaining the intended behavior.

8. **Use the right element for the job.** Don't build a list manually with `stack` + `divider` + multiple `row` elements — use `list` + `list-item`. Don't build a card with a bordered `stack` — use `card`.

9. **Keep content realistic but concise.** Use realistic placeholder text (real-sounding names, prices, dates) rather than "Lorem ipsum" or "Text here". But keep text short.

10. **Mobile screens need a navbar and/or tabbar.** Desktop screens typically need a sidebar or top navigation. Don't leave screens without navigation context.

11. **Use roles to communicate access boundaries.** When a screen or element is restricted to certain user types, set the `role` property. Define all roles upfront in `meta.roles` with distinct colors. Apply roles at the highest meaningful level — prefer marking a whole `section` or `card` over marking every child element individually.

### 10.3 Common patterns

#### Mobile screen skeleton

```yaml
- id: mobile_screen
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
        # ... screen content here

    - type: tabbar
      items:
        - icon: home
          label: "Home"
        - icon: search
          label: "Search"
        - icon: user
          label: "Profile"
```

#### Desktop screen skeleton

```yaml
- id: desktop_screen
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
                # ... breadcrumb, search, actions

            # Content
            - type: scroll
              grow: 1
              padding: xl
              children:
                # ... page content
```

#### Form layout

```yaml
- type: stack
  gap: md
  children:
    - type: input
      label: "First Name"
      placeholder: "Enter first name"
      required: true
    - type: input
      label: "Last Name"
      placeholder: "Enter last name"
      required: true
    - type: input
      label: "Email"
      placeholder: "you@example.com"
      required: true
      leading-icon: mail
    - type: select
      label: "Country"
      options: ["Norway", "Sweden", "Denmark"]
    - type: textarea
      label: "Message"
      placeholder: "Your message..."
      rows: 4
    - type: checkbox
      label: "I agree to the terms and conditions"
    - type: button
      label: "Submit"
      variant: primary
      full-width: true
```

#### Card with header and actions

```yaml
- type: card
  children:
    - type: row
      padding: md
      align: center
      children:
        - type: text
          variant: h4
          content: "Card Title"
        - type: spacer
        - type: button
          variant: ghost
          leading-icon: more-horizontal
          icon-only: true
    - type: divider
    - type: stack
      padding: md
      gap: sm
      children:
        # ... card body content
    - type: divider
    - type: row
      padding: md
      justify: end
      gap: sm
      children:
        - type: button
          label: "Cancel"
          variant: ghost
        - type: button
          label: "Save"
          variant: primary
```

### 10.4 Validation rules

A valid `.riss.yaml` file must satisfy:

1. `riss` field must be `"0.1"`.
2. `meta.name` must be a non-empty string.
3. `screens` must be a non-empty array.
4. Every screen must have a unique `id` (snake_case, alphanumeric + underscores).
5. Every screen must have a `title` and `children`.
6. Every element must have a `type` that matches a known element type from this spec.
7. Required properties for each element type must be present (marked **(required)** in element reference).
8. `children` can only be set on container/layout elements: `stack`, `row`, `grid`, `scroll`, `card`, `section`, `modal`, `bottomsheet`, `list`, `navbar` (implicitly), `screen` (root).
9. Content elements (`text`, `image`, `icon`, `avatar`, `divider`, `spacer`, `badge`, `chip`, `progress`, `button`, `input`, `textarea`, `checkbox`, `radio`, `toggle`, `select`, `slider`, `placeholder`, `alert`, `toast`, `skeleton`, `empty-state`, `spinner`, `table`, `breadcrumb`, `annotation`) must NOT have `children`.
10. Color values must be either a recognized token name or a valid hex string (`#RGB`, `#RRGGBB`, `#RRGGBBAA`).
11. Spacing values must be either a recognized token name or a non-negative number.
12. Size values must be a non-negative number, a recognized fraction string, `"full"`, `"half"`, or `"auto"`.
13. Every `role` value must reference a role `id` defined in `meta.roles`.
14. If `role` is used anywhere in the file, `meta.roles` must be defined and non-empty.

### 10.5 When generating multiple screens

- Give each screen a unique, descriptive `id`: `home`, `profile`, `settings`, `product_detail`, `checkout`, `onboarding_step_1`.
- Keep navigation consistent across screens. If one screen has a tabbar, all screens at the same level should have the same tabbar.
- Mark the active state correctly — the active tab/nav item should match the current screen.
- Use annotations to note navigation targets: `annotation: "Taps navigate to screen: product_detail"`.

---

## Appendix A: Quick Reference — All Element Types

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

## Appendix B: Spacing & Sizing Cheatsheet

```
Spacing:  none=0  xs=4  sm=8  md=16  lg=24  xl=32  2xl=48  3xl=64
Radius:   none=0  sm=4  md=8  lg=12  xl=16  full=9999
Sizes:    "auto"  "full"  "half"  "1/3"  "2/3"  "1/4"  "3/4"  or pixels
```

## Appendix C: Versioning

Riss uses semantic versioning. The `riss` field in the file declares which spec version the file was authored against. Renderers should support all versions up to their current release.

- **v0.1** (this document) — Core elements, layout system, annotations. No templates, no navigation flows, no interactivity.
- **v0.2** (planned) — Slot-based template composition. Extends the custom blocks system (see [Custom Blocks](blocks/custom-blocks.md)) with named slots for child element injection.
- **v0.3** (planned) — Navigation flows. Screen-to-screen linking with tap targets.
- **v1.0** (planned) — Stable release. Multi-file support, theming presets, interactive prototype mode.

---

*Riss — because every great product starts as a sketch.*
