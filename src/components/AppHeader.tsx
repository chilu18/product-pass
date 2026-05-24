"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";
import { DEMO_PUBLIC_ID } from "@/lib/constants";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/evidence", label: "Evidence Vault" },
];

export default function AppHeader() {
  const pathname = usePathname();
  const isPublicPassport = pathname?.startsWith("/passport/");
  const isLanding = pathname === "/";

  if (isPublicPassport) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Product<span className="text-emerald-600">Pass</span>
          </span>
        </Link>

        {!isLanding && (
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname?.startsWith(link.href)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {isLanding ? (
            <>
              <Link
                href={`/passport/${DEMO_PUBLIC_ID}`}
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:inline-flex"
              >
                View demo
              </Link>
              <Link
                href="/products/new"
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Create passport
              </Link>
            </>
          ) : (
            <Link
              href="/products/new"
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              + New passport
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
