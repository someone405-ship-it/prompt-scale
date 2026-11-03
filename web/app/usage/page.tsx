"use client";

import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function UsagePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Claude Usage</h1>
          <p className="text-sm text-muted mt-1">
            Two different systems. Do not mix them up.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Claude.ai subscription (Pro / Max / Team)
            </h2>
            <div className="h-3 rounded-full bg-bg mb-4 overflow-hidden">
              <div className="h-full w-0 bg-muted" />
            </div>
            <p className="text-3xl font-semibold text-muted mb-2">Unavailable</p>
            <p className="text-sm text-muted">
              Anthropic does not expose personal subscription usage bars to third-party
              apps via a normal API key. Prompt Scale will never invent a percentage.
            </p>
            <p className="text-sm text-muted mt-3">
              Check usage inside Claude: Settings → Usage, or in Claude Code run{" "}
              <code className="text-violet-soft">/usage</code>.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Anthropic API usage
            </h2>
            <p className="text-sm text-muted mb-4">
              Requires an Admin or Analytics key from the Claude Console (organization).
              A regular Messages API key is not enough for org-wide reports.
            </p>
            <p className="text-sm text-muted mb-4">
              Endpoints:{" "}
              <code className="text-xs">/v1/organizations/usage_report/messages</code> and
              cost report APIs.
            </p>
            <Link
              href="/settings"
              className="inline-block px-4 py-2 rounded-md bg-violet/20 text-violet-soft text-sm border border-violet/30"
            >
              Add Admin key in Settings
            </Link>
          </section>
        </div>

        <section className="mt-8 rounded-xl border border-border bg-card p-6 text-sm text-muted">
          <p className="text-white font-medium mb-2">What Prompt Scale can do with a key</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Official input token counts (Messages API key)</li>
            <li>Org API token/cost reports (Admin / Analytics key)</li>
            <li>Local estimates and cost forecasts without any key</li>
          </ul>
          <p className="mt-3">
            What it cannot do: read your Claude.ai chat history, cookies, password, or
            Pro/Max session limits.
          </p>
        </section>
      </main>
    </div>
  );
}
