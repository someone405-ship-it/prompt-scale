# Changelog

## 1.0.0 (public)

First public package.

### Extension
- Live token estimate above the Claude composer (claude.ai only)
- Local estimate by default
- Optional official Anthropic `count_tokens` via background worker + your API key
- Settings in popup (model, key, official toggle)
- Privacy, disclaimer, terms, security docs

### Web (`web/`)
- Dashboard shell: Overview, counter, files (text), optimizer, cost, context, settings, usage, legal
- Auto model suggestion (heuristic)
- Honest “subscription usage unavailable” messaging

### Known limits
- No Claude Pro/Max subscription meter via API key
- Attachment file tokens in the bar still 0
- PDF/DOCX parsers not fully wired
