const Recipe = require('../models/Recipe');

// Create a new recipe
const createRecipe = async (req, res) => {
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
}

// Get all recipes
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('user', 'name')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes' });
    }
}

// Get user's recipes
const getUserRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ user: req.userId })
            .sort({ createdAt: -1 }); // Latest first
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
}

const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('user', 'name')
            .populate('comments.user', 'name');
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipe' });
    }
}

const likeRecipe = async (req, res) => {
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
}

const commentToRecipe = async (req, res) => {
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
}

const deleteRecipe = async (req, res) => {
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
}

const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Check if the user owns the recipe
        if (recipe.user.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized to update this recipe' });
        }

        const { title, image, description, ingredients, prerequisites } = req.body;
        const updatedData = {
            title: title || recipe.title,
            image: image || recipe.image,
            description: description || recipe.description,
            ingredients: ingredients ? ingredients.split('\n').map(item => item.trim()).filter(Boolean) : recipe.ingredients,
            prerequisites: prerequisites ? prerequisites.split('\n').map(item => item.trim()).filter(Boolean) : recipe.prerequisites
        };

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        res.json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: 'Error updating recipe' });
    }
}

module.exports = { createRecipe, getAllRecipes, getUserRecipes, getRecipeById, likeRecipe, commentToRecipe, deleteRecipe, updateRecipe };