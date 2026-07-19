// controllers/aiController.js
// Dummy AI-assisted writing helpers (bullet points, summaries, rewrites,
// custom prompts). Actual AI integration is out of scope for now, so
// this just simulates the behaviour and deducts an AI credit per call.

const authModel = require("../models/authModel");

function improve(text) {
  return `${text} (improved)`;
}

function deductCredit(userId, res) {
  const user = authModel.findUserById(userId);
  if (!user || user.aiCredits <= 0) {
    res.status(402).json({
      success: false,
      message: "Insufficient AI credits",
    });
    return false;
  }
  authModel.decrementAiCredits(userId);
  return true;
}

async function improveBullets(req, res) {
  try {
    const { text, bullets } = req.body;

    if (text) {
      if (!deductCredit(req.userId, res)) return;
      return res.status(200).json({
        success: true,
        message: "Bullets improved successfully",
        data: { result: improve(text) },
      });
    }

    if (bullets && Array.isArray(bullets) && bullets.length > 0) {
      if (!deductCredit(req.userId, res)) return;
      return res.status(200).json({
        success: true,
        message: "Bullets improved successfully",
        data: { result: bullets.map(improve) },
      });
    }

    return res.status(400).json({ success: false, message: "Text is required" });
  } catch (error) {
    console.log("error in improveBullets", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function improveSummary(req, res) {
  try {
    const { context } = req.body;
    if (!context) {
      return res.status(400).json({ success: false, message: "Context is required" });
    }

    if (!deductCredit(req.userId, res)) return;

    return res.status(200).json({
      success: true,
      message: "Summary improved successfully",
      data: { result: improve(context) },
    });
  } catch (error) {
    console.log("error in improveSummary", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function rewriteText(req, res) {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: "Text is required" });
    }

    if (!deductCredit(req.userId, res)) return;

    return res.status(200).json({
      success: true,
      message: "Text rewritten successfully",
      data: { result: improve(text) },
    });
  } catch (error) {
    console.log("error in rewriteText", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

async function promptSection(req, res) {
  try {
    const { sectionId, instruction } = req.body;

    if (!sectionId || !instruction) {
      return res.status(400).json({ success: false, message: "Section id and instruction are required" });
    }

    if (!deductCredit(req.userId, res)) return;

    return res.status(200).json({
      success: true,
      message: "Instruction applied successfully",
      data: { result: `Applied instruction: '${instruction}' (improved)` },
    });
  } catch (error) {
    console.log("error in promptSection", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { improveBullets, improveSummary, rewriteText, promptSection };
