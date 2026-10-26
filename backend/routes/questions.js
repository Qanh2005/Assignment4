const express = require("express");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/questions - List questions
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const filter = {};
    if (req.query.quiz) {
      filter.quiz = req.query.quiz;
    }
    const questions = await Question.find(filter)
      .populate("quiz", "title")
      .sort({ createdAt: -1 });
    return res.json(questions);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch questions" });
  }
});

// POST /api/questions - Create question (admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { quiz, text, options, correctAnswer } = req.body;
    if (!quiz || !text || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        message: "Question must include a quiz ID, text, and at least 2 options",
      });
    }

    const quizExists = await Quiz.findById(quiz);
    if (!quizExists) {
      return res.status(404).json({ message: "Specified quiz does not exist" });
    }

    const question = new Question({
      quiz,
      text: text.trim(),
      options: options.map((opt) => opt.trim()),
      correctAnswer: Number(correctAnswer) || 0,
    });
    await question.save();
    await question.populate("quiz", "title");

    return res.status(201).json(question);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to create question" });
  }
});

// PUT /api/questions/:id - Update question (admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { quiz, text, options, correctAnswer } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (quiz) {
      const quizExists = await Quiz.findById(quiz);
      if (!quizExists) {
        return res.status(404).json({ message: "Specified quiz does not exist" });
      }
      question.quiz = quiz;
    }
    if (text) question.text = text.trim();
    if (options && Array.isArray(options)) {
      question.options = options.map((opt) => opt.trim());
    }
    if (correctAnswer !== undefined) {
      question.correctAnswer = Number(correctAnswer);
    }

    await question.save();
    await question.populate("quiz", "title");

    return res.json(question);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to update question" });
  }
});

// DELETE /api/questions/:id - Delete question (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    return res.json({ message: "Question deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to delete question" });
  }
});

module.exports = router;
