const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
    res.send("List of templates");
});

router.get("/:id", function (req, res) {
    res.send("Template " + req.params.id);
});

module.exports = router;