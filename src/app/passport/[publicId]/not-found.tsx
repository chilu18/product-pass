import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-slate-900">Passport not found</h1>
      <p className="mt-2 text-slate-600">This Digital Product Passport does not exist.</p>
      <Link href="/" className="mt-6 text-emerald-600 hover:underline">
        Back to ProductPass
      </Link>
    </div>
  );
}
