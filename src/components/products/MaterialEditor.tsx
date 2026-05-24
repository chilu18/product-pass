"use client";

import type { Material } from "@/types";
import EvidenceStatusBadge from "@/components/evidence/EvidenceStatusBadge";
import { Plus, Trash2 } from "lucide-react";

interface MaterialEditorProps {
  materials: Material[];
  onChange: (materials: Material[]) => void;
}

function newMaterial(): Material {
  return {
    id: `mat-${Date.now()}`,
    name: "",
    percentage: 0,
    recycledContentPercentage: 0,
    sourceCountry: "",
    supplierName: "",
    evidenceStatus: "missing",
    visibility: "public",
  };
}

export default function MaterialEditor({ materials, onChange }: MaterialEditorProps) {
  const update = (index: number, field: keyof Material, value: string | number) => {
    const next = [...materials];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(materials.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {materials.map((mat, index) => (
        <div key={mat.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Material {index + 1}</span>
            <div className="flex items-center gap-2">
              <EvidenceStatusBadge status={mat.evidenceStatus} />
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Material name"
              value={mat.name}
              onChange={(e) => update(index, "name", e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Percentage"
              value={mat.percentage || ""}
              onChange={(e) => update(index, "percentage", Number(e.target.value))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Recycled content %"
              value={mat.recycledContentPercentage || ""}
              onChange={(e) => update(index, "recycledContentPercentage", Number(e.target.value))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              placeholder="Source country"
              value={mat.sourceCountry}
              onChange={(e) => update(index, "sourceCountry", e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              placeholder="Supplier name"
              value={mat.supplierName}
              onChange={(e) => update(index, "supplierName", e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
            />
            <select
              value={mat.evidenceStatus}
              onChange={(e) => update(index, "evidenceStatus", e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="missing">Missing</option>
              <option value="uploaded">Uploaded</option>
              <option value="needs_review">Needs review</option>
              <option value="verified">Verified</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...materials, newMaterial()])}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
      >
        <Plus className="h-4 w-4" />
        Add material
      </button>
    </div>
  );
}
