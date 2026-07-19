// models/applicationModel.js
// Tracks job applications a user has submitted (company, role, status).

const { readDB, writeDB, getNextId } = require("./db");

const VALID_STATUSES = ["applied", "interviewing", "offered", "rejected"];

function findAllByUserId(userId) {
  const db = readDB();
  return db.applications.filter((a) => a.userId === userId);
}

function findById(id) {
  const db = readDB();
  return db.applications.find((a) => a.id === Number(id)) || null;
}

function createApplication({ userId, company, role, documentId, notes, status }) {
  const db = readDB();
  const application = {
    id: getNextId(db.applications),
    userId,
    documentId: documentId ?? null,
    company,
    role,
    status: status || "applied",
    appliedAt: new Date().toISOString(),
    notes: notes || "",
  };
  db.applications.push(application);
  writeDB(db);
  return application;
}

function updateApplication(id, updates) {
  const db = readDB();
  const application = db.applications.find((a) => a.id === Number(id));
  if (!application) return null;

  if (updates.status !== undefined) application.status = updates.status;
  if (updates.notes !== undefined) application.notes = updates.notes;

  writeDB(db);
  return application;
}

function deleteApplication(id) {
  const db = readDB();
  const index = db.applications.findIndex((a) => a.id === Number(id));
  if (index === -1) return false;
  db.applications.splice(index, 1);
  writeDB(db);
  return true;
}

module.exports = {
  VALID_STATUSES,
  findAllByUserId,
  findById,
  createApplication,
  updateApplication,
  deleteApplication,
};
