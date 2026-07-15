const express = require("express");
const router = express.Router();

router.get("/me", function (req, res) {
    res.send("This is your profile");
});

router.put("/me", function (req, res) {
    res.send("Profile updated");
});

router.delete("/me", function (req, res) {
    res.send("Account deleted");
});

module.exports = router;