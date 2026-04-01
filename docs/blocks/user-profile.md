# User & Profile Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `profile-header`

A user profile header with cover image, avatar, and actions.

```yaml
- block: profile-header
  cover: true
  avatar: "BQ"
  name: "Bear Qode"
  subtitle: "@bqkode"
  bio: "Building things with code and curiosity."
  stats:
    - label: "Posts"
      value: "142"
    - label: "Followers"
      value: "1.2K"
    - label: "Following"
      value: "89"
  actions: ["Follow", "Message"]
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cover` | Boolean | `false` | Show cover image placeholder. |
| `avatar` | String | — | Avatar initials. |
| `avatar-size` | Number | `80` | Avatar diameter. |
| `name` | **String (required)** | — | Display name. |
| `subtitle` | String | — | Username, role, or tagline. |
| `bio` | String | — | Bio text. |
| `stats` | Array | — | Each: `{ label, value }`. |
| `actions` | String[] | — | Action button labels. |
| `tabs` | String[] | — | Tab labels below the header. |

---

## `team-grid`

A grid of team member cards.

```yaml
- block: team-grid
  title: "Our Team"
  columns: 4
  items:
    - name: "Bear Qode"
      role: "Founder & CEO"
      avatar: "BQ"
    - name: "Kari Nordmann"
      role: "Head of Design"
      avatar: "KN"
    - name: "Ola Nordmann"
      role: "Lead Engineer"
      avatar: "ON"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `columns` | Number (2-5) | `4` | Grid columns. |
| `items` | **Array (required)** | — | Each: `{ name, role, avatar?, image-label? }`. |
| `show-social` | Boolean | `false` | Show social media icon placeholders. |

---

## `avatar-list`

A compact list of users with avatars (e.g., team members, online users).

```yaml
- block: avatar-list
  items:
    - name: "Bear"
      initials: "BQ"
      subtitle: "Online"
    - name: "Kari"
      initials: "KN"
      subtitle: "Away"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `items` | **Array (required)** | — | Each: `{ name, initials?, subtitle?, status? }`. |
| `stacked` | Boolean | `false` | Overlap avatars (shows "+N more" for overflow). |
| `max-visible` | Number | — | Max avatars before "+N" (for stacked mode). |
