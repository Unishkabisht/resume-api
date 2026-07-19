// models/sectionModel.js
// Manages sections within a document (e.g. Experience, Education) and
// the individual items inside each section. Also provides a helper to
// replace a document's entire content when restoring a saved version.

const { readDB, writeDB, getNextId } = require("./db");

function findByDocumentId(documentId) {
  const db = readDB();
  return db.sections
    .filter((s) => s.documentId === Number(documentId))
    .sort((a, b) => a.order - b.order);
}

function findSectionById(sectionId) {
  const db = readDB();
  return db.sections.find((s) => s.id === Number(sectionId)) || null;
}

function findItemsBySectionId(sectionId) {
  const db = readDB();
  return db.sectionItems
    .filter((item) => item.sectionId === Number(sectionId))
    .sort((a, b) => a.order - b.order);
}

function findItemById(itemId) {
  const db = readDB();
  return db.sectionItems.find((item) => item.id === Number(itemId)) || null;
}

function createSection({ documentId, type, label, order }) {
  const db = readDB();
  const docSections = db.sections.filter((s) => s.documentId === Number(documentId));
  const section = {
    id: getNextId(db.sections),
    documentId: Number(documentId),
    type,
    label: label || type,
    order: order ?? docSections.length + 1,
  };
  db.sections.push(section);
  writeDB(db);
  return section;
}

function updateSection(sectionId, updates) {
  const db = readDB();
  const section = db.sections.find((s) => s.id === Number(sectionId));
  if (!section) return null;

  if (updates.label !== undefined) section.label = updates.label;
  if (updates.order !== undefined) section.order = updates.order;

  writeDB(db);
  return section;
}

function deleteSection(sectionId) {
  const db = readDB();
  const id = Number(sectionId);
  const index = db.sections.findIndex((s) => s.id === id);
  if (index === -1) return false;

  db.sections.splice(index, 1);
  db.sectionItems = db.sectionItems.filter((item) => item.sectionId !== id);
  writeDB(db);
  return true;
}

function createItem({ sectionId, fields, order }) {
  const db = readDB();
  const sectionItems = db.sectionItems.filter((item) => item.sectionId === Number(sectionId));
  const item = {
    id: getNextId(db.sectionItems),
    sectionId: Number(sectionId),
    order: order ?? sectionItems.length + 1,
    fields: fields || {},
  };
  db.sectionItems.push(item);
  writeDB(db);
  return item;
}

function updateItem(itemId, updates) {
  const db = readDB();
  const item = db.sectionItems.find((i) => i.id === Number(itemId));
  if (!item) return null;

  if (updates.fields !== undefined) item.fields = updates.fields;
  if (updates.order !== undefined) item.order = updates.order;

  writeDB(db);
  return item;
}

function deleteItem(itemId) {
  const db = readDB();
  const id = Number(itemId);
  const index = db.sectionItems.findIndex((item) => item.id === id);
  if (index === -1) return false;

  db.sectionItems.splice(index, 1);
  writeDB(db);
  return true;
}

function replaceDocumentContent(documentId, snapshot) {
  const db = readDB();
  const id = Number(documentId);
  const document = db.documents.find((d) => d.id === id);
  if (!document) return null;

  if (snapshot.title) document.title = snapshot.title;
  document.updatedAt = new Date().toISOString();

  const sectionIds = db.sections.filter((s) => s.documentId === id).map((s) => s.id);
  db.sections = db.sections.filter((s) => s.documentId !== id);
  db.sectionItems = db.sectionItems.filter((item) => !sectionIds.includes(item.sectionId));

  (snapshot.sections || []).forEach((sectionData, index) => {
    const section = {
      id: getNextId(db.sections),
      documentId: id,
      type: sectionData.type,
      label: sectionData.label || sectionData.type,
      order: sectionData.order ?? index + 1,
    };
    db.sections.push(section);

    (sectionData.items || []).forEach((itemData, itemIndex) => {
      const item = {
        id: getNextId(db.sectionItems),
        sectionId: section.id,
        order: itemData.order ?? itemIndex + 1,
        fields: itemData.fields || {},
      };
      db.sectionItems.push(item);
    });
  });

  writeDB(db);
  return document;
}

module.exports = {
  findByDocumentId,
  findSectionById,
  findItemsBySectionId,
  findItemById,
  createSection,
  updateSection,
  deleteSection,
  createItem,
  updateItem,
  deleteItem,
  replaceDocumentContent,
};
