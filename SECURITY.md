# Security

## Reporting issues

If you find a vulnerability in this repository’s code, open a **private** security advisory on GitHub if available, or an issue without including secrets.

Do not file issues that contain live API keys.

## Design assumptions

- No Prompt Scale backend stores keys or prompts
- Keys are kept in browser extension storage or `localStorage` (web)
- Official counting sends prompt text to Anthropic only when the user opts in

## Recommendations for users

- Prefer a dedicated Anthropic key with limited scope where possible
- Do not commit keys to git
- Revoke keys in the Anthropic Console if a device is lost
- Treat local estimates as non-sensitive math; treat official-count traffic as data shared with Anthropic

## Dependencies

The web app may pull npm packages. Pin and audit them before production deployment. The extension avoids heavy third-party bundles on purpose.
