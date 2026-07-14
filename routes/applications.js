const express = require("express");
const router = express.Router();

let applications = [];

router.get("/", function (req, res) {
    res.json(applications);
});

router.post("/", function (req, res) {
    let newApp = req.body;
    applications.push(newApp);
    res.send("Application added");
});

router.patch("/:id", function (req, res) {
    res.send("Application " + req.params.id + " status updated");
});

router.delete("/:id", function (req, res) {
    res.send("Application " + req.params.id + " deleted");
});

module.exports = router;