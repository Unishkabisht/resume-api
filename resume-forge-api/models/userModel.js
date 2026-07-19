// models/userModel.js
// Read/update/delete operations for a user's own profile, including
// cleanup of related sessions, documents, and applications on delete.

const { readDB, writeDB } = require("./db");
const authModel = require("./authModel");
const documentModel = require("./documentModel");

function findById(id) {
  const db = readDB();
  return db.users.find((u) => u.id === Number(id)) || null;
}

function updateUser(id, updates) {
  const db = readDB();
  const user = db.users.find((u) => u.id === Number(id));
  if (!user) return null;

  if (updates.name !== undefined) user.name = updates.name;
  if (updates.email !== undefined) user.email = updates.email;

  writeDB(db);
  return user;
}

function deleteUser(id) {
  const db = readDB();
  const userId = Number(id);
  const userIndex = db.users.findIndex((u) => u.id === userId);
  if (userIndex === -1) return false;

  db.users.splice(userIndex, 1);
  authModel.deleteSessionsByUserId(userId);
  db.passwordResets = db.passwordResets.filter((r) => r.userId !== userId);

  const userDocIds = db.documents.filter((d) => d.userId === userId).map((d) => d.id);
  userDocIds.forEach((docId) => documentModel.deleteDocumentCascade(docId));

  db.applications = db.applications.filter((a) => a.userId !== userId);

  writeDB(db);
  return true;
}

module.exports = { findById, updateUser, deleteUser };
