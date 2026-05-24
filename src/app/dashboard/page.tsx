import Link from "next/link";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ComplianceScoreCard from "@/components/dashboard/ComplianceScoreCard";
import { getDashboardStats, getAllDocuments } from "@/lib/store";
import { calculateComplianceScore } from "@/lib/compliance";
import { AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const documents = getAllDocuments();

  const demoPassport = stats.recentProducts[0];
  const demoCompliance = demoPassport
    ? calculateComplianceScore(demoPassport, documents)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Overview of passports, evidence gaps, and compliance readiness.
        </p>
      </div>

      <DashboardStats
        total={stats.total}
        published={stats.published}
        drafts={stats.drafts}
        missingEvidence={stats.missingEvidence}
        expiringCerts={stats.expiringCerts}
        complianceScore={stats.averageComplianceScore}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {demoCompliance && <ComplianceScoreCard compliance={demoCompliance} />}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Recent products</h3>
            <Link
              href="/products"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {stats.recentProducts.map((product) => {
              const score = calculateComplianceScore(product, documents).score;
              return (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="flex items-center justify-between py-3 transition hover:text-emerald-600"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{product.productName}</p>
                      <p className="text-sm text-slate-500">
                        {product.status} · {score}/100 readiness
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {(stats.missingEvidence > 0 || stats.expiredDocs > 0) && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-900">Action required</p>
            <p className="mt-1 text-sm text-amber-800">
              {stats.missingEvidence} evidence items missing
              {stats.expiredDocs > 0 && ` · ${stats.expiredDocs} expired documents`}. Review the{" "}
              <Link href="/evidence" className="font-medium underline">
                Evidence Vault
              </Link>{" "}
              to resolve gaps before publishing.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
