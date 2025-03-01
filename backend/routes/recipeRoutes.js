const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { title, image, description, ingredients, prerequisites } = req.body;

        const newRecipe = new Recipe({
            title,
            image,
            description,
            ingredients: ingredients.split('\n').map(item => item.trim()).filter(Boolean),
            prerequisites: prerequisites.split('\n').map(item => item.trim()).filter(Boolean),
            user: req.userId
        });

        await newRecipe.save();

        res.status(201).json({
            message: 'Recipe shared successfully',
            recipe: newRecipe
        });
    } catch (error) {
        console.error('Recipe creation error:', error);
        res.status(500).json({ message: 'Failed to share recipe' });
    }
});

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('user', 'name')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

// Get user's recipes
router.get('/user', auth, async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.userId })
            .sort({ createdAt: -1 }); // Latest first
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

// Like a recipe
router.post('/:id/like', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const likeIndex = recipe.likes.indexOf(req.userId);
        if (likeIndex === -1) {
            recipe.likes.push(req.userId);
        } else {
            recipe.likes.splice(likeIndex, 1);
        }

        await recipe.save();
        res.json({ likes: recipe.likes });
    } catch (error) {
        res.status(500).json({ message: 'Error updating likes' });
    }
});

// Add comment to recipe
router.post('/:id/comment', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        recipe.comments.push({
            user: req.userId,
            text: req.body.text
        });

        await recipe.save();
        res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: 'Error deleting recipe' });
    }
});

module.exports = router;