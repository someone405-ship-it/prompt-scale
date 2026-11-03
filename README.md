# Prompt Scale

Small Chrome extension + optional web dashboard for estimating how many tokens your Claude prompts use.

Works only on [claude.ai](https://claude.ai). Does not run on ChatGPT, Gemini, or anywhere else.

## Download the extension

**v1.0.1 ZIP (load as unpacked):**

→ [prompt-scale-v1.0.1.zip](https://github.com/someone405-ship-it/prompt-scale/raw/main/dist/prompt-scale-v1.0.1.zip)

If that link 404s, clone the repo and use the folder that contains `manifest.json`.

### Install

1. Download and unzip, **or** clone this repo
2. Open `chrome://extensions` (or Edge / Brave equivalent)
3. Turn on **Developer mode**
4. **Load unpacked** → select the folder with `manifest.json`
5. Open a Claude tab. A thin bar appears above the message box.

To remove it, remove the extension from the same page.

## What it actually does

- Counts the text you type or paste in the Claude composer
- Local estimate by default (characters ÷ 4). Rough, not Claude’s exact tokenizer
- Optional: paste your own Anthropic API key in the popup → uses the official `count_tokens` endpoint
- Key stays in `chrome.storage.local` on your machine. Only sent to Anthropic when you enable official count

## What it does not do

- Does not read your Claude Pro/Max usage bars (Anthropic does not expose those to third-party extensions via a normal API key)
- Does not send messages, click buttons, or scrape chat history
- Does not work offline for official counts (needs network to Anthropic)
- File token total in the bar is still a placeholder (0) until attachment parsing is finished

## Web app (`web/`)

Optional Next.js dashboard for the same ideas: prompt calculator, auto model suggestion, file drop for plain text, cost estimate, local optimizer, settings.

```bash
cd web
npm install
npm run dev
```

Then open http://localhost:3000

## Accuracy

| Mode | Accuracy |
|------|----------|
| Local estimate | Approximate. Fine for a sense of size |
| Official (your key) | Anthropic’s count for that model’s input tokens |

Neither includes hidden system text, full conversation history, or multimodal image cost unless you put that content into the count yourself.

## Privacy

See [PRIVACY.md](PRIVACY.md). Short version: no analytics, no Prompt Scale servers, keys stay local.

## Layout

```
manifest.json     extension entry
src/              content script, background, popup
icons/            toolbar icons
web/              optional dashboard (Next.js)
dist/             release ZIP
```

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT. Do what you want.
