# Contributing

Small project. Useful changes welcome.

## How to help

1. Open an issue before large rewrites
2. Keep the extension Claude-only unless the issue says otherwise
3. Do not commit API keys, real prompts, or personal data
4. Prefer small PRs

## Extension

- Manifest V3 only
- Content script must stay limited to `claude.ai`
- Official counts go through the background service worker

## Web app

```bash
cd web
npm install
npm run dev
```

## Style

- Plain language in UI and docs
- Label estimates vs official counts
- No fake subscription usage meters

## License

By contributing, you agree your contributions are MIT-licensed like the rest of the repo.
