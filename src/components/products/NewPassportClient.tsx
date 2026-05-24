"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductPassport } from "@/types";
import ProductPassportForm from "@/components/products/ProductPassportForm";
import { createPassportAction, savePassportAction } from "@/app/actions";

interface NewPassportClientProps {
  initial: ProductPassport;
}

export default function NewPassportClient({ initial }: NewPassportClientProps) {
  const router = useRouter();
  const [passport, setPassport] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const created = await createPassportAction(passport);
    setSaving(false);
    router.push(`/products/${created.id}/edit`);
  };

  return (
    <ProductPassportForm
      passport={passport}
      documents={[]}
      onChange={setPassport}
      onSave={handleSave}
      saving={saving}
    />
  );
}
