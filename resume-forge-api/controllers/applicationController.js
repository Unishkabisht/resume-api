// controllers/applicationController.js
// Handles job applications linked to the logged-in user.

const applicationModel = require("../models/applicationModel");

async function listApplications(req, res) {
  try {
    const applications = applicationModel.findAllByUserId(req.userId);
    return res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      data: applications,
    });
  } catch (error) {
    console.log("error in listApplications", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function createApplication(req, res) {
  try {
    const { company, role, documentId, notes } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        success: false,
        message: "Company and role are required",
      });
    }

    const application = applicationModel.createApplication({
      userId: req.userId,
      company,
      role,
      documentId,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: application,
    });
  } catch (error) {
    console.log("error in createApplication", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function updateApplication(req, res) {
  try {
    const application = applicationModel.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.userId !== req.userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { status, notes } = req.body;

    if (status !== undefined && !applicationModel.VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = applicationModel.updateApplication(application.id, { status, notes });

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log("error in updateApplication", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function deleteApplication(req, res) {
  try {
    const application = applicationModel.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.userId !== req.userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    applicationModel.deleteApplication(application.id);

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in deleteApplication", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = {
  listApplications,
  createApplication,
  updateApplication,
  deleteApplication,
};
