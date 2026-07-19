// models/db.js
// Lightweight file-based data layer. Reads and writes the JSON file that
// acts as our database, and generates simple auto-incrementing ids.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data.json");

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function getNextId(array) {
  if (!array || array.length === 0) return 1;
  return Math.max(...array.map((item) => item.id)) + 1;
}

module.exports = { readDB, writeDB, getNextId };
