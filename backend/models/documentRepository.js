/* Import database helper functions.
These functions are responsible for reading
 and writing data inside data.json.
const { readData, writeData } = require("./db");
*/

function findAllDocuments() {
    const data = readData();
    return data.documents;
}
function findDocumentById(id) {

    const data = readData();
    // find()
    // Returns the first matching object.
    return data.documents.find(document => document.id == id);
}


function createDocument(document) {

    const data = readData();


    data.documents.push(document);
    writeData(data);
    return document;
}


function updateDocument(id, updatedDocument) {

    const data = readData();
    // findIndex()
    // Returns the index of the first
    // matching element.
    const index = data.documents.findIndex(
        document => document.id == id
    );


    if (index === -1) {
        return null;
    }


    data.documents[index] = updatedDocument;
    writeData(data);

    return updatedDocument;
}


// Remove a document using its id.
function deleteDocument(id) {

    const data = readData();

    // Find the document position.
    const index = data.documents.findIndex(
        document => document.id == id
    );

    // Stop if the document does not exist.
    if (index === -1) {
        return false;
    }
    data.documents.splice(index, 1);

    writeData(data);

    return true;
}

module.exports = {
    findAllDocuments,
    findDocumentById,
    createDocument,
    updateDocument,
    deleteDocument
};


/*
File: models/documentRepository.js

Definition:
A repository is responsible for managing
all data-related operations.

Purpose:
It acts as the data layer of the application.
Instead of accessing the database directly,
controllers call repository functions.

Responsibilities:
- Read documents
- Create documents
- Update documents
- Delete documents
- Hide database logic from controllers

Contains:
- findAllDocuments()
- findDocumentById()
- createDocument()
- updateDocument()
- deleteDocument()

Important Methods:

find()
Returns the first element that matches
the given condition.

findIndex()
Returns the index of the first matching element.

push()
Adds a new element at the end of an array.

splice()
Removes or replaces elements in an array.
*/