// Importing our two helper functions from db.js.
// We don't deal with fs/path directly here — db.js already handles that.
const { readData, writeData } = require('../models/db');

// This function runs when someone sends a GET request to see all documents.
function getDocuments(req, res) {
    // Get the latest data from the file.
    const data = readData();

    // Send only the 'documents' array back to whoever made the request.
    res.send(data.documents);
}

// This function runs when someone sends a POST request to add a new document.
function createDocument(req, res) {
    // First, read the current data so we don't overwrite existing documents.
    const data = readData();

    // Build a new document object using data sent by the client (req.body)
    // plus an auto-generated id based on how many documents already exist.
    const newDocument = {
        id: data.documents.length + 1,
        title: req.body.title,
        content: req.body.content
    };

    // Add the new document to the existing documents array (in memory).
    data.documents.push(newDocument);

    // Save the whole updated data object back into the file.
    writeData(data);

    // Send back the newly created document as confirmation.
    // Status 201 means "Created successfully".
    res.status(201).send(newDocument);
}

// Exporting both functions so the routes file can use them.
module.exports = { getDocuments, createDocument };
