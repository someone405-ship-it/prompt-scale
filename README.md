# Prompt Scale

Plain extension that shows a rough token estimate for whatever you type on [claude.ai](https://claude.ai).

It sits just above the message box. Only works when you have a Claude tab open.

## What it does

- Watches the text you type or paste in the Claude composer
- Shows an estimate of tokens for that text
- Optional: if you put your own Anthropic API key in the popup, it can call Anthropic’s official `/v1/messages/count_tokens` endpoint for a better number
- Does not send your prompts anywhere else
- Does not work on ChatGPT, Grok, Gemini, or any other site

## Accuracy

Without a key the number is a **local estimate** (roughly characters ÷ 4).  
With a key it uses Anthropic’s official count for the model you pick.  
Either way this is only the visible text you are typing — not system prompts, history, tools, or images Claude may also bill.

## Install (Chrome / Edge / Brave)

1. Download the release ZIP or clone this repo
2. Unzip if needed
3. Go to `chrome://extensions` (or `edge://extensions`)
4. Turn on **Developer mode**
5. Click **Load unpacked**
6. Select the folder that contains `manifest.json`

You should see a small scale icon in the toolbar. Open a Claude tab and the counter appears above the input.

## Privacy

- API key (if any) lives only in `chrome.storage.local`
- No analytics, no third-party servers
- Content script only runs on `https://claude.ai/*`

## Name

Called Prompt Scale on purpose. Not “AI Token Pro” or anything that sounds generated.

## License

MIT
