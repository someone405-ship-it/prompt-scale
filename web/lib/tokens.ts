/** Re-exports + small helpers so existing imports keep working */
export {
  type ClaudeModel,
  MODELS,
  MODEL_MAP,
  estimateTokensLocal,
  suggestModel,
  estimateCostUSD,
  countTokensOfficial,
  wordCount,
  charCount,
  lineCount,
} from "./models";

import { MODEL_MAP, type ClaudeModel } from "./models";

export const MODEL_LABELS: Record<ClaudeModel, string> = {
  "claude-haiku-5-5": "Haiku 5.5",
  "claude-sonnet-5-5": "Sonnet 5.5",
  "claude-opus-5-5": "Opus 5.5",
  "claude-fable-5-1": "Fable 5.1",
};

export const CONTEXT_LIMITS: Record<ClaudeModel, number> = {
  "claude-haiku-5-5": MODEL_MAP["claude-haiku-5-5"].context,
  "claude-sonnet-5-5": MODEL_MAP["claude-sonnet-5-5"].context,
  "claude-opus-5-5": MODEL_MAP["claude-opus-5-5"].context,
  "claude-fable-5-1": MODEL_MAP["claude-fable-5-1"].context,
};

export const PRICING: Record<
  ClaudeModel,
  { input: number; output: number; cacheRead: number }
> = {
  "claude-haiku-5-5": { input: 0.1, output: 0.5, cacheRead: 0.01 },
  "claude-sonnet-5-5": { input: 2.0, output: 10.0, cacheRead: 0.1 },
  "claude-opus-5-5": { input: 4.0, output: 20.0, cacheRead: 0.2 },
  "claude-fable-5-1": { input: 10.0, output: 50.0, cacheRead: 0.25 },
};
