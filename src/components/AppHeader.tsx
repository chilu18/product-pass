"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandIcon from "@/components/BrandIcon";
import BrandWordmark from "@/components/BrandWordmark";
import ThemeToggle from "@/components/ThemeToggle";
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
    <header className="pp-header">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <BrandIcon size={36} className="rounded-xl shadow-sm" />
          <BrandWordmark layout="stacked" />
        </Link>

        {!isLanding && (
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname?.startsWith(link.href)
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLanding ? (
            <>
              <Link
                href={`/passport/${DEMO_PUBLIC_ID}`}
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 sm:inline-flex"
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
