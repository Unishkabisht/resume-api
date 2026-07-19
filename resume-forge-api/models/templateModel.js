// models/templateModel.js
// Read access to the resume templates a user can pick from when
// creating a document. Templates are curated data (seeded/managed
// directly in data.json), so only find operations are exposed here —
// there is no create/update/delete because the API has no endpoint for it.
const { readDB } = require("./db");

// Returns the full list of templates.
// Used by: GET /api/templates
function findAll() {
  const db = readDB();
  return db.templates;
}

// Returns a single template matching the given id, or null if not found.
// Used by: GET /api/templates/:id
function findById(id) {
  const db = readDB();
  return db.templates.find((t) => t.id === Number(id)) || null;
}

module.exports = { findAll, findById };
