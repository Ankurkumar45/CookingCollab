const express = require('express');
const Comment = require('../models/Comment');

const router = express.Router();

router.post('/', async (req, res) => {
    const { text, user, recipe } = req.body;
    const comment = new Comment({ text, user, recipe });
    await comment.save();
    res.json(comment);
})

router.get('/:recipeId', async (req, res) => {
    const comments = await Comment.find({ recipe: req.params.recipeId }).populate('user', 'name');
    res.json(comments);
});

module.exports = router;