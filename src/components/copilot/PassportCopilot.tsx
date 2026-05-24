"use client";

import { useState } from "react";
import type { CopilotResponse } from "@/types";
import { Sparkles, ImageIcon } from "lucide-react";

interface PassportCopilotProps {
  brandName?: string;
  embedded?: boolean;
  onApply?: (data: CopilotResponse) => void;
}

export default function PassportCopilot({ brandName, embedded, onApply }: PassportCopilotProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CopilotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const brandPrefix =
    brandName
      ?.replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 4)
      .toUpperCase() || "PP";

  const handleGenerate = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/passport-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, brandPrefix }),
      });
      if (!res.ok) throw new Error("Could not generate suggestions");
      setResult((await res.json()) as CopilotResponse);
    } catch {
      setError("Passport Copilot failed. Check your connection and try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        embedded
          ? "space-y-4"
          : "rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 p-6 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-teal-950/20"
      }
    >
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="pp-subheading">Passport Copilot</h3>
      </div>
      <p className="mt-1 text-sm pp-text">
        Paste rough notes — Copilot auto-fills product name, SKU, category, description, image,
        materials, and flags missing evidence.
      </p>
      <textarea
        className="pp-input mt-4 rounded-xl px-4 py-3"
        rows={4}
        placeholder='e.g. "Reusable tote bag, 70% recycled cotton, 30% recycled polyester. Made in Portugal. Wash cold."'
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !notes.trim()}
        className="mt-3 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Generating…" : "Generate passport draft"}
      </button>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 space-y-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-700">
          {result.greenClaimsWarnings.map((w) => (
            <p
              key={w}
              className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
            >
              ⚠ {w}
            </p>
          ))}

          <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            {result.imageUrl ? (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.imageUrl}
                  alt={result.productName}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
                <ImageIcon className="h-6 w-6" />
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-1">
              <p className="font-semibold text-slate-900 dark:text-slate-50">{result.productName}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {result.sku} · {result.category}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Description</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">{result.productDescription}</p>
          </div>

          {result.materials.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Materials</p>
              <ul className="mt-1 space-y-1">
                {result.materials.map((m) => (
                  <li key={m.name} className="text-slate-700 dark:text-slate-300">
                    {m.percentage}% {m.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.sustainabilitySummary && (
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Public summary</p>
              <p className="mt-1 text-slate-700 dark:text-slate-300">{result.sustainabilitySummary}</p>
            </div>
          )}

          {result.missingEvidenceChecklist.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-amber-700 dark:text-amber-400">
                Missing evidence
              </p>
              <ul className="mt-1 space-y-1">
                {result.missingEvidenceChecklist.map((item) => (
                  <li key={item} className="text-slate-600 dark:text-slate-400">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {onApply && (
            <button
              type="button"
              onClick={() => onApply(result)}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            >
              Apply to passport form
            </button>
          )}
        </div>
      )}
    </div>
  );
}
