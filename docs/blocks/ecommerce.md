# E-Commerce Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `product-card-grid`

A grid of product cards with optional filters.

```yaml
- block: product-card-grid
  columns: 3
  items:
    - image-label: "Trail Runner"
      title: "Trail Runner Pro"
      price: "kr 1,299"
      rating: 4.5
    - image-label: "Road Runner"
      title: "Road Runner Lite"
      price: "kr 999"
      original-price: "kr 1,299"
      rating: 4.2
      badge: "Sale"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `columns` | Number (2-4) | `3` | Grid columns. |
| `items` | **Array (required)** | — | Each: `{ image-label?, title, price, original-price?, rating?, badge?, cta-label? }`. |
| `show-rating` | Boolean | `true` | Show star ratings. |
| `show-cart-button` | Boolean | `true` | Show "Add to Cart" button. |

---

## `product-detail`

Full product detail section (image + info + variants + CTA).

```yaml
- block: product-detail
  image-label: "Product Photo"
  image-count: 4
  category: "Outdoor Gear"
  title: "Fjelljakke Pro Hardshell"
  price: "kr 2,499"
  rating: 4.0
  reviews: 128
  description: "Premium hardshell jacket designed for demanding alpine conditions."
  variants:
    - label: "Size"
      options: ["S", "M", "L", "XL"]
      selected: 0
    - label: "Color"
      options: ["Black", "Navy", "Olive"]
      selected: 0
  cta-label: "Add to Cart"
  wishlist: true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `image-label` | String | `"Product Photo"` | Image placeholder label. |
| `image-count` | Number | `1` | Number of images (renders dot indicators if > 1). |
| `category` | String | — | Product category label. |
| `title` | **String (required)** | — | Product name. |
| `price` | **String (required)** | — | Price display. |
| `original-price` | String | — | Crossed-out original price (for sales). |
| `rating` | Number | — | Star rating (1-5). |
| `reviews` | Number | — | Review count. |
| `description` | String | — | Product description text. |
| `variants` | Array | — | Each: `{ label, options[], selected? }`. |
| `cta-label` | String | `"Add to Cart"` | Primary action button. |
| `wishlist` | Boolean | `false` | Show wishlist/heart button. |

---

## `cart-summary`

Shopping cart contents and order total.

```yaml
- block: cart-summary
  items:
    - title: "Fjelljakke Pro"
      subtitle: "Black / Size L"
      price: "kr 2,499"
      quantity: 1
    - title: "Trail Runner Pro"
      subtitle: "Blue / Size 42"
      price: "kr 1,299"
      quantity: 2
  subtotal: "kr 5,097"
  shipping: "Free"
  total: "kr 5,097"
  cta-label: "Checkout"
  promo-code: true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | **Array (required)** | — | Each: `{ title, subtitle?, price, quantity?, image-label? }`. |
| `subtotal` | String | — | Subtotal display. |
| `shipping` | String | — | Shipping cost/label. |
| `discount` | String | — | Discount line. |
| `total` | **String (required)** | — | Total display. |
| `cta-label` | String | `"Checkout"` | Primary button. |
| `promo-code` | Boolean | `false` | Show promo code input. |

---

## `checkout-steps`

A checkout flow with step indicator.

> **Distinction from `multi-step-form`:** This block renders a read-only step indicator for e-commerce checkout flows. For a full form wizard with fields, navigation buttons, and step tracking, use [`multi-step-form`](forms.md).

```yaml
- block: checkout-steps
  steps: ["Shipping", "Payment", "Review"]
  current-step: 2
  variant: numbered
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `steps` | **String[] (required)** | — | Step labels. |
| `current-step` | Number | `1` | Active step (1-based). |
| `variant` | `numbered`, `dots`, `bar` | `numbered` | Step indicator style. |
