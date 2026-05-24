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
          <h1 className="pp-heading text-2xl">Product passports</h1>
          <p className="mt-1 pp-text">Manage identity, materials, claims, and evidence.</p>
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
              className="group pp-card p-5 transition hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800"
            >
              <div className="flex gap-4">
                {passport.imageUrl && (
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={passport.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {passport.brandName}
                  </p>
                  <h2 className="truncate font-semibold text-slate-900 group-hover:text-emerald-700 dark:text-slate-50 dark:group-hover:text-emerald-400">
                    {passport.productName}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {passport.sku} · {passport.status}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                        score >= 80
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : score >= 50
                            ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                            : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300"
                      }`}
                    >
                      {score}/100 ready
                    </span>
                    <span className="text-xs capitalize text-slate-400">{passport.passportLevel}-level</span>
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
