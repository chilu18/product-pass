import {
  FileText,
  CheckCircle2,
  FileEdit,
  AlertTriangle,
  Clock,
  Shield,
} from "lucide-react";

interface DashboardStatsProps {
  total: number;
  published: number;
  drafts: number;
  missingEvidence: number;
  expiringCerts: number;
  complianceScore: number;
}

const statConfig: {
  key: keyof DashboardStatsProps;
  label: string;
  icon: typeof FileText;
  color: string;
  suffix?: string;
}[] = [
  { key: "total", label: "Total passports", icon: FileText, color: "text-slate-600 bg-slate-100" },
  { key: "published", label: "Published", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  { key: "drafts", label: "Drafts", icon: FileEdit, color: "text-blue-600 bg-blue-50" },
  { key: "missingEvidence", label: "Missing evidence", icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
  { key: "expiringCerts", label: "Expiring certificates", icon: Clock, color: "text-orange-600 bg-orange-50" },
  { key: "complianceScore", label: "Avg. compliance score", icon: Shield, color: "text-teal-600 bg-teal-50", suffix: "/100" },
];

export default function DashboardStats(props: DashboardStatsProps) {
  const values: Record<string, number> = {
    total: props.total,
    published: props.published,
    drafts: props.drafts,
    missingEvidence: props.missingEvidence,
    expiringCerts: props.expiringCerts,
    complianceScore: props.complianceScore,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statConfig.map(({ key, label, icon: Icon, color, suffix }) => (
        <div
          key={key}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-2xl font-bold text-slate-900">
            {values[key]}
            {suffix ?? ""}
          </p>
          <p className="mt-1 text-sm text-slate-600">{label}</p>
        </div>
      ))}
    </div>
  );
}
