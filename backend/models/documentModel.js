const db = require('./db');

function findAll() {
    const data = db.read();
    return data.documents;
}

function findById(id) {
    const data = db.read();
    return data.documents.find(doc => doc.id === id);
}

function create(document) {
    const data = db.read();
    data.documents.push(document);
    db.write(data);
}

function update(id, document) {
    const data = db.read();
    const index = data.documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
        data.documents[index] = document;
        db.write(data);
    }
}

module.exports = {
    findAll,
    findById,
    create,
    update
};

// ---------------------------------------------------------------------------
// File: models/documentModel.js
// Defines the "Document" model — all logic for finding, creating and
// updating documents. Controllers call these functions instead of
// touching db.js or data.json directly, keeping storage details
// separate from request-handling logic.
// ---------------------------------------------------------------------------
