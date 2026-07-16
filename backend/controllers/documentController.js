const documentModel = require('../models/documentModel');

function list(req, res) {
    try {
        const documents = documentModel.findAll();
        res.send({
            success: true,
            message: "Retrieve the list of documents.",
            documents: documents,
        });
    } catch (error) {
        console.log("error in list", error);
        res.status(500).send({
            success: false,
            message: "Failed to retrieve the list of documents.",
        });
    }
}

function create(req, res) {
    res.send({
        message: "Hello from Gaurav!"
    });
}

function findOne(req, res) {
    try {
        const id = req.params.id;
        const document = documentModel.findById(id);

        if (!document) {
            return res.status(404).send({
                success: false,
                message: "Document not found.",
            });
        }

        res.send({
            success: true,
            message: "Retrieved the document.",
            document
        });
    } catch (error) {
        console.log("error in retrieve", error);
        res.status(500).send({
            success: false,
            message: "Failed to retrieve the document.",
        });
    }
}

module.exports = {
    list,
    create,
    findOne
};

// ---------------------------------------------------------------------------
// File: controllers/documentController.js
// A controller connects requests to data. It reads what the client
// sent (req), asks the model for data, and sends back a response
// (res). It does not touch data.json or fs directly — that job
// belongs to the model and db layers.
// ---------------------------------------------------------------------------
