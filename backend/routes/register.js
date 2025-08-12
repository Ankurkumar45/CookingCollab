const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Validation middleware
const validateUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

router.post('/', validateUser, async (req, res) => {
  try {
    const { name, email, password, image } = req.body;

    console.log('Registration request received:', {
      name,
      email,
      hasPassword: !!password,
      hasImage: !!image
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lowerCaseEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: lowerCaseEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Let Mongoose handle password hashing via pre-save hook
    const user = new User({
      name,
      email: lowerCaseEmail,
      password, // plain password, will be hashed by model
      image
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

module.exports = router;