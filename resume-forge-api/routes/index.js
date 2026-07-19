// routes/index.js
// Single entry point for all API routes.
// Every resource (auth, users, documents, sections, versions, templates,
// ai, applications) is registered here so app.js only has to mount one router.

const express = require("express");
const router = express.Router();

// Middlewares
const authValidator = require("../middlewares/authValidator");
const documentValidator = require("../middlewares/documentValidator");

// Controllers
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const documentController = require("../controllers/documentController");
const sectionController = require("../controllers/sectionController");
const versionController = require("../controllers/versionController");
const templateController = require("../controllers/templateController");
const aiController = require("../controllers/aiController");
const applicationController = require("../controllers/applicationController");

// ================= AUTH =================
// /api/auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/reset-password", authController.resetPassword);

// ================= USERS =================
// /api/users - logged-in user's own profile
router.get("/users/me", authValidator, userController.getMe);
router.put("/users/me", authValidator, userController.updateMe);
router.delete("/users/me", authValidator, userController.deleteMe);

// ================= DOCUMENTS =================
// /api/documents
router.get("/documents", authValidator, documentController.listDocuments);
router.post("/documents", authValidator, documentController.createDocument);
router.post("/documents/import", authValidator, documentController.importDocument);
router.get("/documents/:id", authValidator, documentValidator, documentController.getDocument);
router.put("/documents/:id", authValidator, documentValidator, documentController.updateDocument);
router.post("/documents/:id/duplicate", authValidator, documentValidator, documentController.duplicateDocument);
router.delete("/documents/:id", authValidator, documentValidator, documentController.deleteDocument);

// ================= SECTIONS (nested under a document) =================
// /api/documents/:id/sections
router.post("/documents/:id/sections", authValidator, documentValidator, sectionController.createSection);
router.patch("/documents/:id/sections/:sectionId", authValidator, documentValidator, sectionController.updateSection);
router.delete("/documents/:id/sections/:sectionId", authValidator, documentValidator, sectionController.deleteSection);

// Items inside a section
router.post("/documents/:id/sections/:sectionId/items", authValidator, documentValidator, sectionController.createItem);
router.patch("/documents/:id/sections/:sectionId/items/:itemId", authValidator, documentValidator, sectionController.updateItem);
router.delete("/documents/:id/sections/:sectionId/items/:itemId", authValidator, documentValidator, sectionController.deleteItem);

// ================= VERSIONS (nested under a document) =================
// /api/documents/:id/versions
router.get("/documents/:id/versions", authValidator, documentValidator, versionController.listVersions);
router.post("/documents/:id/versions", authValidator, documentValidator, versionController.createVersion);
router.post("/documents/:id/versions/:versionId/restore", authValidator, documentValidator, versionController.restoreVersion);

// ================= TEMPLATES =================
// /api/templates - public, read-only. There is no create endpoint
// because templates are curated resources, not user-generated content.
router.get("/templates", templateController.listTemplates);
router.get("/templates/:id", templateController.getTemplate);

// ================= AI =================
// /api/ai - dummy AI-assisted resume writing helpers (consumes credits)
router.post("/ai/bullets", authValidator, aiController.improveBullets);
router.post("/ai/summary", authValidator, aiController.improveSummary);
router.post("/ai/rewrite", authValidator, aiController.rewriteText);
router.post("/ai/prompt", authValidator, aiController.promptSection);

// ================= APPLICATIONS =================
// /api/applications - tracks job applications linked to a user
router.get("/applications", authValidator, applicationController.listApplications);
router.post("/applications", authValidator, applicationController.createApplication);
router.patch("/applications/:id", authValidator, applicationController.updateApplication);
router.delete("/applications/:id", authValidator, applicationController.deleteApplication);

module.exports = router;
