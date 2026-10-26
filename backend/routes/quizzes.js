const express = require("express");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/quizzes - List all quizzes
router.get("/", authenticateToken, async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    return res.json(quizzes);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch quizzes" });
  }
});

// GET /api/quizzes/:id - Get a quiz with its questions
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const questions = await Question.find({ quiz: quiz._id }).select("-correctAnswer");
    return res.json({
      ...quiz.toObject(),
      questions,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch quiz" });
  }
});

// POST /api/quizzes/:id/submit - Submit answers and calculate score securely on server
router.post("/:id/submit", authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    const questions = await Question.find({ quiz: req.params.id });
    let score = 0;

    answers.forEach((ans) => {
      const q = questions.find((item) => item._id.toString() === ans.questionId);
      if (q && q.correctAnswer === ans.selectedIndex) {
        score += 1;
      }
    });

    return res.json({
      score,
      total: questions.length,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to submit quiz" });
  }
});

// POST /api/quizzes - Create quiz (admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Quiz title is required" });
    }

    const quiz = new Quiz({
      title: title.trim(),
      description: description ? description.trim() : "",
    });
    await quiz.save();
    return res.status(201).json(quiz);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to create quiz" });
  }
});

// PUT /api/quizzes/:id - Update quiz (admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (title) quiz.title = title.trim();
    if (description !== undefined) quiz.description = description.trim();
    await quiz.save();

    return res.json(quiz);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to update quiz" });
  }
});

// DELETE /api/quizzes/:id - Delete quiz and associated questions (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await Question.deleteMany({ quiz: req.params.id });
    return res.json({ message: "Quiz and associated questions deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to delete quiz" });
  }
});

module.exports = router;
