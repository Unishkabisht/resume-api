// controllers/versionController.js
// Handles saving a snapshot of a document as a version, listing saved
// versions, and restoring a document back to an older version.

const documentModel = require("../models/documentModel");
const sectionModel = require("../models/sectionModel");
const versionModel = require("../models/versionModel");
const { checkOwnership } = require("./documentController");

async function listVersions(req, res) {
  try {
    const document = documentModel.findById(req.params.id);
    if (!checkOwnership(document, req.userId, res)) return;

    const versions = versionModel.findByDocumentId(document.id);

    return res.status(200).json({
      success: true,
      message: "Versions fetched successfully",
      data: versions,
    });
  } catch (error) {
    console.log("error in listVersions", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function createVersion(req, res) {
  try {
    const document = documentModel.findById(req.params.id);
    if (!checkOwnership(document, req.userId, res)) return;

    const { label } = req.body;
    const snapshot = documentModel.assembleDocument(document);

    const version = versionModel.createVersion({
      documentId: document.id,
      label,
      snapshot,
    });

    return res.status(201).json({
      success: true,
      message: "Version saved successfully",
      data: version,
    });
  } catch (error) {
    console.log("error in createVersion", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function restoreVersion(req, res) {
  try {
    const document = documentModel.findById(req.params.id);
    if (!checkOwnership(document, req.userId, res)) return;

    const version = versionModel.findById(req.params.versionId);
    if (!version || version.documentId !== document.id) {
      return res.status(404).json({
        success: false,
        message: "Version not found",
      });
    }

    sectionModel.replaceDocumentContent(document.id, version.snapshot);
    const restored = documentModel.assembleDocument(documentModel.findById(document.id));

    return res.status(200).json({
      success: true,
      message: "Version restored successfully",
      data: restored,
    });
  } catch (error) {
    console.log("error in restoreVersion", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { listVersions, createVersion, restoreVersion };
