const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3200;

app.use(express.json());
app.use(cors());

const mongoUrl = "mongodb+srv://dbuser:agnel@cluster0.ek7nz.mongodb.net/KatakanaApp";

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database Connected Successfully");
    app.listen(port, () => {
      console.log(`Server is running at port ${port}`);
    });
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// --- SCHEMAS ---

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("users", userSchema);

const flashcardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  character: { type: String, required: true },
  romanji: { type: String, required: true },
  fact: { type: String },
  word: { type: String },
});

const Flashcard = mongoose.model("flashcards", flashcardSchema);

const quizHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  username: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const QuizHistory = mongoose.model("quizHistory", quizHistorySchema);

// --- AUTH MIDDLEWARE ---

const authorize = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }
  jwt.verify(token, "my-key", (err, userInfo) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = userInfo;
    next();
  });
};

// --- ROUTES ---

// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Register request body:", req.body); // Add this line
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    res.status(200).json({ message: "User registered successfully", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// Login (with username or email)
app.post("/api/login", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Login request body:", req.body);

  let userData = null;
  if (username && email) {
    userData = await User.findOne({ $or: [{ username }, { email }] });
  } else if (username) {
    userData = await User.findOne({ username });
  } else if (email) {
    userData = await User.findOne({ email });
  } else {
    return res.status(400).json({ message: "Username or email is required" });
  }

  if (!userData) {
    console.log("User not found");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, userData.password);
  if (!isPasswordValid) {
    console.log("Invalid password");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: userData._id, username: userData.username, email: userData.email },
    "my-key",
    { expiresIn: "1h" }
  );
  res.status(200).json({ message: "Login successful", token });
});

// Secured test route
app.get("/api/secured", authorize, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

// Get all flashcards
app.get("/api/flashcards", async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.status(200).json(flashcards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flashcards", error: error.message });
  }
});

// Add a flashcard
app.post("/api/flashcards", async (req, res) => {
  const { character, romanji, fact, word } = req.body;
  try {
    const newFlashcard = new Flashcard({ id: uuidv4(), character, romanji, fact, word });
    const savedFlashcard = await newFlashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (error) {
    res.status(500).json({ message: "Error creating flashcard", error: error.message });
  }
});

// Save quiz history
app.post("/api/quiz-history", authorize, async (req, res) => {
  const { score, totalQuestions } = req.body;
  try {
    const newHistory = new QuizHistory({
      userId: req.user.userId,
      username: req.user.username,
      score,
      totalQuestions,
      date: new Date(),
    });
    const savedHistory = await newHistory.save();
    res.status(201).json(savedHistory);
  } catch (error) {
    res.status(500).json({ message: "Error saving quiz history", error: error.message });
  }
});

// Get quiz history
app.get("/api/quiz-history", authorize, async (req, res) => {
  try {
    const history = await QuizHistory.find({ userId: req.user.userId });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quiz history", error: error.message });
  }
});

// Get a random katakana word from Jisho
app.get("/api/random-word", async (req, res) => {
  try {
    const response = await axios.get("https://jisho.org/api/v1/search/words?keyword=katakana");
    if (response.data && response.data.data.length > 0) {
      const wordData = response.data.data[0];
      res.status(200).json({
        word: wordData.japanese[0].word || wordData.japanese[0].reading,
        meaning: wordData.senses[0].english_definitions.join(", "),
      });
    } else {
      res.status(404).json({ message: "No word found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching word", error: error.message });
  }
});