# Changelog

## 1.0.1

- Official counts go through the background service worker (fixes missing API host permission)
- Added `https://api.anthropic.com/*` host permission
- Stopped stacking MutationObservers when Claude’s SPA re-renders
- Better fallback when the default composer selector is missing
- Popup API key field is password type
- Web dashboard: auto model suggestion, optimizer, cost/context pages, honest usage page

## 1.0.0

- First public cut
- Live estimate above Claude composer
- Popup: model + optional key
