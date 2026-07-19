const express = require('express');
const router = express.Router();

function getData(req, res) {
    res.send({
        message: "Hello from Unishka!"
    });
}
router.get('/', getData);

router.use('/documents', require('./documentRoutes'));

module.exports = router;

// ---------------------------------------------------------------------------
// File: routes/index.js
// The main router. It combines every route file (like
// documentRoutes.js) into one place, so app.js only needs to import
// this single file to load every route in the app.
// ---------------------------------------------------------------------------

