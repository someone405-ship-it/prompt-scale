# Privacy

Last updated: 2026-11-03

Prompt Scale is a local browser extension and optional web UI. There is no Prompt Scale server that receives your prompts by default.

## What is stored on your device

- Optional Anthropic API key (extension: `chrome.storage.local`; web app: browser `localStorage`)
- UI preferences (model choice, “use official count”, auto-model toggle)

We do not operate an account system. We do not sell data.

## What can leave your device

**Only if you enable official token counting and provide an API key:**

- The text being counted is sent to Anthropic’s API (`https://api.anthropic.com/v1/messages/count_tokens`) using **your** key.
- That request is governed by Anthropic’s own terms and privacy policy, not by Prompt Scale.

Local estimates never leave the browser for counting.

## What we do not collect

- No analytics SDKs
- No crash reporters that upload prompt text
- No advertising identifiers
- No passwords or Claude session cookies

## Permissions (extension)

| Permission | Why |
|------------|-----|
| `storage` | Save key and preferences on your machine |
| `activeTab` | Normal popup behavior |
| `https://claude.ai/*` | Show the counter on Claude |
| `https://api.anthropic.com/*` | Official count only, when you opt in |

## Children

Not directed at children under 13. Do not use the product if you are not allowed to use Claude / Anthropic services in your region.

## Changes

If this policy changes in a meaningful way, the date at the top will be updated in the repo.

## Contact

Open a GitHub issue on this repository for privacy questions about the open-source code.
