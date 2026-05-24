"use client";

import type { Certification, PassportLevel, PassportDocument, ProductPassport } from "@/types";
import MaterialEditor from "./MaterialEditor";
import ClaimEditor from "./ClaimEditor";
import ComplianceScoreCard from "@/components/dashboard/ComplianceScoreCard";
import QRCodeCard from "./QRCodeCard";
import PassportCopilot from "@/components/copilot/PassportCopilot";
import { calculateComplianceScore } from "@/lib/compliance";

interface ProductPassportFormProps {
  passport: ProductPassport;
  documents: PassportDocument[];
  onChange: (passport: ProductPassport) => void;
  onSave?: () => void;
  saving?: boolean;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export default function ProductPassportForm({
  passport,
  documents,
  onChange,
  onSave,
  saving,
}: ProductPassportFormProps) {
  const compliance = calculateComplianceScore(passport, documents);

  const update = <K extends keyof ProductPassport>(field: K, value: ProductPassport[K]) => {
    onChange({ ...passport, [field]: value });
  };

  const updateLifecycle = (field: keyof ProductPassport["lifecycle"], value: string) => {
    onChange({
      ...passport,
      lifecycle: { ...passport.lifecycle, [field]: value },
    });
  };

  const updateCert = (index: number, field: keyof Certification, value: string) => {
    const certs = [...passport.certifications];
    certs[index] = { ...certs[index], [field]: value };
    update("certifications", certs);
  };

  const addCert = () => {
    update("certifications", [
      ...passport.certifications,
      {
        id: `cert-${Date.now()}`,
        name: "",
        issuer: "",
        expiryDate: "",
        visibility: "public",
      },
    ]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <PassportCopilot
          onApply={(suggestion) => {
            onChange({
              ...passport,
              description: suggestion.productDescription || passport.description,
              lifecycle: {
                ...passport.lifecycle,
                careInstructions:
                  suggestion.careInstructions || passport.lifecycle.careInstructions,
                recyclingInstructions:
                  suggestion.recyclingInstructions || passport.lifecycle.recyclingInstructions,
              },
              materials:
                suggestion.materials.length > 0
                  ? suggestion.materials.map((m, i) => ({
                      id: `mat-copilot-${i}`,
                      name: m.name,
                      percentage: m.percentage,
                      recycledContentPercentage: m.recycledContentPercentage,
                      sourceCountry: "",
                      supplierName: "",
                      evidenceStatus: "missing" as const,
                      visibility: "public" as const,
                    }))
                  : passport.materials,
            });
          }}
        />

        <Section title="Product identity">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Product name</label>
              <input
                className={inputClass}
                value={passport.productName}
                onChange={(e) => update("productName", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">SKU</label>
              <input className={inputClass} value={passport.sku} onChange={(e) => update("sku", e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Batch number</label>
              <input
                className={inputClass}
                value={passport.batchNumber}
                onChange={(e) => update("batchNumber", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
              <input
                className={inputClass}
                value={passport.category}
                onChange={(e) => update("category", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Brand name</label>
              <input
                className={inputClass}
                value={passport.brandName}
                onChange={(e) => update("brandName", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
              <textarea
                className={inputClass}
                rows={3}
                value={passport.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Product image URL</label>
              <input
                className={inputClass}
                placeholder="https://..."
                value={passport.imageUrl ?? ""}
                onChange={(e) => update("imageUrl", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Manufacturer</label>
              <input
                className={inputClass}
                value={passport.manufacturer}
                onChange={(e) => update("manufacturer", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Country of origin</label>
              <input
                className={inputClass}
                value={passport.countryOfOrigin}
                onChange={(e) => update("countryOfOrigin", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Production date</label>
              <input
                type="date"
                className={inputClass}
                value={passport.productionDate}
                onChange={(e) => update("productionDate", e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Passport level</label>
              <select
                className={inputClass}
                value={passport.passportLevel}
                onChange={(e) => update("passportLevel", e.target.value as PassportLevel)}
              >
                <option value="model">Model-level</option>
                <option value="batch">Batch-level</option>
                <option value="item">Item-level</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
              <select
                className={inputClass}
                value={passport.status}
                onChange={(e) => update("status", e.target.value as "draft" | "published")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </Section>

        <Section title="Materials">
          <MaterialEditor materials={passport.materials} onChange={(materials) => update("materials", materials)} />
        </Section>

        <Section title="Sustainability claims">
          <ClaimEditor claims={passport.claims} onChange={(claims) => update("claims", claims)} />
        </Section>

        <Section title="Care & lifecycle">
          <div className="grid gap-4">
            {(
              [
                ["careInstructions", "Care instructions"],
                ["repairInstructions", "Repair instructions"],
                ["reuseInstructions", "Reuse instructions"],
                ["resaleInstructions", "Resale instructions"],
                ["recyclingInstructions", "Recycling instructions"],
                ["endOfLifeGuidance", "End-of-life guidance"],
              ] as const
            ).map(([field, label]) => (
              <div key={field}>
                <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
                <textarea
                  className={inputClass}
                  rows={2}
                  value={passport.lifecycle[field]}
                  onChange={(e) => updateLifecycle(field, e.target.value)}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Certifications">
          <div className="space-y-4">
            {passport.certifications.map((cert, index) => (
              <div key={cert.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
                <input placeholder="Certificate name" className={inputClass} value={cert.name} onChange={(e) => updateCert(index, "name", e.target.value)} />
                <input placeholder="Issuer" className={inputClass} value={cert.issuer} onChange={(e) => updateCert(index, "issuer", e.target.value)} />
                <input type="date" className={inputClass} value={cert.expiryDate} onChange={(e) => updateCert(index, "expiryDate", e.target.value)} />
                <input placeholder="Document URL" className={inputClass} value={cert.documentUrl ?? ""} onChange={(e) => updateCert(index, "documentUrl", e.target.value)} />
              </div>
            ))}
            <button type="button" onClick={addCert} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              + Add certification
            </button>
          </div>
        </Section>

        {onSave && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save passport"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <ComplianceScoreCard compliance={compliance} />
        {passport.publicId && passport.productName && (
          <QRCodeCard publicId={passport.publicId} productName={passport.productName} />
        )}
      </div>
    </div>
  );
}
