# Prompt Scale

Claude-focused token intelligence.

## What’s here

- **Browser extension** (root) – live counter above the Claude composer on claude.ai
- **Web app** (`web/`) – dark dashboard with Prompt Token Calculator, model selection, optional official Anthropic count, cost estimates

## Web app (quick start)

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

## Extension

Load the root folder (containing `manifest.json`) as an unpacked extension in Chrome.

## Honest limitations

- Local token numbers are **estimates** (chars ÷ 4) unless you supply an Anthropic API key for the official `count_tokens` endpoint.
- Claude.ai **subscription** usage (Pro/Max bars) is **not** available via a normal API key. The app will not invent a percentage.
- File analysis, optimizer, analytics, library, etc. are being built next.

## Name

Prompt Scale – intentionally plain.

## License

MIT
