// controllers/templateController.js
// Read-only endpoints for browsing resume templates.

const templateModel = require("../models/templateModel");

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

async function createTemplate(req, res) {
  try {
    const { name, description, config } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Template name is required",
      });
    }

    const template = templateModel.createTemplate({
      name,
      description: description || "",
      config: config || {},
    });

    return res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: template,
    });
  } catch (error) {
    console.log("error in createTemplate", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { listTemplates, getTemplate, createTemplate };
