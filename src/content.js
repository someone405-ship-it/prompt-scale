/**
 * Prompt Scale – content script
 * Injects a plain counter above the Claude composer.
 * Only runs on claude.ai. Does not touch other sites.
 */

(function () {
  "use strict";

  if (window.__promptScaleLoaded) return;
  window.__promptScaleLoaded = true;

  const ROOT_ID = "prompt-scale-root";
  let debounceTimer = null;
  let currentModel = "claude-sonnet-5-5";
  let useOfficial = false;
  let apiKey = null;
  let fileTokens = 0;
  let fileList = [];

  // Rough local estimate. Claude is not OpenAI; this is only a stand-in.
  // Real count needs the official endpoint + key.
  function estimateTokens(text) {
    if (!text || !text.trim()) return 0;
    // Typical English: ~3.5–4.5 chars per token. Use 4 as midpoint.
    const chars = text.length;
    return Math.max(1, Math.round(chars / 4));
  }

  function findComposer() {
    const candidates = [
      'div[contenteditable="true"].ProseMirror',
      'div[contenteditable="true"][data-testid]',
      'div.ProseMirror[contenteditable="true"]',
      '[data-testid="chat-input"] div[contenteditable="true"]',
      'fieldset div[contenteditable="true"]',
      'div[contenteditable="true"][role="textbox"]'
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el && el.isContentEditable) return el;
    }
    return null;
  }

  function findComposerContainer(composer) {
    if (!composer) return null;
    let node = composer;
    for (let i = 0; i < 8; i++) {
      if (!node.parentElement) break;
      node = node.parentElement;
      if (node.tagName === "FIELDSET" || (node.getAttribute("data-testid") || "").includes("input") ||
          (node.classList && node.classList.contains("flex"))) {
        return node;
      }
    }
    return composer.parentElement || composer;
  }

  function getComposerText(composer) {
    if (!composer) return "";
    return (composer.innerText || composer.textContent || "").trim();
  }

  function createBar() {
    let root = document.getElementById(ROOT_ID);
    if (root) return root;
    root = document.createElement("div");
    root.id = ROOT_ID;
    root.innerHTML = `
      <div class="ps-bar">
        <span>prompt <strong id="ps-prompt">0</strong></span>
        <span class="ps-files">files <strong id="ps-files">0</strong></span>
        <span>total <strong id="ps-total">0</strong></span>
        <span class="ps-meta" id="ps-meta">estimate · local</span>
        <span class="ps-warn ps-hidden" id="ps-warn"></span>
      </div>
    `;
    return root;
  }

  function placeBar() {
    const composer = findComposer();
    if (!composer) return false;
    const root = createBar();
    if (document.getElementById(ROOT_ID) && root.parentElement) return true;
    const container = findComposerContainer(composer);
    if (!container) return false;
    if (container.parentElement) {
      container.parentElement.insertBefore(root, container);
    } else {
      container.insertBefore(root, container.firstChild);
    }
    return true;
  }

  function updateDisplay(promptTokens, methodLabel) {
    const p = document.getElementById("ps-prompt");
    const f = document.getElementById("ps-files");
    const t = document.getElementById("ps-total");
    const m = document.getElementById("ps-meta");
    if (!p) return;
    p.textContent = promptTokens.toLocaleString();
    f.textContent = fileTokens.toLocaleString();
    t.textContent = (promptTokens + fileTokens).toLocaleString();
    m.textContent = methodLabel;
  }

  async function countOfficial(text) {
    if (!apiKey || !text) return null;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages/count_tokens", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: currentModel,
          messages: [{ role: "user", content: text }]
        })
      });
      if (!res.ok) return null;
      const data = await res.json();
      return typeof data.input_tokens === "number" ? data.input_tokens : null;
    } catch {
      return null;
    }
  }

  async function refresh() {
    const composer = findComposer();
    const text = getComposerText(composer);
    let promptTokens = estimateTokens(text);
    let method = "estimate · local";
    if (useOfficial && apiKey && text) {
      const official = await countOfficial(text);
      if (official !== null) {
        promptTokens = official;
        method = "official · " + currentModel.replace("claude-", "");
      } else {
        method = "estimate · key failed";
      }
    }
    updateDisplay(promptTokens, method);
  }

  function scheduleRefresh() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(refresh, 180);
  }

  function observeComposer() {
    const composer = findComposer();
    if (!composer) return;
    const mo = new MutationObserver(scheduleRefresh);
    mo.observe(composer, { childList: true, characterData: true, subtree: true });
    composer.addEventListener("input", scheduleRefresh, { passive: true });
    composer.addEventListener("keyup", scheduleRefresh, { passive: true });
    composer.addEventListener("paste", () => setTimeout(scheduleRefresh, 50), { passive: true });
  }

  function loadSettings() {
    chrome.storage.local.get(["ps_api_key", "ps_model", "ps_use_official"], (data) => {
      apiKey = data.ps_api_key || null;
      currentModel = data.ps_model || "claude-sonnet-5-5";
      useOfficial = !!data.ps_use_official && !!apiKey;
      scheduleRefresh();
    });
  }

  function boot() {
    if (!location.hostname.includes("claude.ai")) return;
    let tries = 0;
    const interval = setInterval(() => {
      tries++;
      if (placeBar()) {
        clearInterval(interval);
        observeComposer();
        loadSettings();
        scheduleRefresh();
      }
      if (tries > 40) clearInterval(interval);
    }, 400);
    const bodyObs = new MutationObserver(() => {
      if (!document.getElementById(ROOT_ID)) {
        placeBar();
        observeComposer();
      }
    });
    bodyObs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") loadSettings();
  });
})();
