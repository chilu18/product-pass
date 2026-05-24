import type { VisibilityLevel } from "@/types";

const styles: Record<VisibilityLevel, string> = {
  public: "bg-emerald-50 text-emerald-700 border-emerald-200",
  private: "bg-slate-100 text-slate-600 border-slate-200",
  regulator: "bg-purple-50 text-purple-700 border-purple-200",
  recycler: "bg-teal-50 text-teal-700 border-teal-200",
  repairer: "bg-orange-50 text-orange-700 border-orange-200",
  supplier: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function VisibilityBadge({ visibility }: { visibility: VisibilityLevel }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${styles[visibility]}`}
    >
      {visibility}
    </span>
  );
}
