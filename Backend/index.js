const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_URI)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("Error connecting to MongoDB:", err));

// ======================= User Schema & Auth =======================
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// Signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================= Notes Schema & Routes =======================
const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  categories: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const Notes = mongoose.model("Notes", noteSchema);

// Add note
app.post("/api/notes/addnote", async (req, res) => {
  try {
    const { userId, title, description, categories } = req.body;
    const note = new Notes({userId, title, description, categories: categories || [] });
    await note.save();
    res.status(201).json({ message: "Note added successfully" });
  } catch (error) {
    console.error("Add note error:", error);
    res.status(500).json({ message: "Error adding note" });
  }
});

// Fetch notes
app.get("/api/notes/fetchnotes/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Notes.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Fetch notes error:", error);
    res.status(500).json({ message: "Error fetching notes" });
  }
});


// delete note
app.delete("/api/notes/deletenote/:userId/:noteId", async (req, res) => {
  try{
    const userId = req.params.userId;
    const noteId = req.params.noteId;
    await Notes.deleteOne({userId: userId, _id: noteId});
    res.send("note deleted successfully");
  }
  catch(error){
    res.send(error);
  }
})


// update notes
app.put("/api/notes/updatenote/:userId/:noteId", async (req, res) => {
  try{
    const userId = req.params.userId;
    const noteId = req.params.noteId;
    const { title, description, categories } = req.body;
    await Notes.updateOne({ userId: userId, _id: noteId },{ $set: { title, description, categories } })
    res.send("notes updated successfully")
  }
  catch(error){
    res.send(error);
  }
})



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
