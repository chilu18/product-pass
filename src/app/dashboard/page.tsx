import Link from "next/link";
import DashboardStats from "@/components/dashboard/DashboardStats";
import ComplianceScoreCard from "@/components/dashboard/ComplianceScoreCard";
import { getDashboardStats, getAllDocuments } from "@/lib/store";
import { calculateComplianceScore } from "@/lib/compliance";
import { AlertTriangle } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const documents = await getAllDocuments();

  const demoPassport = stats.recentProducts[0];
  const demoCompliance = demoPassport
    ? calculateComplianceScore(demoPassport, documents)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="pp-heading text-2xl">Dashboard</h1>
        <p className="mt-1 pp-text">Overview of passports, evidence gaps, and compliance readiness.</p>
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

        <div className="pp-card p-6">
          <div className="flex items-center justify-between">
            <h3 className="pp-subheading">Recent products</h3>
            <Link
              href="/products"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {stats.recentProducts.map((product) => {
              const score = calculateComplianceScore(product, documents).score;
              return (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.id}/edit`}
                    className="flex items-center justify-between py-3 transition hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {product.productName}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
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
        <div className="pp-alert-warning mt-6 flex items-start gap-3 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="pp-alert-warning-title">Action required</p>
            <p className="mt-1 pp-alert-warning-text">
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
