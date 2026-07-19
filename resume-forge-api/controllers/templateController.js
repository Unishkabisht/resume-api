// controllers/templateController.js
// Read-only endpoints for browsing resume templates.

const templateModel = require("../models/templateModel");

// GET /api/templates
// Returns every available resume template. Public route — no auth required.
async function listTemplates(req, res) {
  try {
    const templates = templateModel.findAll();
    return res.status(200).json({
      success: true,
      message: "Templates fetched successfully",
      data: templates,
    });
  } catch (error) {
    console.log("error in listTemplates", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// GET /api/templates/:id
// Returns a single template by id, or a 404 if it doesn't exist.
// Public route — no auth required.
async function getTemplate(req, res) {
  try {
    const template = templateModel.findById(req.params.id);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Template fetched successfully",
      data: template,
    });
  } catch (error) {
    console.log("error in getTemplate", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { listTemplates, getTemplate };
