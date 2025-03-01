const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Get user stats
router.get('/stats', auth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.userId });

        const totalLikes = recipes.reduce((sum, recipe) => sum + recipe.likes.length, 0);
        const totalComments = recipes.reduce((sum, recipe) => sum + recipe.comments.length, 0);

        res.json({
            totalLikes,
            totalComments,
            recipesCount: recipes.length
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Error fetching user statistics' });
    }
});

module.exports = router;