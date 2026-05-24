"use client";

import type { ProductPassport, PassportDocument } from "@/types";
import { calculateComplianceScore } from "@/lib/compliance";
import { CLAIM_TYPE_LABELS } from "@/lib/constants";
import { VerificationBadgeFromCompliance } from "./VerificationBadge";
import LifecycleActions from "./LifecycleActions";
import { QRCodeSVG } from "qrcode.react";
import BrandIcon from "@/components/BrandIcon";
import BrandWordmark from "@/components/BrandWordmark";
import ThemeToggle from "@/components/ThemeToggle";
import {
  MapPin,
  Factory,
  Leaf,
  Droplets,
  Wrench,
  RefreshCw,
  Recycle,
  Award,
  Shield,
} from "lucide-react";

interface PublicPassportViewProps {
  passport: ProductPassport;
  documents?: PassportDocument[];
  baseUrl?: string;
}

export default function PublicPassportView({
  passport,
  documents = [],
  baseUrl = "https://productpass.vercel.app",
}: PublicPassportViewProps) {
  const compliance = calculateComplianceScore(passport, documents);
  const publicClaims = passport.claims.filter((c) => c.visibility === "public");
  const publicMaterials = passport.materials.filter((m) => m.visibility === "public");
  const publicCerts = passport.certifications.filter((c) => c.visibility === "public");
  const verifiedClaims = publicClaims.filter(
    (c) => c.evidenceStatus === "verified" || c.evidenceStatus === "uploaded"
  );
  const passportUrl = `${baseUrl}/passport/${passport.publicId}`;

  const levelLabel = {
    model: "Model-level passport",
    batch: "Batch-level passport",
    item: "Item-level passport",
  }[passport.passportLevel];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <BrandIcon size={32} className="rounded-lg" />
            <BrandWordmark layout="stacked" className="[&>div:first-child]:text-base" />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <VerificationBadgeFromCompliance result={compliance} />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          {passport.imageUrl && (
            <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={passport.imageUrl}
                alt={passport.productName}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{passport.brandName}</p>
                <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-50 sm:text-3xl">
                  {passport.productName}
                </h1>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  SKU {passport.sku}
                  {passport.batchNumber && ` · Batch ${passport.batchNumber}`}
                </p>
              </div>
              <div className="hidden rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-950 sm:block">
                <QRCodeSVG value={passportUrl} size={80} level="M" />
              </div>
            </div>

            <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {levelLabel}
            </div>

            {passport.description && (
              <p className="mt-6 leading-relaxed text-slate-600 dark:text-slate-400">{passport.description}</p>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl pp-muted-surface p-4">
                <Factory className="mt-0.5 h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Manufacturer
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{passport.manufacturer}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl pp-muted-surface p-4">
                <MapPin className="mt-0.5 h-5 w-5 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Origin
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                    {passport.countryOfOrigin}
                  </p>
                </div>
              </div>
            </div>

            {publicMaterials.length > 0 && (
              <section className="mt-10">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  Materials
                </h2>
                <div className="mt-4 space-y-3">
                  {publicMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{mat.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {mat.sourceCountry} · {mat.supplierName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{mat.percentage}%</p>
                        {mat.recycledContentPercentage > 0 && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            {mat.recycledContentPercentage}% recycled
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {publicClaims.length > 0 && (
              <section className="mt-10">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  Sustainability claims
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {publicClaims.map((claim) => {
                    const backed = verifiedClaims.some((v) => v.id === claim.id);
                    return (
                      <span
                        key={claim.id}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
                          backed
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {CLAIM_TYPE_LABELS[claim.claimType]}: {claim.text}
                        {backed && (
                          <span className="text-xs text-emerald-600">✓ evidenced</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="mt-10 grid gap-4 sm:grid-cols-2">
              {passport.lifecycle.careInstructions && (
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    Care
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {passport.lifecycle.careInstructions}
                  </p>
                </div>
              )}
              {passport.lifecycle.repairInstructions && (
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <Wrench className="h-4 w-4 text-orange-500" />
                    Repair
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {passport.lifecycle.repairInstructions}
                  </p>
                </div>
              )}
              {passport.lifecycle.reuseInstructions && (
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <RefreshCw className="h-4 w-4 text-teal-500" />
                    Reuse &amp; resale
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {passport.lifecycle.reuseInstructions}
                    {passport.lifecycle.resaleInstructions &&
                      ` ${passport.lifecycle.resaleInstructions}`}
                  </p>
                </div>
              )}
              {passport.lifecycle.recyclingInstructions && (
                <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <Recycle className="h-4 w-4 text-emerald-500" />
                    Recycling
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {passport.lifecycle.recyclingInstructions}
                  </p>
                </div>
              )}
            </section>

            {publicCerts.length > 0 && (
              <section className="mt-10">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  <Award className="h-5 w-5 text-amber-500" />
                  Certifications
                </h2>
                <div className="mt-4 space-y-2">
                  {publicCerts.map((cert) => (
                    <div
                      key={cert.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700"
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">{cert.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                      </div>
                      {cert.expiryDate && (
                        <p className="text-xs text-slate-500">
                          Valid until {new Date(cert.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-10 flex flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50 sm:hidden">
              <QRCodeSVG value={passportUrl} size={120} level="M" />
              <p className="mt-3 text-xs text-slate-500">Scan for product passport</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <LifecycleActions />
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          Last updated {new Date(passport.updatedAt).toLocaleDateString()} · Powered by{" "}
          <span className="text-slate-500 dark:text-slate-400">theproductpass.garden</span>
        </p>
      </main>
    </div>
  );
}
