-- Every "Join Sparks Today" registration.
-- Key fields get their own columns so they are easy to read in the Cloudflare
-- dashboard; the full submission (all answers and e-signatures) is in `data` as JSON.
CREATE TABLE IF NOT EXISTS registrations (
  id              TEXT PRIMARY KEY,
  created_at      TEXT NOT NULL,
  parent_name     TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  city            TEXT NOT NULL,
  children_count  INTEGER NOT NULL,
  children_names  TEXT NOT NULL,
  policy_version  TEXT NOT NULL,
  data            TEXT NOT NULL,
  ip              TEXT,
  user_agent      TEXT,
  email_status    TEXT
);

CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations (created_at);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations (email);
