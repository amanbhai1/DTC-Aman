import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import OTP from './models/OTP.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Generate and send OTP
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    // Save OTP to database, removing any previous OTP
    await OTP.findOneAndUpdate(
      { email },
      { code: hashedOtp, createdAt: Date.now() },
      { upsert: true }
    );

    // Setup Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otpCode}. It is valid for 10 minutes.`
    };

    // Send OTP via email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const storedOtp = await OTP.findOne({ email });
    if (!storedOtp) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    // Check OTP expiry (10 minutes)
    const otpAge = (Date.now() - new Date(storedOtp.createdAt).getTime()) / 1000 / 60;
    if (otpAge > 10) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, storedOtp.code);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Generate JWT token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.status(200).json({ message: "OTP verified", token });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await User.updateOne({ email }, { password: hashedPassword });

    // Delete OTP record
    await OTP.deleteOne({ email });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
});

export default router;
