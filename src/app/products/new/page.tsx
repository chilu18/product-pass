import { createEmptyPassport } from "@/lib/store";
import NewPassportClient from "@/components/products/NewPassportClient";

export default function NewProductPage() {
  const initial = createEmptyPassport();
  initial.brandName = "HeySalad";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Create product passport</h1>
        <p className="mt-1 text-slate-600">
          Build identity, materials, claims, and evidence-backed sustainability data.
        </p>
      </div>
      <NewPassportClient initial={initial} />
    </div>
  );
}
