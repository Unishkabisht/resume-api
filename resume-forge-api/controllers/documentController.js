// controllers/documentController.js
// Handles resume/cover-letter documents: list, create, import, fetch,
// update, duplicate, and delete. Also exports checkOwnership() since
// the section and version controllers rely on it too.

const documentModel = require("../models/documentModel");

const VALID_TYPES = ["resume", "cover_letter"];

function checkOwnership(document, userId, res) {
  if (!document) {
    res.status(404).json({ success: false, message: "Document not found" });
    return false;
  }
  if (document.userId !== userId) {
    res.status(403).json({ success: false, message: "Forbidden" });
    return false;
  }
  return true;
}

async function listDocuments(req, res) {
  try {
    const documents = documentModel.findAllByUserId(req.userId);
    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      data: documents,
    });
  } catch (error) {
    console.log("error in listDocuments", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function createDocument(req, res) {
  try {
    const { title, type, templateId } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type are required",
      });
    }

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid type",
      });
    }

    const document = documentModel.createDocument({
      userId: req.userId,
      title,
      type,
      templateId,
    });

    return res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: document,
    });
  } catch (error) {
    console.log("error in createDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function importDocument(req, res) {
  try {
    const { source, title, rawData } = req.body;

    if (!source || !title) {
      return res.status(400).json({
        success: false,
        message: "Source and title are required",
      });
    }

    const document = documentModel.importDocument({
      userId: req.userId,
      title,
      rawData,
    });

    return res.status(201).json({
      success: true,
      message: `Document imported from ${source}; content auto-generated from rawData`,
      data: documentModel.assembleDocument(document),
    });
  } catch (error) {
    console.log("error in importDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function getDocument(req, res) {
  try {
    const document = documentModel.findById(req.params.id);
    if (!checkOwnership(document, req.userId, res)) return;

    return res.status(200).json({
      success: true,
      message: "Document fetched successfully",
      data: documentModel.assembleDocument(document),
    });
  } catch (error) {
    console.log("error in getDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function updateDocument(req, res) {
  try {
    const document = documentModel.findById(req.params.id);
    if (!checkOwnership(document, req.userId, res)) return;

    const { title, templateId } = req.body;
    const updated = documentModel.updateDocument(document.id, { title, templateId });

    return res.status(200).json({
      success: true,
      message: "Document updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("error in updateDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function duplicateDocument(req, res) {
  try {
    const document = documentModel.findById(req.params.id);
    if (!checkOwnership(document, req.userId, res)) return;

    const copy = documentModel.duplicateDocument(document.id, req.userId);

    return res.status(201).json({
      success: true,
      message: "Document duplicated successfully",
      data: documentModel.assembleDocument(copy),
    });
  } catch (error) {
    console.log("error in duplicateDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function deleteDocument(req, res) {
  try {
    const document = documentModel.findById(req.params.id);
    if (!checkOwnership(document, req.userId, res)) return;

    documentModel.deleteDocumentCascade(document.id);

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in deleteDocument", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  listDocuments,
  createDocument,
  importDocument,
  getDocument,
  updateDocument,
  duplicateDocument,
  deleteDocument,
  checkOwnership,
};
