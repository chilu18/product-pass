import type { ComplianceResult } from "@/types";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

interface ComplianceScoreCardProps {
  compliance: ComplianceResult;
  compact?: boolean;
}

export default function ComplianceScoreCard({ compliance, compact = false }: ComplianceScoreCardProps) {
  const result = compliance;
  const scoreColor =
    result.score >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : result.score >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const ringColor =
    result.score >= 80
      ? "stroke-emerald-500"
      : result.score >= 50
        ? "stroke-amber-500"
        : "stroke-red-500";

  return (
    <div className="pp-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="pp-subheading">Compliance readiness</h3>
          {!compact && (
            <p className="mt-1 text-sm pp-text">
              Score based on identity, materials, evidence, and lifecycle data.
            </p>
          )}
        </div>
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              className={ringColor}
              strokeWidth="3"
              strokeDasharray={`${result.score} 100`}
              strokeLinecap="round"
            />
          </svg>
          <span className={`absolute text-lg font-bold ${scoreColor}`}>{result.score}</span>
        </div>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-800 dark:text-slate-200">
        Readiness score: <span className={scoreColor}>{result.score}/100</span>
      </p>

      {(result.missingFields.length > 0 || result.missingEvidence.length > 0) && (
        <div className="mt-4 space-y-3">
          {result.missingEvidence.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" />
                Missing evidence
              </p>
              <ul className="mt-2 space-y-1">
                {result.missingEvidence.slice(0, compact ? 3 : 5).map((item) => (
                  <li key={item} className="text-sm pp-text">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.missingFields.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Missing fields
              </p>
              <ul className="mt-2 space-y-1">
                {result.missingFields.slice(0, compact ? 3 : 5).map((item) => (
                  <li key={item} className="text-sm pp-text">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-xl pp-muted-surface p-3">
        {result.score >= 80 ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        )}
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <span className="font-medium">Recommended: </span>
          {result.recommendedAction}
        </p>
      </div>

      {!compact && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {Object.entries(result.breakdown).map(([key, value]) => (
            <div key={key} className="rounded-lg pp-muted-surface px-3 py-2 text-center">
              <p className="text-xs capitalize text-slate-500 dark:text-slate-400">{key}</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
