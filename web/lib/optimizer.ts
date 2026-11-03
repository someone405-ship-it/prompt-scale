/**
 * Rule-based prompt optimizer (local only).
 * Never overwrites without user approval.
 */

export type OptLevel = "light" | "balanced" | "aggressive";

export interface OptIssue {
  type: string;
  detail: string;
  severity: "info" | "warn";
}

export interface OptResult {
  original: string;
  optimized: string;
  issues: OptIssue[];
  tokensBefore: number;
  tokensAfter: number;
  saved: number;
  pct: number;
}

function estimate(t: string) {
  return Math.max(0, Math.round((t || "").length / 4));
}

function collapseWhitespace(s: string): string {
  return s
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function removeFiller(s: string, aggressive: boolean): string {
  let out = s;
  const fillers = aggressive
    ? [
        /\bplease\b/gi,
        /\bkindly\b/gi,
        /\bi would like you to\b/gi,
        /\bcould you please\b/gi,
        /\bif you don't mind\b/gi,
        /\bas much as possible\b/gi,
        /\bin your own words\b/gi,
        /\bmake sure to\b/gi,
      ]
    : [/\bcould you please\b/gi, /\bi would like you to\b/gi];
  for (const re of fillers) out = out.replace(re, "");
  return collapseWhitespace(out);
}

function dedupeLines(s: string): string {
  const lines = s.split(/\r\n|\r|\n/);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of lines) {
    const key = line.trim().toLowerCase();
    if (!key) {
      out.push(line);
      continue;
    }
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out.join("\n");
}

function stripRepeatedPhrases(s: string): string {
  const parts = s.split(/(?<=[.!?])\s+/);
  const seen = new Set<string>();
  const kept: string[] = [];
  for (const p of parts) {
    const k = p.trim().toLowerCase();
    if (k.length < 12) {
      kept.push(p);
      continue;
    }
    if (seen.has(k)) continue;
    seen.add(k);
    kept.push(p);
  }
  return kept.join(" ");
}

export function optimizePrompt(text: string, level: OptLevel = "balanced"): OptResult {
  const original = text;
  const issues: OptIssue[] = [];
  let optimized = text;

  if (!text.trim()) {
    return {
      original,
      optimized: "",
      issues: [],
      tokensBefore: 0,
      tokensAfter: 0,
      saved: 0,
      pct: 0,
    };
  }

  const before = estimate(original);
  optimized = collapseWhitespace(optimized);

  const deduped = dedupeLines(optimized);
  if (deduped.length < optimized.length - 20) {
    issues.push({
      type: "duplicates",
      detail: "Removed duplicate lines",
      severity: "warn",
    });
    optimized = deduped;
  }

  optimized = stripRepeatedPhrases(optimized);

  if (level !== "light") {
    const cleaned = removeFiller(optimized, level === "aggressive");
    if (cleaned.length < optimized.length - 10) {
      issues.push({
        type: "filler",
        detail: "Removed polite filler phrases",
        severity: "info",
      });
      optimized = cleaned;
    }
  }

  if (level === "aggressive") {
    optimized = optimized.replace(/(for example[:,]?\s*){2,}/gi, "for example, ");
  }

  if (
    /\b(good|nice|better|improve|make it better)\b/i.test(original) &&
    !/\b(must|should|requirement|constraint|accept|reject)\b/i.test(original)
  ) {
    issues.push({
      type: "vague",
      detail: "Prompt may be vague — consider adding explicit requirements",
      severity: "warn",
    });
  }

  if (original.length > 4000 && !/^#+\s/m.test(original)) {
    issues.push({
      type: "structure",
      detail: "Long prompt without headings — consider sectioning with markdown",
      severity: "info",
    });
  }

  optimized = collapseWhitespace(optimized);
  const after = estimate(optimized);
  const saved = Math.max(0, before - after);
  const pct = before > 0 ? Math.round((saved / before) * 1000) / 10 : 0;

  return {
    original,
    optimized,
    issues,
    tokensBefore: before,
    tokensAfter: after,
    saved,
    pct,
  };
}
