import express from 'express';
import Crew from '../models/Crew.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Login Route
router.post('/crew', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password.' });
  }

  try {
    // Check if the user exists
    const crew = await Crew.findOne({ username });
    if (!crew) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the password matches
    const isMatch = await crew.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign({ id: crew._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.json({ message: 'Login successful!', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
