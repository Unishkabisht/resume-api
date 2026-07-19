// models/versionModel.js
// Stores point-in-time snapshots of a document so users can save a
// version and roll back to it later.

const { readDB, writeDB, getNextId } = require("./db");

function findByDocumentId(documentId) {
  const db = readDB();
  return db.versions
    .filter((v) => v.documentId === Number(documentId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function findById(versionId) {
  const db = readDB();
  return db.versions.find((v) => v.id === Number(versionId)) || null;
}

function createVersion({ documentId, label, snapshot }) {
  const db = readDB();
  const version = {
    id: getNextId(db.versions),
    documentId: Number(documentId),
    label: label || `Version ${db.versions.filter((v) => v.documentId === Number(documentId)).length + 1}`,
    snapshot,
    createdAt: new Date().toISOString(),
  };
  db.versions.push(version);
  writeDB(db);
  return version;
}

module.exports = { findByDocumentId, findById, createVersion };
