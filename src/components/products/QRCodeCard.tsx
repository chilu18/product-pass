"use client";

import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { ExternalLink, Download, Printer } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface QRCodeCardProps {
  publicId: string;
  productName: string;
}

export default function QRCodeCard({ publicId, productName }: QRCodeCardProps) {
  const { theme } = useTheme();
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "https://productpass.vercel.app";
  const passportUrl = `${baseUrl}/passport/${publicId}`;
  const isDark = theme === "dark";

  return (
    <div className="pp-card p-6">
      <h3 className="pp-subheading">QR passport</h3>
      <p className="mt-1 text-sm pp-text">
        Scan to open the public Digital Product Passport for {productName}.
      </p>

      <div className="mt-6 flex flex-col items-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-inner dark:border-slate-700 dark:bg-slate-950">
          <QRCodeSVG
            value={passportUrl}
            size={180}
            level="M"
            includeMargin
            fgColor={isDark ? "#f1f5f9" : "#0f172a"}
            bgColor={isDark ? "#020617" : "#ffffff"}
          />
        </div>
        <p className="mt-3 max-w-xs break-all text-center text-xs text-slate-500 dark:text-slate-400">
          {passportUrl}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href={`/passport/${publicId}`}
          target="_blank"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <ExternalLink className="h-4 w-4" />
          View passport
        </Link>
        <button
          type="button"
          onClick={() => alert("Download QR — integrate with label printing in production")}
          className="pp-secondary-btn inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="pp-secondary-btn inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium"
        >
          <Printer className="h-4 w-4" />
          Print label
        </button>
      </div>
    </div>
  );
}
