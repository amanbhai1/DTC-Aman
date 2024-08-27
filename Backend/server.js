// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from './middleware/authMiddleware.js';

// Initialize environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Failed to connect to MongoDB Atlas:", error.message);
        process.exit(1); // Exit if connection fails
    }
};
connectDB();

// Define User Schema and Model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login Successfully", token });
        } else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

// Signup Route
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already Registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Successfully Registered" });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
});

// Protected Route Example
app.get("/home", authMiddleware, (req, res) => {
    res.status(200).json({ message: "Welcome to the home page" });
});

// Start Server
const PORT = process.env.PORT || 9002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
