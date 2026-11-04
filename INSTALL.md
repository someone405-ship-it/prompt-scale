# Install

## Chrome / Edge / Brave (Windows, Mac, Linux)

### Important (this is the usual failure)

After unzip, you must select the folder that **directly contains** `manifest.json`.

Wrong:
```
Downloads/prompt-scale-main     ← sometimes this is only a wrapper
```

Right: open that folder and check you see `manifest.json` in the list, then select **that** folder.

If you see:
```
prompt-scale-main/
  prompt-scale-main/
    manifest.json
```
select the **inner** `prompt-scale-main` folder.

### Steps

1. Download the extension ZIP from the release artifacts or clone the repo
2. Unzip completely (not open the zip as a folder in some browsers)
3. Open `chrome://extensions` (or `edge://extensions`)
4. Enable **Developer mode**
5. **Load unpacked**
6. Choose the folder where `manifest.json` is visible next to `popup.html` and `src/`
7. Open https://claude.ai and refresh the page

### Optional official counts

1. Click the extension icon
2. Paste Anthropic API key
3. Check “Use official count”
4. Save

### Web dashboard

```bash
cd web
npm install
npm run dev
```

### Uninstall

Extensions page → Remove.
