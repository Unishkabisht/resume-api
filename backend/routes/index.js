// Importing express.
const express = require('express');

// Main router that will combine all our smaller routers together.
const router = express.Router();

// A simple function that just sends back a welcome message.
function getData(req, res) {
    res.send({
        message: "Hello from Unishka!"
    });
}

// When someone visits the root path '/', send the hello message.
router.get('/', getData);

// Any request starting with '/documents' gets forwarded to documentRoutes.js.
// Example: '/documents' here + '/' inside documentRoutes.js = full route.
router.use('/documents', require('./documentRoutes'));

// Exporting this combined router so app.js can use it.
module.exports = router;
