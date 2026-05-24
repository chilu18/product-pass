"use client";

import type { Certification, CopilotResponse, PassportLevel, PassportDocument, ProductPassport } from "@/types";
import MaterialEditor from "./MaterialEditor";
import ClaimEditor from "./ClaimEditor";
import ComplianceScoreCard from "@/components/dashboard/ComplianceScoreCard";
import QRCodeCard from "./QRCodeCard";
import PassportCopilot from "@/components/copilot/PassportCopilot";
import FormStepCarousel from "@/components/ui/FormStepCarousel";
import { calculateComplianceScore } from "@/lib/compliance";

interface ProductPassportFormProps {
  passport: ProductPassport;
  documents: PassportDocument[];
  onChange: (passport: ProductPassport) => void;
  onSave?: () => void;
  saving?: boolean;
}

const inputClass = "pp-input";

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

  const applyCopilot = (suggestion: CopilotResponse) => {
    onChange({
      ...passport,
      productName: suggestion.productName || passport.productName,
      sku: suggestion.sku || passport.sku,
      category: suggestion.category || passport.category,
      description: suggestion.productDescription || passport.description,
      imageUrl: suggestion.imageUrl || passport.imageUrl,
      lifecycle: {
        ...passport.lifecycle,
        careInstructions: suggestion.careInstructions || passport.lifecycle.careInstructions,
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
  };

  const saveButton = onSave ? (
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
    >
      {saving ? "Saving…" : "Save passport"}
    </button>
  ) : null;

  const steps = [
    {
      id: "copilot",
      title: "Quick start with Copilot",
      shortLabel: "Copilot",
      content: (
        <PassportCopilot brandName={passport.brandName} embedded onApply={applyCopilot} />
      ),
    },
    {
      id: "identity",
      title: "Product identity",
      shortLabel: "Identity",
      content: (
        <div className="grid gap-4 sm:grid-cols-2">
          {passport.imageUrl && (
            <div className="sm:col-span-2 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={passport.imageUrl}
                alt={passport.productName || "Product preview"}
                className="h-20 w-20 rounded-lg object-cover"
              />
              <p className="text-sm pp-text">Product image preview</p>
            </div>
          )}
          <div className="sm:col-span-2">
              <label className="mb-1 block pp-label">Product name</label>
            <input
              className={inputClass}
              value={passport.productName}
              onChange={(e) => update("productName", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block pp-label">SKU</label>
            <input className={inputClass} value={passport.sku} onChange={(e) => update("sku", e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block pp-label">Batch number</label>
            <input
              className={inputClass}
              value={passport.batchNumber}
              onChange={(e) => update("batchNumber", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block pp-label">Category</label>
            <input
              className={inputClass}
              value={passport.category}
              onChange={(e) => update("category", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block pp-label">Brand name</label>
            <input
              className={inputClass}
              value={passport.brandName}
              onChange={(e) => update("brandName", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block pp-label">Description</label>
            <textarea
              className={inputClass}
              rows={3}
              value={passport.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block pp-label">Product image URL</label>
            <input
              className={inputClass}
              placeholder="https://..."
              value={passport.imageUrl ?? ""}
              onChange={(e) => update("imageUrl", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block pp-label">Manufacturer</label>
            <input
              className={inputClass}
              value={passport.manufacturer}
              onChange={(e) => update("manufacturer", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block pp-label">Country of origin</label>
            <input
              className={inputClass}
              value={passport.countryOfOrigin}
              onChange={(e) => update("countryOfOrigin", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block pp-label">Production date</label>
            <input
              type="date"
              className={inputClass}
              value={passport.productionDate}
              onChange={(e) => update("productionDate", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block pp-label">Passport level</label>
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
            <label className="mb-1 block pp-label">Status</label>
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
      ),
    },
    {
      id: "materials",
      title: "Materials",
      shortLabel: "Materials",
      content: (
        <MaterialEditor materials={passport.materials} onChange={(materials) => update("materials", materials)} />
      ),
    },
    {
      id: "claims",
      title: "Sustainability claims",
      shortLabel: "Claims",
      content: <ClaimEditor claims={passport.claims} onChange={(claims) => update("claims", claims)} />,
    },
    {
      id: "lifecycle",
      title: "Care & lifecycle",
      shortLabel: "Lifecycle",
      content: (
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
              <label className="mb-1 block pp-label">{label}</label>
              <textarea
                className={inputClass}
                rows={2}
                value={passport.lifecycle[field]}
                onChange={(e) => updateLifecycle(field, e.target.value)}
              />
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "certifications",
      title: "Certifications",
      shortLabel: "Certs",
      content: (
        <div className="space-y-4">
          {passport.certifications.map((cert, index) => (
            <div key={cert.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700 sm:grid-cols-2">
              <input
                placeholder="Certificate name"
                className={inputClass}
                value={cert.name}
                onChange={(e) => updateCert(index, "name", e.target.value)}
              />
              <input
                placeholder="Issuer"
                className={inputClass}
                value={cert.issuer}
                onChange={(e) => updateCert(index, "issuer", e.target.value)}
              />
              <input
                type="date"
                className={inputClass}
                value={cert.expiryDate}
                onChange={(e) => updateCert(index, "expiryDate", e.target.value)}
              />
              <input
                placeholder="Document URL"
                className={inputClass}
                value={cert.documentUrl ?? ""}
                onChange={(e) => updateCert(index, "documentUrl", e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addCert}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            + Add certification
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <FormStepCarousel steps={steps} footer={saveButton} />
      </div>

      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <ComplianceScoreCard compliance={compliance} />
        {passport.publicId && passport.productName && (
          <QRCodeCard publicId={passport.publicId} productName={passport.productName} />
        )}
      </div>
    </div>
  );
}
