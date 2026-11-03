/**
 * Model catalog + heuristics for Prompt Scale
 * Pricing/context from public Anthropic list pricing (Nov 2026).
 */

export type ClaudeModel =
  | "claude-haiku-5-5"
  | "claude-sonnet-5-5"
  | "claude-opus-5-5"
  | "claude-fable-5-1";

export interface ModelInfo {
  id: ClaudeModel;
  label: string;
  tier: "fast" | "balanced" | "strong" | "frontier";
  context: number;
  inputPerM: number;
  outputPerM: number;
  cacheReadPerM: number;
  bestFor: string;
}

export const MODELS: ModelInfo[] = [
  {
    id: "claude-haiku-5-5",
    label: "Haiku 5.5",
    tier: "fast",
    context: 1_000_000,
    inputPerM: 0.1,
    outputPerM: 0.5,
    cacheReadPerM: 0.01,
    bestFor: "Quick answers, high volume, low cost",
  },
  {
    id: "claude-sonnet-5-5",
    label: "Sonnet 5.5",
    tier: "balanced",
    context: 1_000_000,
    inputPerM: 2.0,
    outputPerM: 10.0,
    cacheReadPerM: 0.1,
    bestFor: "Everyday coding, agents, most product work",
  },
  {
    id: "claude-opus-5-5",
    label: "Opus 5.5",
    tier: "strong",
    context: 1_000_000,
    inputPerM: 4.0,
    outputPerM: 20.0,
    cacheReadPerM: 0.2,
    bestFor: "Hard reasoning, large refactors, complex agents",
  },
  {
    id: "claude-fable-5-1",
    label: "Fable 5.1",
    tier: "frontier",
    context: 1_000_000,
    inputPerM: 10.0,
    outputPerM: 50.0,
    cacheReadPerM: 0.25,
    bestFor: "Long-running agents, frontier research tasks",
  },
];

export const MODEL_MAP = Object.fromEntries(MODELS.map((m) => [m.id, m])) as Record<
  ClaudeModel,
  ModelInfo
>;

export function estimateTokensLocal(text: string): number {
  if (!text?.trim()) return 0;
  return Math.max(1, Math.round(text.length / 4));
}

/** Heuristic: suggest a model from prompt size + keywords. Not magic. */
export function suggestModel(text: string): {
  model: ClaudeModel;
  reason: string;
  confidence: "low" | "medium" | "high";
} {
  const t = text.trim();
  if (!t) {
    return {
      model: "claude-sonnet-5-5",
      reason: "Default balanced model when prompt is empty",
      confidence: "low",
    };
  }
  const tokens = estimateTokensLocal(t);
  const lower = t.toLowerCase();

  const frontierHints =
    /multi[- ]?day|autonomous agent|research paper|frontier|novel algorithm|prove that|formal verification/.test(
      lower
    );
  const strongHints =
    /refactor entire|architecture|system design|migrate|complex agent|debug production|security audit|prove|reason step by step/.test(
      lower
    );
  const codingHints =
    /code|implement|function|typescript|python|api|component|bug|test|docker|sql/.test(
      lower
    );
  const simpleHints =
    /summarize|translate|what is|define|list|short answer|yes or no|one sentence/.test(
      lower
    );

  if (frontierHints || tokens > 80_000) {
    return {
      model: "claude-fable-5-1",
      reason: "Long or frontier-style task — Fable is the top tier",
      confidence: frontierHints ? "medium" : "low",
    };
  }
  if (strongHints || tokens > 25_000) {
    return {
      model: "claude-opus-5-5",
      reason: "Hard reasoning or large context — Opus recommended",
      confidence: strongHints ? "medium" : "low",
    };
  }
  if (simpleHints && tokens < 800 && !codingHints) {
    return {
      model: "claude-haiku-5-5",
      reason: "Short simple request — Haiku is cheapest and fast",
      confidence: "medium",
    };
  }
  return {
    model: "claude-sonnet-5-5",
    reason: codingHints
      ? "Coding / product work — Sonnet is the usual daily driver"
      : "General task — Sonnet is a solid default",
    confidence: codingHints ? "medium" : "low",
  };
}

export function estimateCostUSD(
  model: ClaudeModel,
  inputTokens: number,
  outputTokens: number
): number {
  const m = MODEL_MAP[model];
  return (inputTokens / 1e6) * m.inputPerM + (outputTokens / 1e6) * m.outputPerM;
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
