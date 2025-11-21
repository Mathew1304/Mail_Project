// server/migrate.js
const { run } = require('./db');

console.log('Running migrations...');

// Users table
run(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  password_hash TEXT,
  storage_used INTEGER DEFAULT 0,
  storage_limit INTEGER DEFAULT 1073741824,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Folders table
run(`
CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

// Emails table
run(`
CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  folder_id TEXT,
  from_email TEXT,
  from_name TEXT,
  to_emails TEXT,
  cc_emails TEXT,
  bcc_emails TEXT,
  subject TEXT,
  body TEXT,
  is_read INTEGER DEFAULT 0,
  is_starred INTEGER DEFAULT 0,
  is_draft INTEGER DEFAULT 0,
  has_attachments INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  sent_at TEXT,
  labels TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
`);

console.log('Migrations finished. DB created at server/data/email.db');
