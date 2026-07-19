// middlewares/authValidator.js
// Verifies the Bearer token on protected routes and attaches the
// resolved userId to the request object for downstream handlers.

const authModel = require("../models/authModel");

async function authValidator(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const token = header.slice(7);
  const session = authModel.findSessionByToken(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  req.userId = session.userId;
  next();
}

module.exports = authValidator;
