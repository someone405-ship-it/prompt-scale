# Prompt Scale 1.0.0

Unofficial Chrome extension that estimates tokens for text you type on [claude.ai](https://claude.ai).

**Not affiliated with Anthropic.**

---

## Download

**Source ZIP:** https://github.com/someone405-ship-it/prompt-scale/archive/refs/heads/main.zip

```bash
git clone https://github.com/someone405-ship-it/prompt-scale.git
```

### Install extension

1. Unzip or clone
2. Chrome → `chrome://extensions` → Developer mode
3. **Load unpacked** → folder with `manifest.json`
4. Open Claude → counter appears above the input

[INSTALL.md](INSTALL.md)

---

## Features (1.0.0)

| Feature | Status |
|--------|--------|
| Live count above Claude composer | Yes |
| Local estimate | Yes |
| Official count with your API key | Yes |
| Claude.ai only | Yes |
| Privacy / disclaimer / terms | Yes |
| Web dashboard (`web/`) | Yes (local run) |
| Pro/Max usage meter | No (not available via normal API key) |
| Full PDF/DOCX parse | Not in 1.0.0 |

---

## Docs

| File | Topic |
|------|--------|
| [INSTALL.md](INSTALL.md) | Install |
| [PRIVACY.md](PRIVACY.md) | Privacy |
| [DISCLAIMER.md](DISCLAIMER.md) | Not affiliated, estimates, liability |
| [TERMS.md](TERMS.md) | Terms of use |
| [SECURITY.md](SECURITY.md) | Security |
| [NOTICE.md](NOTICE.md) | Trademarks |
| [CHANGELOG.md](CHANGELOG.md) | Changes |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contributions |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Conduct |
| [LICENSE](LICENSE) | MIT |

---

## Web app

```bash
cd web
npm install
npm run dev
```

---

## License

MIT — provided **as is**.
