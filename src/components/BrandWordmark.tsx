interface BrandWordmarkProps {
  /** Stack domain under the name (header, passport bar) */
  layout?: "stacked" | "inline" | "hero";
  className?: string;
}

export default function BrandWordmark({ layout = "stacked", className = "" }: BrandWordmarkProps) {
  const name = (
    <span className="font-semibold tracking-tight text-slate-900 dark:text-slate-50">
      Product<span className="text-emerald-600 dark:text-emerald-400">Pass</span>
    </span>
  );

  const domain = (
    <span className="font-medium text-slate-500 dark:text-slate-400">theproductpass.garden</span>
  );

  if (layout === "hero") {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-sm font-medium tracking-wide text-emerald-700 dark:text-emerald-400 sm:text-base">
          theproductpass.garden
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl lg:text-6xl">
          Product<span className="text-emerald-600 dark:text-emerald-400">Pass</span>
        </h1>
      </div>
    );
  }

  if (layout === "inline") {
    return (
      <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className}`}>
        {name}
        <span className="hidden text-slate-300 dark:text-slate-600 sm:inline" aria-hidden>
          ·
        </span>
        <span className="hidden text-xs sm:inline sm:text-sm">{domain}</span>
      </div>
    );
  }

  return (
    <div className={`leading-tight ${className}`}>
      <div className="text-lg">{name}</div>
      <div className="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 sm:text-xs">
        theproductpass.garden
      </div>
    </div>
  );
}
