// models/authModel.js
// Handles everything related to authentication data: users, login
// sessions, and password-reset tokens. Also exposes a helper to strip
// the password field before a user object is ever sent in a response.

const { readDB, writeDB, getNextId } = require("./db");

function stripPassword(user) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

function findUserByEmail(email) {
  const db = readDB();
  return db.users.find((u) => u.email === email) || null;
}

function findUserById(id) {
  const db = readDB();
  return db.users.find((u) => u.id === Number(id)) || null;
}

function createUser({ name, email, password }) {
  const db = readDB();
  const now = new Date().toISOString();
  const user = {
    id: getNextId(db.users),
    name,
    email,
    password,
    tier: "free",
    aiCredits: 10,
    createdAt: now,
  };
  db.users.push(user);
  writeDB(db);
  return user;
}

function createSession(userId) {
  const db = readDB();
  const session = {
    id: getNextId(db.sessions),
    userId,
    token: `mock-token-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.sessions.push(session);
  writeDB(db);
  return session;
}

function findSessionByToken(token) {
  const db = readDB();
  return db.sessions.find((s) => s.token === token) || null;
}

function deleteSessionByToken(token) {
  const db = readDB();
  const index = db.sessions.findIndex((s) => s.token === token);
  if (index === -1) return false;
  db.sessions.splice(index, 1);
  writeDB(db);
  return true;
}

function deleteSessionsByUserId(userId) {
  const db = readDB();
  db.sessions = db.sessions.filter((s) => s.userId !== userId);
  writeDB(db);
}

function createPasswordReset(userId) {
  const db = readDB();
  const resetToken = `mock-reset-${Date.now()}`;
  const record = {
    id: getNextId(db.passwordResets),
    userId,
    token: resetToken,
    createdAt: new Date().toISOString(),
  };
  db.passwordResets.push(record);
  writeDB(db);
  return resetToken;
}

function findPasswordResetByToken(token) {
  const db = readDB();
  return db.passwordResets.find((r) => r.token === token) || null;
}

function deletePasswordReset(token) {
  const db = readDB();
  db.passwordResets = db.passwordResets.filter((r) => r.token !== token);
  writeDB(db);
}

function updateUserPassword(userId, newPassword) {
  const db = readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;
  user.password = newPassword;
  writeDB(db);
  return user;
}

function decrementAiCredits(userId) {
  const db = readDB();
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;
  user.aiCredits -= 1;
  writeDB(db);
  return user.aiCredits;
}

module.exports = {
  stripPassword,
  findUserByEmail,
  findUserById,
  createUser,
  createSession,
  findSessionByToken,
  deleteSessionByToken,
  deleteSessionsByUserId,
  createPasswordReset,
  findPasswordResetByToken,
  deletePasswordReset,
  updateUserPassword,
  decrementAiCredits,
};
