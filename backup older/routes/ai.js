const express = require("express");
const router = express.Router();

router.post("/bullets", function (req, res) {
    res.send("Bullets improved");
});

router.post("/summary", function (req, res) {
    res.send("Summary generated");
});

router.post("/rewrite", function (req, res) {
    res.send("Text rewritten");
});

router.post("/prompt", function (req, res) {
    res.send("Instruction applied");
});

module.exports = router;