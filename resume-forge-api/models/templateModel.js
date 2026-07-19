// models/templateModel.js
// Read access to the resume templates a user can pick from when
// creating a document.

const { readDB, writeDB, getNextId } = require("./db");

function findAll() {
  const db = readDB();
  return db.templates;
}

function findById(id) {
  const db = readDB();
  return db.templates.find((t) => t.id === Number(id)) || null;
}

function createTemplate(template) {
  const db = readDB();
  const record = {
    id: getNextId(db.templates),
    ...template,
  };
  db.templates.push(record);
  writeDB(db);
  return record;
}

module.exports = { findAll, findById, createTemplate };
