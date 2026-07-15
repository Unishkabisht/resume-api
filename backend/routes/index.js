// express import karte hain
const express = require('express');
const router = express.Router();

// hello route ke liye function
function getData(req, res) {
  res.send({
    message: "Hello from Unishka!"
  });
}

// root '/' route pe hello message
router.get('/', getData);

// '/documents' path pe documentRoutes ko mount karte hain
router.use('/documents', require('./documentRoutes'));

module.exports = router;