import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import type { ComplianceResult } from "@/types";

interface VerificationBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export default function VerificationBadge({ score, size = "md" }: VerificationBadgeProps) {
  const Icon = score >= 80 ? ShieldCheck : score >= 50 ? ShieldQuestion : ShieldAlert;
  const color =
    score >= 80
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 50
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-red-50 text-red-700 border-red-200";
  const label =
    score >= 80 ? "Verified" : score >= 50 ? "Partially verified" : "Needs evidence";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${color} ${sizeClasses[size]}`}
    >
      <Icon className={size === "lg" ? "h-5 w-5" : "h-4 w-4"} />
      {label}
    </span>
  );
}

export function VerificationBadgeFromCompliance({ result }: { result: ComplianceResult }) {
  return <VerificationBadge score={result.score} size="lg" />;
}
