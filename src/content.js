/**
 * Prompt Scale – content script
 * Injects a counter above the Claude composer. Claude.ai only.
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
  let observedComposer = null;
  let composerObserver = null;

  function estimateTokens(text) {
    if (!text || !text.trim()) return 0;
    return Math.max(1, Math.round(text.length / 4));
  }

  function findComposer() {
    const candidates = [
      'div[contenteditable="true"].ProseMirror',
      'div.ProseMirror[contenteditable="true"]',
      '[data-testid="chat-input"] div[contenteditable="true"]',
      'fieldset div[contenteditable="true"]',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"][data-testid]',
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el && el.isContentEditable) return el;
    }
    const all = document.querySelectorAll('div[contenteditable="true"]');
    let best = null;
    let bestArea = 0;
    all.forEach((el) => {
      const r = el.getBoundingClientRect();
      const area = r.width * r.height;
      if (area > bestArea && r.width > 100) {
        bestArea = area;
        best = el;
      }
    });
    return best;
  }

  function findComposerContainer(composer) {
    if (!composer) return null;
    let node = composer;
    for (let i = 0; i < 10; i++) {
      if (!node.parentElement) break;
      node = node.parentElement;
      if (
        node.tagName === "FIELDSET" ||
        (node.getAttribute("data-testid") || "").includes("input") ||
        (node.classList && node.classList.contains("flex") && node.offsetHeight < 400)
      ) {
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
    root.innerHTML =
      '<div class="ps-bar">' +
      '<span>prompt <strong id="ps-prompt">0</strong></span>' +
      '<span class="ps-files">files <strong id="ps-files">0</strong></span>' +
      '<span>total <strong id="ps-total">0</strong></span>' +
      '<span class="ps-meta" id="ps-meta">estimate · local</span>' +
      "</div>";
    return root;
  }

  function placeBar() {
    if (document.getElementById(ROOT_ID)) return true;
    const composer = findComposer();
    if (!composer) return false;
    const container = findComposerContainer(composer);
    const root = createBar();
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
    if (f) f.textContent = fileTokens.toLocaleString();
    if (t) t.textContent = (promptTokens + fileTokens).toLocaleString();
    if (m) m.textContent = methodLabel;
  }

  function countOfficial(text) {
    return new Promise((resolve) => {
      if (!apiKey || !text) {
        resolve(null);
        return;
      }
      try {
        chrome.runtime.sendMessage(
          {
            type: "count_tokens",
            apiKey: apiKey,
            model: currentModel,
            text: text,
          },
          (resp) => {
            if (chrome.runtime.lastError) {
              resolve(null);
              return;
            }
            if (resp && resp.ok && typeof resp.tokens === "number") {
              resolve(resp.tokens);
            } else {
              resolve(null);
            }
          }
        );
      } catch {
        resolve(null);
      }
    });
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
        method = "official · " + String(currentModel).replace("claude-", "");
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
    if (observedComposer === composer) return;

    if (composerObserver) {
      try {
        composerObserver.disconnect();
      } catch (_) {}
    }
    observedComposer = composer;
    composerObserver = new MutationObserver(scheduleRefresh);
    composerObserver.observe(composer, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    composer.addEventListener("input", scheduleRefresh, { passive: true });
    composer.addEventListener("keyup", scheduleRefresh, { passive: true });
    composer.addEventListener(
      "paste",
      function () {
        setTimeout(scheduleRefresh, 50);
      },
      { passive: true }
    );
  }

  function loadSettings() {
    chrome.storage.local.get(
      ["ps_api_key", "ps_model", "ps_use_official"],
      function (data) {
        apiKey = data.ps_api_key || null;
        currentModel = data.ps_model || "claude-sonnet-5-5";
        useOfficial = !!data.ps_use_official && !!apiKey;
        scheduleRefresh();
      }
    );
  }

  function boot() {
    if (!location.hostname.includes("claude.ai")) return;

    let tries = 0;
    const interval = setInterval(function () {
      tries++;
      if (placeBar()) {
        clearInterval(interval);
        observeComposer();
        loadSettings();
        scheduleRefresh();
      }
      if (tries > 50) clearInterval(interval);
    }, 400);

    const bodyObs = new MutationObserver(function () {
      if (!document.getElementById(ROOT_ID)) {
        if (placeBar()) {
          observeComposer();
        }
      } else {
        observeComposer();
      }
    });
    if (document.body) {
      bodyObs.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === "local") loadSettings();
  });
})();
