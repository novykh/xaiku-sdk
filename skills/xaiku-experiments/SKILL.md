---
name: xaiku-experiments
description: Use when sending messages with A/B tested copy, running experiments on outbound content, choosing between variant texts, or tracking impressions and conversions for experiments
---

# Running Xaiku Experiments

You have access to Xaiku MCP tools for A/B testing outbound content. Every message you send that has an active experiment MUST go through this flow.

## Core Pattern

```
1. get_variant  → returns variant text for this recipient
2. Send the variant text (do NOT modify it)
3. track_event  → log impression, click, or conversion
```

## Quick Reference

| Tool | Purpose | Required params |
|------|---------|-----------------|
| `get_variant` | Get assigned variant for a recipient | `experiment_id`, `recipient_id` |
| `track_event` | Log an event against a variant | `experiment_id`, `variant_id`, `recipient_id`, `event` |
| `get_results` | Check experiment performance | `experiment_id` |

## Rules

1. **Never modify variant text.** Send it exactly as returned. Tweaking copy corrupts the experiment.
2. **Always track impressions.** Call `track_event` with `event: "impression"` immediately after sending.
3. **One variant per recipient per experiment.** The same `recipient_id` always gets the same variant (deterministic hash). Do not call `get_variant` with different IDs for the same person.
4. **recipient_id is any stable identifier.** Phone number, email, user ID, chat JID — the MCP server hashes it internally. Pass the raw value.
5. **Failures are silent.** If `get_variant` times out (3s) or errors, fall back to your default copy. If `track_event` fails, drop it. Never block the conversation on tracking.

## Common Mistakes

| Mistake | Why it's wrong | Fix |
|---------|---------------|-----|
| Paraphrasing variant text | Destroys experiment validity | Send `text` field verbatim |
| Generating recipient_id randomly | Same person gets different variants each time | Use a stable ID (phone, email, JID) |
| Skipping impression tracking | No denominator for conversion rate | Always track impression after send |
| Blocking on track_event failure | Degrades user experience for analytics | Fire and forget, silent drop on error |
| Calling get_variant per message | Wastes API calls, same result anyway | Cache variant for the session |

## Tracking Events

For detailed event types, required fields, and conversion definitions, read `tracking-reference.md` in this skill directory.

### Event Types (summary)

- **impression** — Variant text was shown to the recipient
- **click** — Recipient clicked a link in the variant
- **conversion** — Recipient took the target action (replied, signed up, purchased)

## Example Flow

```
Agent receives task: "Send promo message to group"

1. For each recipient:
   a. get_variant(experiment_id="summer-sale-23", recipient_id="+1234567890")
      → { variant_id: "v_abc", text: "Summer deals are here! 30% off everything.", parts: {...} }

   b. Send message with text: "Summer deals are here! 30% off everything."

   c. track_event(experiment_id="summer-sale-23", variant_id="v_abc", recipient_id="+1234567890", event="impression")

2. When recipient replies or clicks:
   track_event(..., event="conversion")
```
