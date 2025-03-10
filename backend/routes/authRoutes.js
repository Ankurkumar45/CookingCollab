const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, image } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            image
        });

        await user.save();
        console.log('User saved:', user); // Debug log

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Debug logging
        console.log('Login attempt:', {
            email,
            passwordProvided: !!password
        });

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });

        // Debug logging
        console.log('Database query result:', {
            userFound: !!user,
            userEmail: user?.email,
            hasPassword: !!user?.password
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Debug logging
        console.log('Password validation:', {
            isValid: isPasswordValid,
            providedPassword: !!password,
            storedPasswordHash: !!user.password
        });

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT using the correct environment variable
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET, // Changed from JWT_SECRET_KEY
            { expiresIn: '24h' }
        );

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Debug route - remove in production
router.get('/debug/users/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email.toLowerCase() });
        res.json({
            exists: !!user,
            userDetails: user ? {
                id: user._id,
                name: user.name,
                email: user.email,
                hasPassword: !!user.password
            } : null
        });
    } catch (error) {
        res.status(500).json({ message: 'Error checking user' });
    }
});

module.exports = router;