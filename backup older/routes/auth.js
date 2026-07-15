const express = require("express");
const router = express.Router();

router.post("/register", function (req, res) {
    res.send("User registered");
});

router.post("/login", function (req, res) {
    res.send("Login successful");
});

router.post("/logout", function (req, res) {
    res.send("Logout successful");
});

router.post("/forgot-password", function (req, res) {
    res.send("Password reset link sent");
});

router.post("/reset-password", function (req, res) {
    res.send("Password reset successful");
});

router.get("/test", function (req, res) {
    res.send("Auth Router Working");
});

module.exports = router;