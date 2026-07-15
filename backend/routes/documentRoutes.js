// Import the express library .
const express = require('express');

// Creating a "router" — a mini version of an express app,
// used to group related routes together (all /documents routes here).
const router = express.Router();

// Importing our two controller functions.
// These contain the actual logic; this file just connects them to routes.
const { getDocuments, createDocument } = require('../controllers/documentController');

// When a GET request comes to '/', run getDocuments (return all documents).
router.get('/', getDocuments);

// When a POST request comes to '/', run createDocument (add a new document).
router.post('/', createDocument);

// Exporting the router so index.js can use it.
module.exports = router;
