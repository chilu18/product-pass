"use client";

import type { PassportDocument, ProductPassport } from "@/types";
import ProductPassportForm from "@/components/products/ProductPassportForm";
import { savePassportAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface EditPassportClientProps {
  initial: ProductPassport;
  documents: PassportDocument[];
}

export default function EditPassportClient({ initial, documents }: EditPassportClientProps) {
  const router = useRouter();
  const [passport, setPassport] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await savePassportAction(passport);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {saved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          Passport saved. Public page and QR code are updated.
        </div>
      )}
      <ProductPassportForm
        passport={passport}
        documents={documents}
        onChange={setPassport}
        onSave={handleSave}
        saving={saving}
      />
    </>
  );
}
