import { notFound } from "next/navigation";
import PublicPassportView from "@/components/passport/PublicPassportView";
import { getPassportByPublicId, getDocumentsForProduct } from "@/lib/store";

interface PageProps {
  params: Promise<{ publicId: string }>;
}

export default async function PublicPassportPage({ params }: PageProps) {
  const { publicId } = await params;
  const passport = getPassportByPublicId(publicId);

  if (!passport) {
    notFound();
  }

  const documents = getDocumentsForProduct(passport.id);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3023";

  return (
    <PublicPassportView passport={passport} documents={documents} baseUrl={baseUrl} />
  );
}
