import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-slate-900">Passport not found</h1>
      <p className="mt-3 text-slate-500">
        This Digital Product Passport does not exist or has been removed.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Back to ProductPass
      </Link>
    </div>
  );
}
