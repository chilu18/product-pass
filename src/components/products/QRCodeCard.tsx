"use client";

import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import { ExternalLink, Download, Printer } from "lucide-react";

interface QRCodeCardProps {
  publicId: string;
  productName: string;
}

export default function QRCodeCard({ publicId, productName }: QRCodeCardProps) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "https://productpass.vercel.app";
  const passportUrl = `${baseUrl}/passport/${publicId}`;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">QR passport</h3>
      <p className="mt-1 text-sm text-slate-600">
        Scan to open the public Digital Product Passport for {productName}.
      </p>

      <div className="mt-6 flex flex-col items-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-inner">
          <QRCodeSVG
            value={passportUrl}
            size={180}
            level="M"
            includeMargin
            fgColor="#0f172a"
            bgColor="#ffffff"
          />
        </div>
        <p className="mt-3 max-w-xs break-all text-center text-xs text-slate-500">
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
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <Printer className="h-4 w-4" />
          Print label
        </button>
      </div>
    </div>
  );
}
