import { notFound } from "next/navigation";
import EditPassportClient from "@/components/products/EditPassportClient";
import { getPassportById, getDocumentsForProduct } from "@/lib/store";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const passport = getPassportById(id);

  if (!passport) notFound();

  const documents = getDocumentsForProduct(id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{passport.productName}</h1>
        <p className="mt-1 text-slate-600">
          {passport.brandName} · <span className="capitalize">{passport.status}</span> ·{" "}
          {passport.passportLevel}-level passport
        </p>
      </div>
      <EditPassportClient initial={passport} documents={documents} />
    </div>
  );
}
