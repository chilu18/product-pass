import Link from "next/link";
import { ArrowRight, QrCode } from "lucide-react";
import { DEMO_PUBLIC_ID } from "@/lib/constants";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/40 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-800">
          <QrCode className="h-4 w-4" />
          DPP-lite for fashion &amp; apparel SMEs
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Product<span className="text-emerald-600">Pass</span>
        </h1>
        <p className="mt-4 text-xl font-medium text-slate-700">
          QR-powered Digital Product Passports for modern brands.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Create product identity, evidence, sustainability, repair, and recycling records in minutes.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Create passport
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/passport/${DEMO_PUBLIC_ID}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            View demo passport
          </Link>
        </div>
      </div>
    </section>
  );
}
