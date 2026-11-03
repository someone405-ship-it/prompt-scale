/**
 * Prompt Scale service worker
 * Handles official token counts (avoids content-script host limits)
 */

chrome.runtime.onInstalled.addListener(() => {});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "count_tokens") {
    countTokens(msg.apiKey, msg.model, msg.text)
      .then((n) => sendResponse({ ok: true, tokens: n }))
      .catch((err) => sendResponse({ ok: false, error: String(err) }));
    return true;
  }
  return false;
});

async function countTokens(apiKey, model, text) {
  if (!apiKey || !text) return null;
  const res = await fetch("https://api.anthropic.com/v1/messages/count_tokens", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: model || "claude-sonnet-5-5",
      messages: [{ role: "user", content: text }],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error("count_tokens " + res.status + " " + body.slice(0, 120));
  }
  const data = await res.json();
  return typeof data.input_tokens === "number" ? data.input_tokens : null;
}
