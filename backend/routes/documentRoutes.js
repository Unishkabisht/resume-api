const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

const validate = require('../middlewares/documentValidator');

router.get('/', documentController.list);

router.get('/:id', validate, documentController.findOne);

router.post('/', documentController.create);

module.exports = router;

/*
 File: routes/documentRoutes.js
 Maps HTTP methods and URLs (like GET '/:id') to their matching
 controller functions, and attaches middleware (like validate) that
 should run before a controller. This file has no logic of its own —
 it only wires requests to the right function.
*/

