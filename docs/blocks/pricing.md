# Pricing Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `pricing-table`

Multi-tier pricing comparison.

```yaml
- block: pricing-table
  title: "Simple, transparent pricing"
  toggle: ["Monthly", "Annual"]
  tiers:
    - name: "Free"
      price: "$0"
      period: "/month"
      description: "For individuals getting started."
      features: ["5 wireframes", "PNG export", "Community support"]
      cta-label: "Get Started"
      cta-variant: outline
    - name: "Pro"
      price: "$19"
      period: "/month"
      description: "For teams that move fast."
      features: ["Unlimited wireframes", "PNG + PDF export", "Custom blocks", "Priority support"]
      cta-label: "Start Free Trial"
      highlighted: true
    - name: "Enterprise"
      price: "Custom"
      description: "For organizations at scale."
      features: ["Everything in Pro", "SSO", "Dedicated support", "SLA"]
      cta-label: "Contact Sales"
      cta-variant: outline
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `subtitle` | String | — | Section subtitle. |
| `toggle` | String[2] | — | Billing toggle labels (e.g., `["Monthly", "Annual"]`). |
| `tiers` | **Array (required)** | — | Each: `{ name, price, period?, description?, features[], cta-label, cta-variant?, highlighted? }`. |

---

## `pricing-card`

A standalone single pricing plan card.

```yaml
- block: pricing-card
  name: "Pro"
  price: "$19"
  period: "/month"
  features: ["Unlimited projects", "Team collaboration", "Priority support"]
  cta-label: "Upgrade to Pro"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | **String (required)** | — | Plan name. |
| `price` | **String (required)** | — | Price display. |
| `period` | String | — | Billing period text. |
| `description` | String | — | Plan description. |
| `features` | String[] | `[]` | Feature list. |
| `cta-label` | String | `"Get Started"` | Button label. |
| `highlighted` | Boolean | `false` | Visual emphasis (accent border, "Popular" badge). |
