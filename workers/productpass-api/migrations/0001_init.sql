-- ProductPass D1 schema: JSON payloads for hackathon MVP speed; normalize later for production.

CREATE TABLE IF NOT EXISTS passports (
  id TEXT PRIMARY KEY,
  public_id TEXT NOT NULL UNIQUE,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_passports_public_id ON passports(public_id);
CREATE INDEX IF NOT EXISTS idx_passports_updated_at ON passports(updated_at);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  linked_product_id TEXT NOT NULL,
  payload TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_product ON documents(linked_product_id);
