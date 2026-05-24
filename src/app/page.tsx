import Link from "next/link";
import LandingHero from "@/components/landing/LandingHero";
import FeatureCard from "@/components/landing/FeatureCard";
import type { LucideIcon } from "lucide-react";
import {
  Fingerprint,
  FileCheck,
  Leaf,
  QrCode,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { DEMO_PUBLIC_ID } from "@/lib/constants";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Fingerprint,
    title: "Product identity",
    description:
      "Model, batch, or item-level passports with SKU, origin, manufacturer, and production data.",
  },
  {
    icon: FileCheck,
    title: "Supplier evidence",
    description:
      "Evidence Vault links certificates, declarations, lab reports, and audits to products and claims.",
  },
  {
    icon: Leaf,
    title: "Sustainability claims",
    description:
      "Flag green claims that need evidence before publishing — organic, recycled, carbon neutral, and more.",
  },
  {
    icon: QrCode,
    title: "QR / NFC-ready passport",
    description:
      "Generate QR codes linking to consumer-friendly trust pages. Ready for GS1 Digital Link integration.",
  },
  {
    icon: RefreshCw,
    title: "Repair, resale & recycling",
    description:
      "Circular-commerce layer for repair, resale, ownership transfer, and recycling point discovery.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance readiness",
    description:
      "Real-time scoring across identity, materials, evidence, certifications, and public passport completeness.",
  },
];

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900">More than a QR page generator</h2>
          <p className="mt-4 text-lg text-slate-600">
            ProductPass is compliance, traceability, identity, evidence, and circular-commerce
            infrastructure for physical products — DPP-lite for fashion and apparel SMEs.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>
      <section className="border-t border-slate-200 bg-slate-50/50">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">Ready to build your first passport?</h2>
          <p className="mt-3 text-slate-600">
            Turn product data, supplier evidence, and sustainability claims into QR-powered Digital
            Product Passports.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/products/new"
              className="rounded-xl bg-emerald-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Create passport
            </Link>
            <Link
              href={`/passport/${DEMO_PUBLIC_ID}`}
              className="rounded-xl border border-slate-200 bg-white px-8 py-3 text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              View demo passport
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
