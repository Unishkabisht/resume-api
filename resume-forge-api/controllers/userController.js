// controllers/userController.js
// Handles the logged-in user's own profile: view, update, and delete.

const authModel = require("../models/authModel");
const userModel = require("../models/userModel");

async function getMe(req, res) {
  try {
    const user = userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: authModel.stripPassword(user),
    });
  } catch (error) {
    console.log("error in getMe", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function updateMe(req, res) {
  try {
    const { name, email } = req.body;

    if (name === undefined && email === undefined) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update",
      });
    }

    const user = userModel.updateUser(req.userId, { name, email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: authModel.stripPassword(user),
    });
  } catch (error) {
    console.log("error in updateMe", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function deleteMe(req, res) {
  try {
    const deleted = userModel.deleteUser(req.userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: {},
    });
  } catch (error) {
    console.log("error in deleteMe", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

module.exports = { getMe, updateMe, deleteMe };
