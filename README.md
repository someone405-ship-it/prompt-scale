# Prompt Scale

Small Chrome extension (and optional web tools) that estimates how many tokens your text would use with Claude.

Only runs on [claude.ai](https://claude.ai).

---

## Download

**Full source ZIP (use this):**  
https://github.com/someone405-ship-it/prompt-scale/archive/refs/heads/main.zip

**Or clone:**
```bash
git clone https://github.com/someone405-ship-it/prompt-scale.git
```

Repo: https://github.com/someone405-ship-it/prompt-scale

Step-by-step: [INSTALL.md](INSTALL.md)

### Load in Chrome

1. Unzip (or clone)
2. `chrome://extensions` → Developer mode on
3. **Load unpacked** → folder that has `manifest.json`
4. Open Claude → bar shows above the message box

---

## What it does

- Watches the text in Claude’s composer
- Shows a rough token estimate (chars ÷ 4) by default
- Optional official count if you paste your Anthropic API key in the popup
- Key stays on your machine; only goes to Anthropic’s count endpoint when you opt in

## What it does not do

- No Pro/Max usage meter (Anthropic doesn’t give that to third-party apps via a normal key)
- No auto-send, no history scraping, no other AI sites
- File total in the bar is still 0 until attachment parsing lands

## Web folder

`web/` is a Next.js dashboard: calculator, model suggestion, text file drop, cost math, local optimizer.

```bash
cd web && npm install && npm run dev
```

## Docs

- [INSTALL.md](INSTALL.md)
- [PRIVACY.md](PRIVACY.md)
- [CHANGELOG.md](CHANGELOG.md)

## License

MIT
