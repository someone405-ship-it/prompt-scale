# Privacy

Prompt Scale does not run a backend and does not collect analytics.

## Data that stays on your computer

- Optional Anthropic API key (extension: `chrome.storage.local`, web app: `localStorage`)
- Model preference and “use official count” checkbox

## Data that can leave your computer

Only if you turn on official counting and have a key:

- The **text currently in the Claude composer** is sent to `https://api.anthropic.com/v1/messages/count_tokens` using your key
- Nothing else is uploaded by this extension

## Permissions

- `storage` — save your settings
- `activeTab` — normal extension popup behavior
- Host: `https://claude.ai/*` — inject the counter
- Host: `https://api.anthropic.com/*` — official token count only

No access to passwords, cookies from other sites, or your Claude login session.

## Deleting data

Remove the extension, or clear site/extension storage in the browser. In the web app, use Settings → Clear keys.
