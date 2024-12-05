const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper functions for Scrypt
async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve({ hash: derivedKey.toString('hex'), salt });
    });
  });
}

async function verifyPassword(storedHash, storedSalt, password) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, storedSalt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(storedHash === derivedKey.toString('hex'));
    });
  });
}

// Register a user
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const { hash, salt } = await hashPassword(password);
    const user = new User({ username, email, passwordHash: hash, passwordSalt: salt, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: 'Error registering user', details: err.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt:', req.body);
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await verifyPassword(user.passwordHash, user.passwordSalt, password);
    if (!isMatch) {
      console.error('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in', details: err.message });
  }
});

// Get user profile
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash -passwordSalt'); // Exclude sensitive data
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username: req.body.username, email: req.body.email },
      { new: true }
    ).select('-passwordHash -passwordSalt');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Error updating user profile' });
  }
});

module.exports = router;
