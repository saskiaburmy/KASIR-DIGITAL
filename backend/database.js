const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./kasir.db');

db.serialize(() => {

  // ======================================
  // TABEL MENU
  // ======================================

  db.run(`
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      price INTEGER,
      image TEXT
    )
  `);


  // ======================================
  // TABEL USERS
  // ======================================

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

});

module.exports = db;