"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/usage", label: "Claude Usage" },
  { href: "/counter", label: "Token Counter" },
  { href: "/files", label: "File Analyzer" },
  { href: "/optimizer", label: "Prompt Optimizer" },
  { href: "/cost", label: "Cost Calculator" },
  { href: "/context", label: "Context Manager" },
  { href: "/analytics", label: "Analytics" },
  { href: "/library", label: "Prompt Library" },
  { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface flex flex-col py-6 px-3">
      <div className="px-3 mb-8">
        <span className="text-lg font-semibold tracking-tight text-white">
          Prompt Scale
        </span>
        <p className="text-xs text-muted mt-1">Claude token intelligence</p>
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-violet/15 text-violet-soft font-medium"
                  : "text-muted hover:text-white hover:bg-white/5"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-3 pt-6 text-[11px] text-muted">
        Local estimates · Optional official API count
      </div>
    </aside>
  );
}
