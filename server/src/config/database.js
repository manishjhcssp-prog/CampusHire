const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const dbFilePath = process.env.DB_PATH || './data/campushire.sqlite';
const serverRoot = path.resolve(__dirname, '../../');
const resolvedDbPath = path.isAbsolute(dbFilePath)
  ? dbFilePath
  : (fs.existsSync(path.resolve(serverRoot, dbFilePath))
      ? path.resolve(serverRoot, dbFilePath)
      : path.resolve(process.cwd(), dbFilePath));
const dbDir = path.dirname(resolvedDbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance = null;

function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(resolvedDbPath);
    dbInstance.exec('PRAGMA foreign_keys = ON;');
  }
  return dbInstance;
}

// Promisified database helper methods conforming to SQLite API
const db = {
  async run(sql, params = []) {
    const database = getDatabase();
    const stmt = database.prepare(sql);
    const result = stmt.run(...params);
    return {
      lastID: Number(result.lastInsertRowid),
      changes: result.changes
    };
  },

  async get(sql, params = []) {
    const database = getDatabase();
    const stmt = database.prepare(sql);
    return stmt.get(...params);
  },

  async all(sql, params = []) {
    const database = getDatabase();
    const stmt = database.prepare(sql);
    return stmt.all(...params);
  },

  async exec(sql) {
    const database = getDatabase();
    database.exec(sql);
  },

  async close() {
    if (dbInstance) {
      try {
        dbInstance.close();
      } catch (e) {
        // ignore on close
      }
      dbInstance = null;
    }
  }
};

async function initDatabase() {
  const schemaPath = path.join(__dirname, '..', 'models', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await db.exec(schemaSql);
  return db;
}

module.exports = {
  db,
  getDatabase,
  initDatabase,
  resolvedDbPath
};
