// models/documentModel.js
// Core CRUD operations for resume/cover-letter documents, plus helpers
// to assemble a full document (with its sections and items) and to
// duplicate or cascade-delete a document along with its related data.

const { readDB, writeDB, getNextId } = require("./db");
const sectionModel = require("./sectionModel");
const versionModel = require("./versionModel");

function findAllByUserId(userId) {
  const db = readDB();
  return db.documents.filter((d) => d.userId === userId);
}

function findById(id) {
  const db = readDB();
  return db.documents.find((d) => d.id === Number(id)) || null;
}

function assembleDocument(document) {
  const sections = sectionModel.findByDocumentId(document.id);
  const sectionsWithItems = sections.map((section) => ({
    ...section,
    items: sectionModel.findItemsBySectionId(section.id),
  }));
  return { ...document, sections: sectionsWithItems };
}

function createDocument({ userId, title, type, templateId }) {
  const db = readDB();
  const now = new Date().toISOString();
  const document = {
    id: getNextId(db.documents),
    userId,
    title,
    type,
    templateId: templateId ?? null,
    createdAt: now,
    updatedAt: now,
  };
  db.documents.push(document);
  writeDB(db);
  return document;
}

function importDocument({ userId, title, rawData }) {
  const document = createDocument({ userId, title, type: "resume" });
  const section = sectionModel.createSection({
    documentId: document.id,
    type: "custom",
    label: "Imported Content",
  });
  sectionModel.createItem({
    sectionId: section.id,
    fields: rawData || {},
  });
  return document;
}

function updateDocument(id, updates) {
  const db = readDB();
  const document = db.documents.find((d) => d.id === Number(id));
  if (!document) return null;

  if (updates.title !== undefined) document.title = updates.title;
  if (updates.templateId !== undefined) document.templateId = updates.templateId;
  document.updatedAt = new Date().toISOString();

  writeDB(db);
  return document;
}

function deleteDocumentCascade(documentId) {
  const db = readDB();
  const id = Number(documentId);
  const docIndex = db.documents.findIndex((d) => d.id === id);
  if (docIndex === -1) return false;

  db.documents.splice(docIndex, 1);

  const sectionIds = db.sections.filter((s) => s.documentId === id).map((s) => s.id);
  db.sections = db.sections.filter((s) => s.documentId !== id);
  db.sectionItems = db.sectionItems.filter((item) => !sectionIds.includes(item.sectionId));
  db.versions = db.versions.filter((v) => v.documentId !== id);

  db.applications = db.applications.map((app) =>
    app.documentId === id ? { ...app, documentId: null } : app
  );

  writeDB(db);
  return true;
}

function duplicateDocument(documentId, userId) {
  const original = findById(documentId);
  if (!original) return null;

  const copy = createDocument({
    userId,
    title: `${original.title} (copy)`,
    type: original.type,
    templateId: original.templateId,
  });

  const sections = sectionModel.findByDocumentId(original.id);
  sections.forEach((section) => {
    const newSection = sectionModel.createSection({
      documentId: copy.id,
      type: section.type,
      label: section.label,
      order: section.order,
    });
    const items = sectionModel.findItemsBySectionId(section.id);
    items.forEach((item) => {
      sectionModel.createItem({
        sectionId: newSection.id,
        fields: { ...item.fields },
        order: item.order,
      });
    });
  });

  return copy;
}

module.exports = {
  findAllByUserId,
  findById,
  assembleDocument,
  createDocument,
  importDocument,
  updateDocument,
  deleteDocumentCascade,
  duplicateDocument,
};
