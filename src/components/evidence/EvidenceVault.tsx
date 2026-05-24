import type { PassportDocument } from "@/types";
import EvidenceStatusBadge from "./EvidenceStatusBadge";
import VisibilityBadge from "@/components/passport/VisibilityBadge";

interface EvidenceVaultProps {
  documents: PassportDocument[];
  productNames: Record<string, string>;
}

export default function EvidenceVault({ documents, productNames }: EvidenceVaultProps) {
  const productMap = productNames;

  const warnings = documents.filter(
    (d) => d.status === "missing" || d.status === "expired" || d.status === "needs_review"
  );

  return (
    <div className="space-y-6">
      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/40">
          <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-200">Evidence warnings</h4>
          <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
            {warnings.map((d) => (
              <li key={d.id}>
                {d.status === "missing" && `Missing: ${d.name}`}
                {d.status === "expired" && `Expired: ${d.name}`}
                {d.status === "needs_review" && `Needs review: ${d.name}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Document</th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 dark:text-slate-400 md:table-cell">
                Type
              </th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 dark:text-slate-400 lg:table-cell">
                Product
              </th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 dark:text-slate-400 sm:table-cell">
                Supplier
              </th>
              <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-400">Status</th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 dark:text-slate-400 md:table-cell">
                Visibility
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white dark:divide-slate-800 dark:bg-slate-900">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800 dark:text-slate-200">{doc.name}</p>
                  {doc.expiryDate && (
                    <p className="text-xs text-slate-400">
                      Expires {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </td>
                <td className="hidden px-4 py-3 capitalize text-slate-600 dark:text-slate-400 md:table-cell">
                  {doc.type.replace(/_/g, " ")}
                </td>
                <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-400 lg:table-cell">
                  {productMap[doc.linkedProductId] ?? "—"}
                </td>
                <td className="hidden px-4 py-3 text-slate-600 dark:text-slate-400 sm:table-cell">
                  {doc.supplier}
                </td>
                <td className="px-4 py-3">
                  <EvidenceStatusBadge status={doc.status} />
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <VisibilityBadge visibility={doc.visibility} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
