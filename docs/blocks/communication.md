# Communication Blocks

[← Back to RissBlocks](../RISSBLOCKS_SPEC.md)

---

## `chat-thread`

A messaging interface with bubbles and input.

```yaml
- block: chat-thread
  messages:
    - sender: "other"
      name: "Kari"
      text: "Hey, have you seen the new wireframes?"
      time: "10:32"
    - sender: "self"
      text: "Yes! They look great. Love the accordion block."
      time: "10:33"
    - sender: "other"
      name: "Kari"
      text: "Should we add a kanban block too?"
      time: "10:34"
  input: true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `messages` | **Array (required)** | — | Each: `{ sender, name?, text, time? }`. Sender: `"self"` or `"other"`. |
| `input` | Boolean | `true` | Show message input bar. |
| `input-placeholder` | String | `"Type a message..."` | Input placeholder. |
| `header` | Object | — | Chat header: `{ name, subtitle?, avatar? }`. |

---

## `comment-thread`

A comment section with replies.

```yaml
- block: comment-thread
  title: "Comments"
  count: 24
  items:
    - author: "Ola Nordmann"
      avatar: "ON"
      time: "2 hours ago"
      text: "This is a great approach! Really like the block system."
      likes: 5
      replies:
        - author: "Bear Qode"
          avatar: "BQ"
          time: "1 hour ago"
          text: "Thanks! We're still iterating on the API."
    - author: "Lisa Berg"
      avatar: "LB"
      time: "30 minutes ago"
      text: "Will there be support for custom block parameters?"
  show-input: true
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | `"Comments"` | Section heading. |
| `count` | Number | — | Total comment count. |
| `items` | **Array (required)** | — | Each: `{ author, avatar?, time?, text, likes?, replies? }`. |
| `show-input` | Boolean | `true` | Show "Add a comment" input. |

---

## `notification-list`

A list of notifications with read/unread states.

```yaml
- block: notification-list
  title: "Notifications"
  items:
    - icon: user
      text: "Kari started following you"
      time: "5 min ago"
      unread: true
    - icon: heart
      text: "Ola liked your wireframe"
      time: "1 hour ago"
      unread: true
    - icon: mail
      text: "New message from Lisa"
      time: "3 hours ago"
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | String | — | Section heading. |
| `items` | **Array (required)** | — | Each: `{ icon?, avatar?, text, time?, unread?, action? }`. |
| `mark-all-read` | Boolean | `true` | Show "Mark all as read" action. |
