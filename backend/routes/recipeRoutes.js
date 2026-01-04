const express = require('express');
const router = express.Router();

const { createRecipe, getAllRecipes, getUserRecipes, likeRecipe, commentToRecipe, deleteRecipe } = require('../controllers/recipeController');
const { auth } = require('../middleware/authMiddleware');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post('/', auth, upload.single('image'), createRecipe);
router.get('/', getAllRecipes);
router.get('/user', auth, getUserRecipes);
router.post('/:id/like', auth, likeRecipe);
router.post('/:id/comment', auth, commentToRecipe);
router.delete('/:id', auth, deleteRecipe);

module.exports = router;