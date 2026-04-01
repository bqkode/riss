# Data & Dashboard Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `stat-cards-row`

A row of metric/KPI cards.

```yaml
- block: stat-cards-row
  items:
    - label: "Total Users"
      value: "12,847"
      trend: "+12%"
      trend-direction: up
    - label: "Active Now"
      value: "342"
      trend: "+3%"
      trend-direction: up
    - label: "Revenue"
      value: "$48,290"
      trend: "-2%"
      trend-direction: down
    - label: "Conversion"
      value: "3.24%"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | **Array (required)** | — | Each: `{ label, value, trend?, trend-direction?, icon? }`. |
| `columns` | Number (2-6) | Auto (item count) | Number of columns. |

---

## `data-table`

A full-featured data table with optional search, filters, pagination, and actions.

> **Relation to core element:** This block expands to a layout containing a [`table`](../RISS_SPEC.md#66-data-display-elements) element plus search, filter, and pagination chrome. Use the core `table` element for a simple static table without controls.

```yaml
- block: data-table
  title: "Users"
  search: true
  columns:
    - label: "Name"
      width: "1/4"
    - label: "Email"
      width: "1/4"
    - label: "Role"
      width: "1/6"
    - label: "Status"
      width: "1/6"
    - label: "Actions"
      width: "1/6"
      align: right
  rows:
    - ["Alice Johnson", "alice@example.com", "Admin", "Active", "..."]
    - ["Bob Smith", "bob@example.com", "Editor", "Active", "..."]
    - ["Carol White", "carol@example.com", "Viewer", "Inactive", "..."]
  pagination: true
  total-rows: 247
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Table heading. |
| `search` | Boolean | `false` | Show search bar above table. |
| `filters` | Array | — | Filter controls: `{ label, options[] }`. |
| `columns` | **Array (required)** | — | Column definitions: `{ label, width?, align? }`. |
| `rows` | **Array[] (required)** | — | Row data (array of string arrays). |
| `pagination` | Boolean | `false` | Show pagination controls. |
| `total-rows` | Number | — | Total row count (for pagination display). |
| `actions` | Array | — | Bulk action buttons: `{ label, icon? }`. |
| `striped` | Boolean | `false` | Alternate row backgrounds. |
| `selectable` | Boolean | `false` | Show row checkboxes. |

---

## `activity-feed`

A list of timestamped events.

```yaml
- block: activity-feed
  title: "Recent Activity"
  items:
    - icon: user
      text: "New user signup: Alice Johnson"
      time: "2 minutes ago"
    - icon: download
      text: "Report exported by Bob Smith"
      time: "15 minutes ago"
    - icon: edit
      text: "Settings updated by Carol White"
      time: "1 hour ago"
  show-more: "View all activity"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `items` | **Array (required)** | — | Each: `{ icon?, avatar?, text, time, action? }`. |
| `show-more` | String | — | "View all" link label. |

---

## `chart-card`

A card containing a chart placeholder.

```yaml
- block: chart-card
  title: "Revenue Over Time"
  chart-type: line
  chart-label: "Monthly Revenue — Jan to Dec"
  aspect: "16/7"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | **String (required)** | — | Card heading. |
| `chart-type` | `line`, `bar`, `pie`, `donut`, `area` | `line` | Type of chart (rendered as labeled placeholder). |
| `chart-label` | String | — | Description inside the placeholder. |
| `aspect` | String | `"16/9"` | Chart area aspect ratio. |
| `subtitle` | String | — | Subtitle below heading. |
| `actions` | Array | — | Top-right action buttons: `{ label?, icon? }`. |

---

## `kanban-board`

A columnar board of draggable cards (task management pattern).

```yaml
- block: kanban-board
  columns:
    - title: "To Do"
      cards:
        - title: "Design homepage wireframe"
          tag: "Design"
          avatar: "BQ"
        - title: "Write API spec"
          tag: "Backend"
    - title: "In Progress"
      cards:
        - title: "Implement auth flow"
          tag: "Backend"
          avatar: "KN"
    - title: "Done"
      cards:
        - title: "Setup project repo"
          tag: "DevOps"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `columns` | **Array (required)** | — | Each: `{ title, cards[] }`. Cards: `{ title, subtitle?, tag?, avatar?, color? }`. |
| `add-card` | Boolean | `true` | Show "+ Add card" button in each column. |
