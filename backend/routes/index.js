// Importing the express module
const express = require('express');
const router = express.Router();

// Function for the hello route
function getData(req, res) {
  res.send({
    message: "Hello from Unishka!"
  });
}

// Sending a hello message on the root '/' route
router.get('/', getData);

// Mounting documentRoutes on the '/documents' path
router.use('/documents', require('./documentRoutes'));

module.exports = router;
