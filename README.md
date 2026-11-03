# Prompt Scale

Claude-focused token intelligence.

## Parts

1. **Browser extension** (repo root) – live token estimate above the Claude composer on claude.ai only
2. **Web app** (`web/`) – full dashboard: calculator, auto model suggest, file analyzer, optimizer, cost, context, settings

## Web app

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

### Features that work

- Live / paste prompt token calculator (local estimate)
- Optional official Anthropic `count_tokens` when you paste your API key
- **Auto model select** – heuristic suggestion (Haiku / Sonnet / Opus / Fable) from prompt size + keywords
- File analyzer for plain text family (TXT, MD, CSV, JSON, code, …)
- Rule-based prompt optimizer (local, approval required)
- Cost calculator with Nov 2026 list prices
- Context manager (known tokens only; never assumes hidden = 0)
- Settings for API key + Admin key (browser localStorage only)
- Honest Claude Usage page (subscription vs API)

### What does *not* work (and will not fake)

- Reading Claude.ai Pro/Max usage bars via “link account” – Anthropic does not offer this to third-party apps with a normal key
- Full PDF/DOCX/XLSX/OCR/ZIP parsers (marked partial)
- Scraping cookies, passwords, or private chat history

## Extension install

Chrome → `chrome://extensions` → Developer mode → Load unpacked → select this repo root (folder with `manifest.json`).

## Privacy

Keys stay on your device. No Prompt Scale backend. Content script only on `https://claude.ai/*`.

## License

MIT
