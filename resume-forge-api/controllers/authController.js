// controllers/authController.js
// Handles registration, login, logout, and password reset. Sessions are
// stored as simple mock tokens (no real JWT/bcrypt) since this API runs
// on a local JSON file - fine for learning, not for production.

const authModel = require("../models/authModel");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    if (authModel.findUserByEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = authModel.createUser({ name, email, password });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: authModel.stripPassword(user),
    });
  } catch (error) {
    console.log("error in register", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = authModel.findUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const session = authModel.createSession(user.id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: session.token,
        user: authModel.stripPassword(user),
      },
    });
  } catch (error) {
    console.log("error in login", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function logout(req, res) {
  try {
    const token =
      req.body.token ||
      (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : null);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }

    const session = authModel.findSessionByToken(token);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    authModel.deleteSessionByToken(token);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in logout", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = authModel.findUserByEmail(email);
    let resetToken = null;

    if (user) {
      resetToken = authModel.createPasswordReset(user.id);
    }

    return res.status(200).json({
      success: true,
      message: "If that email is registered, a reset link has been sent",
      data: resetToken ? { resetToken } : {},
    });
  } catch (error) {
    console.log("error in forgotPassword", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    const resetRecord = authModel.findPasswordResetByToken(resetToken);
    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    authModel.updateUserPassword(resetRecord.userId, newPassword);
    authModel.deletePasswordReset(resetToken);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in resetPassword", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = { register, login, logout, forgotPassword, resetPassword };
