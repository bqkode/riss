# Custom Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

Users and AI can define custom blocks within a `.riss.yaml` file using the `blocks` top-level field. Custom blocks are expanded by the renderer like core blocks.

## Defining a custom block

```yaml
riss: "0.1"

meta:
  name: "MyApp"
  viewport: { width: 390, height: 844 }

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
          - block: metric-card
            label: "Revenue"
            value: "$48K"
            trend: "-2%"
            trend-direction: down
            icon: arrow-up
```

## Definition fields

| Field | Required | Description |
|-------|----------|-------------|
| `id` | **Yes** | Block identifier. Must not conflict with core block names. |
| `description` | No | Human-readable description of the block. |
| `params` | **Yes** | Parameter definitions: `{ name, required?, default? }`. |
| `template` | **Yes** | Riss element tree. Use `{{param_name}}` for parameter interpolation. |

## Template interpolation

- `{{param_name}}` — Replaced with the parameter value.
- `if: "{{param_name}}"` — Conditionally render element only if the parameter is truthy.
- `{{param == 'value' ? 'result_a' : 'result_b'}}` — Ternary expression. Compares a parameter against a string literal and returns one of two values. Ternaries can be nested for multi-branch logic (see the `metric-card` example above).
- Nested access is NOT supported in v0.1. Keep parameters flat.
- Only `==` comparisons are supported in v0.1. No arithmetic, no `!=`, `>`, `<`, or boolean operators.
