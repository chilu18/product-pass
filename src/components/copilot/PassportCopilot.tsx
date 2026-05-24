"use client";

import { useState } from "react";
import type { CopilotResponse } from "@/types";
import { Sparkles } from "lucide-react";

interface PassportCopilotProps {
  onApply?: (data: CopilotResponse) => void;
}

export default function PassportCopilot({ onApply }: PassportCopilotProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CopilotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!notes.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/passport-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
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
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-slate-900">Passport Copilot</h3>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Paste rough product notes — get structured suggestions and evidence warnings.
      </p>
      <textarea
        className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
        rows={4}
        placeholder='e.g. "80% organic cotton, 20% recycled polyester. Made in Portugal. Wash cold. Recyclable."'
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !notes.trim()}
        className="mt-3 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Generating…" : "Generate suggestions"}
      </button>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-6 space-y-4 border-t border-slate-200 pt-6 text-sm">
          {result.greenClaimsWarnings.map((w) => (
            <p key={w} className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              ⚠ {w}
            </p>
          ))}
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Description</p>
            <p className="mt-1 text-slate-700">{result.productDescription}</p>
          </div>
          {result.materials.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">Materials</p>
              <ul className="mt-1 space-y-1">
                {result.materials.map((m) => (
                  <li key={m.name} className="text-slate-700">
                    {m.percentage}% {m.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.missingEvidenceChecklist.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-amber-700">Missing evidence</p>
              <ul className="mt-1 space-y-1">
                {result.missingEvidenceChecklist.map((item) => (
                  <li key={item} className="text-slate-600">• {item}</li>
                ))}
              </ul>
            </div>
          )}
          {onApply && (
            <button
              type="button"
              onClick={() => onApply(result)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
            >
              Apply to form
            </button>
          )}
        </div>
      )}
    </div>
  );
}
