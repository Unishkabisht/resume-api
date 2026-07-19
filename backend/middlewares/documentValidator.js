function validate(req, res, next) {
    const params = req.params;

    if (!params.id) {
        return res.status(403).send({
            success: false,
            message: "Id not provided.",
        });
    }
    next();
}

module.exports = validate;

// ---------------------------------------------------------------------------
// File: middlewares/documentValidator.js
// A middleware function that runs between the request and the
// controller. Its job is to check that the request is valid (here,
// that an id param exists) before the controller's logic runs.
// If the check fails, it responds directly and the controller never runs.
// ---------------------------------------------------------------------------
