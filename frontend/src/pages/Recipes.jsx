import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [activeRecipe, setActiveRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('https://cookingcollab.onrender.com/api/recipes');
      setRecipes(response.data);
    } catch (error) {
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (recipeId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `https://cookingcollab.onrender.com/api/recipes/${recipeId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchRecipes(); // Refresh recipes to get updated likes
    } catch (error) {
      setError('Failed to like recipe');
    }
  };

  const handleComment = async (recipeId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) return;

    try {
      await axios.post(
        `https://cookingcollab.onrender.com/api/recipes/${recipeId}/comment`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCommentText('');
      setActiveRecipe(null);
      fetchRecipes(); // Refresh recipes to show new comment
    } catch (error) {
      setError('Failed to post comment');
    }
  };

  const getRecipeById = async (req, res) => {
    try {
      const recipe = await recipes.findById(req.params.id)
        .populate('user', 'name')
        .populate('comments.user', 'name');
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recipe' });
    }
  };

  console.log('RecipeID:', getRecipeById);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Community Recipes</h1>
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}
      <div className="row g-4">
        {recipes.map(recipe => (
          <div key={recipe._id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              {recipe.image && (
                <img
                  src={recipe.image}
                  className="card-img-top"
                  alt={recipe.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text">{recipe.description}</p>
                <p className="small text-muted">By {recipe.user?.name || 'Unknown'}</p>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleLike(recipe._id)}
                  >
                    <i className="bi bi-heart-fill me-1"></i>
                    {recipe.likes?.length || 0}
                  </button>

                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setActiveRecipe(activeRecipe === recipe._id ? null : recipe._id)}
                  >
                    <i className="bi bi-chat-left-text me-1"></i>
                    {recipe.comments?.length || 0}
                  </button>
                </div>

                {activeRecipe === recipe._id && (
                  <div className="mt-3">
                    <div className="mb-3">
                      {recipe.comments?.map((comment, index) => (
                        <div key={index} className="border-bottom mb-2 pb-2">
                          <p className="small mb-1">
                            <strong>{comment.user?.name || 'Anonymous'}</strong>
                            <span className="text-muted ms-2">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="mb-0">{comment.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleComment(recipe._id)}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;