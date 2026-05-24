import EvidenceVault from "@/components/evidence/EvidenceVault";
import { getDocuments, getAllPassports } from "@/lib/store";

export default async function EvidencePage() {
  const documents = await getDocuments();
  const productNames = Object.fromEntries(
    (await getAllPassports()).map((p) => [p.id, p.productName])
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="pp-heading text-2xl">Evidence Vault</h1>
        <p className="mt-1 pp-text">
          Proof behind product claims — certificates, supplier declarations, lab reports, and audits.
        </p>
      </div>
      <EvidenceVault documents={documents} productNames={productNames} />
    </div>
  );
}
