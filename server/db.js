// server/db.js
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'data', 'email.db');

const db = new Database(DB_PATH);

// Convenience: prepare and run helpers
function run(sql, params = {}) {
  return db.prepare(sql).run(params);
}
function all(sql, params = {}) {
  return db.prepare(sql).all(params);
}
function get(sql, params = {}) {
  return db.prepare(sql).get(params);
}

module.exports = { db, run, all, get };
