# Install

## Extension (Chrome / Edge / Brave / Arc)

### Option A — download whole repo as ZIP

1. Open https://github.com/someone405-ship-it/prompt-scale/archive/refs/heads/main.zip
2. Unzip
3. Open `chrome://extensions`
4. Enable **Developer mode**
5. **Load unpacked** → select the folder that contains `manifest.json` (not the `web/` folder)
6. Open https://claude.ai and start a chat

### Option B — git clone

```bash
git clone https://github.com/someone405-ship-it/prompt-scale.git
```

Then Load unpacked → that folder.

The counter is a small bar above the input. If you don’t see it, refresh the tab once.

### Optional official counts

1. Click the extension icon
2. Paste an Anthropic API key
3. Check “Use official count when key is present”
4. Save

## Web dashboard

```bash
git clone https://github.com/someone405-ship-it/prompt-scale.git
cd prompt-scale/web
npm install
npm run dev
```

Requires Node 18+.

## Uninstall

Extensions page → Remove. That also drops stored keys for the extension.
