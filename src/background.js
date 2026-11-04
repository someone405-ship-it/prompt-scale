/**
 * Prompt Scale service worker
 * Official Anthropic count_tokens + multi-provider key storage helpers
 */

const PROVIDERS = {
  anthropic: {
    id: "anthropic",
    label: "Anthropic",
    countUrl: "https://api.anthropic.com/v1/messages/count_tokens",
    official: true,
  },
  openai: {
    id: "openai",
    label: "OpenAI",
    official: false,
    note: "No public count_tokens endpoint; local estimate",
  },
  groq: {
    id: "groq",
    label: "Groq",
    official: false,
    note: "Local estimate (OpenAI-compatible API has no count endpoint)",
  },
  openrouter: {
    id: "openrouter",
    label: "OpenRouter",
    official: false,
    note: "Local estimate",
  },
  custom: {
    id: "custom",
    label: "Custom OpenAI-compatible",
    official: false,
    note: "Together, Fireworks, local gateways, agent routers, etc.",
  },
};

chrome.runtime.onInstalled.addListener(() => {});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "count_tokens") {
    countTokens(msg)
      .then((result) => sendResponse({ ok: true, ...result }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  if (msg?.type === "list_providers") {
    sendResponse({ ok: true, providers: PROVIDERS });
    return false;
  }
  return false;
});

async function countTokens(msg) {
  const provider = msg.provider || "anthropic";
  const text = msg.text || "";
  const model = msg.model || "claude-sonnet-5-5";
  const apiKey = msg.apiKey || null;

  if (!text) return { tokens: 0, method: "empty" };

  if (provider === "anthropic" && apiKey) {
    const res = await fetch("https://api.anthropic.com/v1/messages/count_tokens", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: text }],
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error("anthropic " + res.status + " " + body.slice(0, 100));
    }
    const data = await res.json();
    if (typeof data.input_tokens === "number") {
      return { tokens: data.input_tokens, method: "official · anthropic" };
    }
  }

  const tokens = Math.max(1, Math.round(text.length / 4));
  const label =
    provider === "anthropic"
      ? "estimate · local (no key or key failed)"
      : "estimate · local (" + provider + ")";
  return { tokens, method: label };
}
