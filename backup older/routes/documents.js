const express = require("express");
const router = express.Router();

let documents = [];

router.get("/", function (req, res) {
    res.json(documents);
});

router.post("/", function (req, res) {
    let newDoc = req.body;
    documents.push(newDoc);
    res.send("Document created");
});

router.post("/import", function (req, res) {
    res.send("Document imported");
});

router.get("/:id", function (req, res) {
    res.send("Here is document " + req.params.id);
});

router.put("/:id", function (req, res) {
    res.send("Document " + req.params.id + " updated");
});

router.post("/:id/duplicate", function (req, res) {
    res.send("Document " + req.params.id + " duplicated");
});

router.delete("/:id", function (req, res) {
    res.send("Document " + req.params.id + " deleted");
});

//sections

router.post("/:id/sections", function (req, res) {
    res.send("Section added");
});

router.patch("/:id/sections/:sectionId", function (req, res) {
    res.send("Section updated");
});

router.delete("/:id/sections/:sectionId", function (req, res) {
    res.send("Section deleted");
});

router.post("/:id/sections/:sectionId/items", function (req, res) {
    res.send("Item added");
});

router.patch("/:id/sections/:sectionId/items/:itemId", function (req, res) {
    res.send("Item updated");
});

router.delete("/:id/sections/:sectionId/items/:itemId", function (req, res) {
    res.send("Item deleted");
});


//versions

router.get("/:id/versions", function (req, res) {
    res.send("List of versions");
});

router.post("/:id/versions", function (req, res) {
    res.send("Version saved");
});

router.post("/:id/versions/:versionId/restore", function (req, res) {
    res.send("Version restored");
});

module.exports = router;