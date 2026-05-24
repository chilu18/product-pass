import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group pp-card p-6 transition hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 transition group-hover:from-emerald-100 group-hover:to-teal-100 dark:from-emerald-950/60 dark:to-teal-950/40 dark:text-emerald-400 dark:group-hover:from-emerald-900/60 dark:group-hover:to-teal-900/40">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed pp-text">{description}</p>
    </div>
  );
}
