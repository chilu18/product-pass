import type { EvidenceStatus } from "@/types";
import { EVIDENCE_STATUS_LABELS } from "@/lib/constants";

const styles: Record<EvidenceStatus, string> = {
  missing: "bg-red-50 text-red-700 border-red-200",
  uploaded: "bg-blue-50 text-blue-700 border-blue-200",
  needs_review: "bg-amber-50 text-amber-700 border-amber-200",
  verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  expired: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function EvidenceStatusBadge({ status }: { status: EvidenceStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {EVIDENCE_STATUS_LABELS[status]}
    </span>
  );
}
