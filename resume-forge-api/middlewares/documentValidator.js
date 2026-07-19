// middlewares/documentValidator.js
// Basic guard that makes sure a document id was actually passed in
// the route params before the controller runs.

function documentValidator(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(403).json({
      success: false,
      message: "Document id is required",
    });
  }
  next();
}

module.exports = documentValidator;
