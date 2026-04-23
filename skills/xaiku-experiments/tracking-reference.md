# Tracking Reference

Detailed reference for event tracking through the Xaiku MCP `track_event` tool.

## Event Types

| Event | When to fire | Required |
|-------|-------------|----------|
| `impression` | Variant text was sent/shown to recipient | Yes, always |
| `click` | Recipient clicked a link in the variant | If applicable |
| `conversion` | Recipient took the desired action | When it happens |

## Conversion Definition

A conversion means the recipient directly engaged with or responded to the variant content. What counts as a conversion depends on the channel:

- **Messaging (WhatsApp, Slack, etc.):** Recipient replies to the message containing variant text
- **Email:** Recipient clicks the CTA or replies
- **Web:** Recipient completes the target action (signup, purchase)

Do NOT count: unrelated replies, bot auto-responses, reactions/emoji-only responses.

## track_event Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `experiment_id` | string | Yes | The experiment being tracked |
| `variant_id` | string | Yes | The specific variant shown (from `get_variant` response) |
| `recipient_id` | string | Yes | Same stable ID used in `get_variant` |
| `event` | string | Yes | One of: `impression`, `click`, `conversion` |
| `channel` | string | No | Where the interaction happened (e.g., `whatsapp`, `slack`, `email`). Defaults to `web` |
| `metadata` | object | No | Additional context (e.g., `{ "link_url": "..." }` for clicks) |

## Attribution Window

Events are attributed to the most recent variant shown to that recipient for that experiment. There is no time-based expiration — if the recipient was shown variant A, all subsequent events for that experiment are attributed to variant A until they see a different variant (which shouldn't happen due to deterministic assignment).

## Deduplication

The MCP server generates an `eventId` from `SHA-256(experiment_id + variant_id + recipient_id + event + date_hour)`. Duplicate events within the same hour are silently dropped. You do not need to handle dedup yourself.

## Failure Handling

- `track_event` returns `{ success: true }` on success
- On failure (network, server error), it returns `{ success: false, error: "..." }`
- **Always ignore failures.** Tracking is best-effort. Never retry, never block on it.
- If you need to confirm events were recorded, use `get_results` — but not in the hot path.
