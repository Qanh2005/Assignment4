const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");

async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("Database already has users, skipping initial seed.");
      return;
    }

    console.log("Empty database detected. Seeding initial accounts and quiz...");

    const passwordHash = await bcrypt.hash("123", 10);

    const john = new User({
      username: "John",
      password: passwordHash,
      role: "user",
    });

    const mary = new User({
      username: "Mary",
      password: passwordHash,
      role: "admin",
    });

    await john.save();
    await mary.save();

    const sampleQuiz = new Quiz({
      title: "Capitals of Europe",
      description: "Test your knowledge of European capital cities!",
    });
    await sampleQuiz.save();

    const sampleQuestions = [
      {
        quiz: sampleQuiz._id,
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
      },
      {
        quiz: sampleQuiz._id,
        text: "What is the capital of Germany?",
        options: ["Munich", "Berlin", "Frankfurt", "Hamburg"],
        correctAnswer: 1,
      },
      {
        quiz: sampleQuiz._id,
        text: "What is the capital of Italy?",
        options: ["Rome", "Milan", "Venice", "Florence"],
        correctAnswer: 0,
      },
      {
        quiz: sampleQuiz._id,
        text: "What is the capital of Spain?",
        options: ["Barcelona", "Seville", "Valencia", "Madrid"],
        correctAnswer: 3,
      },
      {
        quiz: sampleQuiz._id,
        text: "What is the capital of the Netherlands?",
        options: ["Rotterdam", "Amsterdam", "The Hague", "Utrecht"],
        correctAnswer: 1,
      },
    ];

    await Question.insertMany(sampleQuestions);
    console.log("Seeding complete: John (user), Mary (admin), and Capitals of Europe quiz created.");
  } catch (err) {
    console.error("Error during seed:", err);
  }
}

module.exports = seedDatabase;
