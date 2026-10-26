var path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var mongoose = require("mongoose");
var dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
var quizzesRouter = require("./routes/quizzes");
var questionsRouter = require("./routes/questions");
var seedDatabase = require("./seed");

var app = express();

// MongoDB connection
var mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quizapp";
mongoose
  .connect(mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB successfully at " + mongoUri);
    await seedDatabase();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Middleware (Express Generator standard + CORS)
app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Route mounts
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/questions", questionsRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({ message: "Not Found: " + req.originalUrl });
});

// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
