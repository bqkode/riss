# Form Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `login-form`

Standard login form.

```yaml
- block: login-form
  logo: "MyApp"
  social: ["Google", "GitHub"]
  forgot-password: true
  signup-link: true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `logo` | String | — | App name/logo above the form. |
| `heading` | String | `"Welcome back"` | Form heading. |
| `subheading` | String | `"Sign in to continue"` | Subtitle. |
| `email` | Boolean | `true` | Show email field. |
| `password` | Boolean | `true` | Show password field. |
| `remember-me` | Boolean | `true` | Show "Remember me" checkbox. |
| `forgot-password` | Boolean | `true` | Show "Forgot password?" link. |
| `social` | String[] | — | Social login buttons (e.g., `["Google", "GitHub"]`). |
| `signup-link` | Boolean | `true` | Show "Don't have an account? Sign up" link. |
| `cta-label` | String | `"Sign In"` | Submit button label. |

---

## `signup-form`

Registration form.

```yaml
- block: signup-form
  logo: "MyApp"
  fields: ["name", "email", "password"]
  social: ["Google"]
  terms: true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `logo` | String | — | App name/logo. |
| `heading` | String | `"Create an account"` | Form heading. |
| `fields` | String[] | `["name", "email", "password"]` | Fields to show. Options: `name`, `email`, `password`, `confirm-password`, `phone`, `company`. |
| `social` | String[] | — | Social signup buttons. |
| `terms` | Boolean | `true` | Show terms & conditions checkbox. |
| `login-link` | Boolean | `true` | Show "Already have an account? Sign in" link. |
| `cta-label` | String | `"Create Account"` | Submit button label. |

---

## `contact-form`

A contact or inquiry form.

```yaml
- block: contact-form
  title: "Get in touch"
  fields: ["name", "email", "subject", "message"]
  cta-label: "Send Message"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | `"Contact Us"` | Form heading. |
| `description` | String | — | Subtitle text. |
| `fields` | String[] | `["name", "email", "message"]` | Fields. Options: `name`, `email`, `phone`, `company`, `subject`, `message`. |
| `cta-label` | String | `"Send"` | Submit button label. |

---

## `search-with-filters`

A search bar with filter controls and results area.

```yaml
- block: search-with-filters
  placeholder: "Search products..."
  filters:
    - label: "Category"
      options: ["All", "Shoes", "Jackets", "Accessories"]
    - label: "Price"
      options: ["Any", "Under $50", "$50-$100", "Over $100"]
    - label: "Rating"
      options: ["Any", "4+", "3+"]
  result-count: "142 results"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `placeholder` | String | `"Search..."` | Search input placeholder. |
| `filters` | Array | — | Each: `{ label, options[], type? }`. Type: `select` (default), `chip`, `toggle`. |
| `result-count` | String | — | Result count text shown below filters. |
| `sort` | String[] | — | Sort options (e.g., `["Relevance", "Newest", "Price: Low", "Price: High"]`). |

---

## `multi-step-form`

A form wizard with step indicator, fields, and navigation buttons.

> **Distinction from `checkout-steps`:** This block is a full form wizard with fields per step and forward/back buttons. For a read-only step indicator without form fields (e.g., checkout progress bar), use [`checkout-steps`](ecommerce.md).

```yaml
- block: multi-step-form
  steps:
    - label: "Account"
      active: true
    - label: "Profile"
    - label: "Preferences"
  current-step: 1
  fields: ["name", "email", "password"]
  cta-label: "Next"
  cta-secondary-label: "Back"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `steps` | **Array (required)** | — | Step labels: `{ label, active?, completed? }`. |
| `current-step` | Number | `1` | Active step (1-based). |
| `fields` | String[] | — | Fields for the current visible step. |
| `cta-label` | String | `"Next"` | Primary button. |
| `cta-secondary-label` | String | `"Back"` | Secondary button. |

---

## `settings-form`

Grouped settings with toggles, selects, and inputs.

```yaml
- block: settings-form
  title: "Notification Settings"
  groups:
    - title: "Email Notifications"
      items:
        - type: toggle
          label: "Marketing emails"
          checked: true
        - type: toggle
          label: "Product updates"
          checked: true
        - type: toggle
          label: "Security alerts"
          checked: true
    - title: "Push Notifications"
      items:
        - type: toggle
          label: "New messages"
          checked: false
        - type: toggle
          label: "Mentions"
          checked: true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Page/section title. |
| `groups` | **Array (required)** | — | Each: `{ title, items[] }`. Items: `{ type, label, checked?, value?, options? }`. |
| `save-button` | Boolean | `true` | Show save button at bottom. |
| `save-label` | String | `"Save Changes"` | Save button text. |
