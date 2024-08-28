import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
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
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas");
    } catch (error) {
        console.error("Failed to connect to MongoDB Atlas:", error.message);
        process.exit(1);
    }
};
connectDB();

// Define User Schema and Model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Define OTP Schema and Model
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '10m' }, // OTP expires after 10 minutes
});

const OTP = mongoose.model("OTP", otpSchema);
const routeSchema = new mongoose.Schema({
    _id: String,
    route_name: String,
    route_short_name: String,
    route_type: String,
    route_description: String,
    bus_stops: [String],
  });
  
  const RouteDetails = mongoose.model('routedetails', routeSchema);

// Setup Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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

app.get("/Home", authMiddleware, (req, res) => {
    res.status(200).json({ message: "Welcome to the home page" });
});

// Generate and send OTP
app.post("/api/forgot-password/request-otp", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedOtp = await bcrypt.hash(otpCode, 10);

        const otp = new OTP({ email, code: hashedOtp });
        await otp.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is ${otpCode}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
});

// Verify OTP
app.post("/api/forgot-password/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    try {
        const storedOtp = await OTP.findOne({ email });
        if (!storedOtp) {
            return res.status(400).json({ message: "OTP not found or expired" });
        }

        const isMatch = await bcrypt.compare(otp, storedOtp.code);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.status(200).json({ message: "OTP verified", token });
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
});

// Reset Password
app.post("/api/forgot-password/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.updateOne({ email }, { password: hashedPassword });

        await OTP.deleteOne({ email });

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
});

// Route Details Endpoint
// API Route to fetch route details by route_short_name
app.get('/api/routes/:route_short_name', async (req, res) => {
    try {
      const routeDetails = await RouteDetails.findOne({ route_short_name: req.params.route_short_name });
      if (!routeDetails) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.json(routeDetails);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
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
