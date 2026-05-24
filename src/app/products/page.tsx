import Link from "next/link";
import { getAllPassports, getAllDocuments } from "@/lib/store";
import { calculateComplianceScore } from "@/lib/compliance";

export default async function ProductsPage() {
  const passports = await getAllPassports();
  const documents = await getAllDocuments();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product passports</h1>
          <p className="mt-1 text-slate-600">Manage identity, materials, claims, and evidence.</p>
        </div>
        <Link
          href="/products/new"
          className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          + New passport
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {passports.map((passport) => {
          const score = calculateComplianceScore(passport, documents).score;
          return (
            <Link
              key={passport.id}
              href={`/products/${passport.id}/edit`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex gap-4">
                {passport.imageUrl && (
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={passport.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-emerald-600">{passport.brandName}</p>
                  <h2 className="truncate font-semibold text-slate-900 group-hover:text-emerald-700">
                    {passport.productName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {passport.sku} · {passport.status}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                        score >= 80
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : score >= 50
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {score}/100 ready
                    </span>
                    <span className="text-xs capitalize text-slate-400">
                      {passport.passportLevel}-level
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
