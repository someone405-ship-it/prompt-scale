/**
 * Prompt Scale – token estimation utilities
 * Official counts use Anthropic /v1/messages/count_tokens when a key is present.
 * Local estimate is a transparent approximation only.
 */

export type ClaudeModel =
  | "claude-haiku-5-5"
  | "claude-sonnet-5-5"
  | "claude-opus-5-5"
  | "claude-fable-5-1";

export const MODEL_LABELS: Record<ClaudeModel, string> = {
  "claude-haiku-5-5": "Haiku 5.5",
  "claude-sonnet-5-5": "Sonnet 5.5",
  "claude-opus-5-5": "Opus 5.5",
  "claude-fable-5-1": "Fable 5.1",
};

export const CONTEXT_LIMITS: Record<ClaudeModel, number> = {
  "claude-haiku-5-5": 1_000_000,
  "claude-sonnet-5-5": 1_000_000,
  "claude-opus-5-5": 1_000_000,
  "claude-fable-5-1": 1_000_000,
};

export function estimateTokensLocal(text: string): number {
  if (!text || !text.trim()) return 0;
  return Math.max(1, Math.round(text.length / 4));
}

export function wordCount(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function charCount(text: string): number {
  return text.length;
}

export function lineCount(text: string): number {
  if (!text) return 0;
  return text.split(/\r\n|\r|\n/).length;
}

export const PRICING: Record<
  ClaudeModel,
  { input: number; output: number; cacheRead: number }
> = {
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheRead: 0.01 },
  "claude-sonnet-5-5": { input: 2.0, output: 10.0, cacheRead: 0.1 },
  "claude-opus-5-5": { input: 4.0, output: 20.0, cacheRead: 0.2 },
  "claude-fable-5-1": { input: 10.0, output: 50.0, cacheRead: 0.25 },
};

export function estimateCostUSD(
  model: ClaudeModel,
  inputTokens: number,
  outputTokens: number
): number {
  const p = PRICING[model];
  return (inputTokens / 1_000_000) * p.input + (outputTokens / 1_000_000) * p.output;
}

export async function countTokensOfficial(
  apiKey: string,
  model: ClaudeModel,
  text: string
): Promise<number | null> {
  if (!apiKey || !text) return null;
  try {
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
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.input_tokens === "number" ? data.input_tokens : null;
  } catch {
    return null;
  }
}
