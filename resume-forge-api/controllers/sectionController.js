// controllers/sectionController.js
// Handles sections within a document and the items inside each section.

const documentModel = require("../models/documentModel");
const sectionModel = require("../models/sectionModel");
const { checkOwnership } = require("./documentController");

const VALID_SECTION_TYPES = ["experience", "education", "skills", "projects", "custom"];

function getDocumentOrFail(req, res) {
  const document = documentModel.findById(req.params.id);
  if (!checkOwnership(document, req.userId, res)) return null;
  return document;
}

function getSectionOrFail(documentId, sectionId, res) {
  const section = sectionModel.findSectionById(sectionId);
  if (!section || section.documentId !== Number(documentId)) {
    res.status(404).json({ success: false, message: "Section not found" });
    return null;
  }
  return section;
}

async function createSection(req, res) {
  try {
    const document = getDocumentOrFail(req, res);
    if (!document) return;

    const { type, label } = req.body;
    if (!type) {
      return res.status(400).json({ success: false, message: "Section type is required" });
    }

    if (!VALID_SECTION_TYPES.includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid section type" });
    }

    const section = sectionModel.createSection({
      documentId: document.id,
      type,
      label,
    });

    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: section,
    });
  } catch (error) {
    console.log("error in createSection", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function updateSection(req, res) {
  try {
    const document = getDocumentOrFail(req, res);
    if (!document) return;

    const section = getSectionOrFail(document.id, req.params.sectionId, res);
    if (!section) return;

    const { label, order } = req.body;
    const updated = sectionModel.updateSection(section.id, { label, order });

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("error in updateSection", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function deleteSection(req, res) {
  try {
    const document = getDocumentOrFail(req, res);
    if (!document) return;

    const section = getSectionOrFail(document.id, req.params.sectionId, res);
    if (!section) return;

    sectionModel.deleteSection(section.id);

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in deleteSection", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function createItem(req, res) {
  try {
    const document = getDocumentOrFail(req, res);
    if (!document) return;

    const section = getSectionOrFail(document.id, req.params.sectionId, res);
    if (!section) return;

    const { fields } = req.body;
    const item = sectionModel.createItem({ sectionId: section.id, fields });

    return res.status(201).json({
      success: true,
      message: "Section item created successfully",
      data: item,
    });
  } catch (error) {
    console.log("error in createItem", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function updateItem(req, res) {
  try {
    const document = getDocumentOrFail(req, res);
    if (!document) return;

    const section = getSectionOrFail(document.id, req.params.sectionId, res);
    if (!section) return;

    const item = sectionModel.findItemById(req.params.itemId);
    if (!item || item.sectionId !== section.id) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    const { fields, order } = req.body;
    const updated = sectionModel.updateItem(item.id, { fields, order });

    return res.status(200).json({
      success: true,
      message: "Section item updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("error in updateItem", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function deleteItem(req, res) {
  try {
    const document = getDocumentOrFail(req, res);
    if (!document) return;

    const section = getSectionOrFail(document.id, req.params.sectionId, res);
    if (!section) return;

    const item = sectionModel.findItemById(req.params.itemId);
    if (!item || item.sectionId !== section.id) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    sectionModel.deleteItem(item.id);

    return res.status(200).json({
      success: true,
      message: "Section item deleted successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in deleteItem", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  createSection,
  updateSection,
  deleteSection,
  createItem,
  updateItem,
  deleteItem,
};
