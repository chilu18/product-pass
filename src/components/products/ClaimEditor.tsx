"use client";

import type { ClaimType, SustainabilityClaim } from "@/types";
import { CLAIM_TYPE_LABELS } from "@/lib/constants";
import EvidenceStatusBadge from "@/components/evidence/EvidenceStatusBadge";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

interface ClaimEditorProps {
  claims: SustainabilityClaim[];
  onChange: (claims: SustainabilityClaim[]) => void;
}

function newClaim(): SustainabilityClaim {
  return {
    id: `claim-${Date.now()}`,
    text: "",
    claimType: "recycled",
    evidenceRequired: true,
    evidenceStatus: "missing",
    visibility: "public",
  };
}

export default function ClaimEditor({ claims, onChange }: ClaimEditorProps) {
  const update = (index: number, field: keyof SustainabilityClaim, value: string | boolean) => {
    const next = [...claims];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(claims.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {claims.map((claim, index) => (
        <div key={claim.id} className="pp-card-muted p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="pp-label">Claim {index + 1}</span>
            <div className="flex items-center gap-2">
              <EvidenceStatusBadge status={claim.evidenceStatus} />
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid gap-3">
            <input
              placeholder="Claim text"
              value={claim.text}
              onChange={(e) => update(index, "text", e.target.value)}
              className="pp-input"
            />
            <select
              value={claim.claimType}
              onChange={(e) => update(index, "claimType", e.target.value as ClaimType)}
              className="pp-input"
            >
              {Object.entries(CLAIM_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={claim.evidenceRequired}
                onChange={(e) => update(index, "evidenceRequired", e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-600"
              />
              Evidence required before publishing
            </label>
            {claim.evidenceRequired && claim.evidenceStatus === "missing" && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                Evidence required: attach a certificate, supplier declaration, audit record, or
                lifecycle assessment before publishing this claim.
              </div>
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...claims, newClaim()])}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700 dark:border-slate-600 dark:text-slate-400 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
      >
        <Plus className="h-4 w-4" />
        Add sustainability claim
      </button>
    </div>
  );
}
