import { Recycle, RefreshCw, UserPlus, ArrowRightLeft, MapPin, Wrench } from "lucide-react";

const actions = [
  { icon: Wrench, label: "Repair this product", description: "Find repair guidance & partners" },
  { icon: RefreshCw, label: "Resell this product", description: "List on circular marketplaces" },
  { icon: UserPlus, label: "Register ownership", description: "Link product to your account" },
  { icon: ArrowRightLeft, label: "Transfer ownership", description: "Passport follows the product" },
  { icon: MapPin, label: "Find recycling point", description: "Locate textile collection" },
  { icon: Recycle, label: "End-of-life guidance", description: "Responsible disposal paths" },
];

export default function LifecycleActions() {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Circular commerce</h3>
        <p className="mt-1 text-sm text-slate-600">
          Digital Product Passports power more than compliance — repair, resale, authentication, and recycling.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map(({ icon: Icon, label, description }) => (
          <button
            key={label}
            type="button"
            disabled
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left opacity-60 transition hover:opacity-80 disabled:cursor-not-allowed"
            title="Coming soon"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">{label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{description}</p>
              <span className="mt-1 inline-block text-xs font-medium text-emerald-600">Coming soon</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
