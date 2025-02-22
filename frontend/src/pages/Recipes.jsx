import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [user, setUser] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [activeRecipe, setActiveRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(currentUser);
    loadRecipes();
  }, []);

  const loadRecipes = () => {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    // Add likes and comments arrays if not present
    const updatedRecipes = storedRecipes.map(recipe => ({
      ...recipe,
      likes: recipe.likes || [],
      comments: recipe.comments || [],
      reports: recipe.reports || []
    }));
    setRecipes(updatedRecipes);
  };

  const handleLike = (recipeId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === recipeId) {
        const likes = recipe.likes || [];
        const userLikeIndex = likes.indexOf(user.email);
        
        if (userLikeIndex === -1) {
          likes.push(user.email);
        } else {
          likes.splice(userLikeIndex, 1);
        }
        
        return { ...recipe, likes };
      }
      return recipe;
    });

    setRecipes(updatedRecipes);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
  };

  const handleComment = (recipeId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) return;

    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === recipeId) {
        const comments = recipe.comments || [];
        comments.push({
          userId: user.email,
          userName: user.name,
          text: commentText,
          timestamp: new Date().toISOString()
        });
        return { ...recipe, comments };
      }
      return recipe;
    });

    setRecipes(updatedRecipes);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    setCommentText('');
    setActiveRecipe(null);
  };

  const handleReport = (recipeId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const updatedRecipes = recipes.map(recipe => {
      if (recipe.id === recipeId) {
        const reports = recipe.reports || [];
        if (!reports.includes(user.email)) {
          reports.push(user.email);
        }
        return { ...recipe, reports };
      }
      return recipe;
    });

    setRecipes(updatedRecipes);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5">Community Recipes</h1>
      <div className="row g-4">
        {recipes.map(recipe => (
          <div key={recipe.id} className="col-md-6 col-lg-4">
            <div className="card h-100">
              {recipe.image && (
                <img 
                  src={recipe.image} 
                  className="card-img-top" 
                  alt={recipe.recipeName}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{recipe.recipeName}</h5>
                <p className="card-text">{recipe.description}</p>
                <p className="small text-muted">By {recipe.authorName}</p>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <button 
                    className={`btn btn-sm ${recipe.likes?.includes(user?.email) ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => handleLike(recipe.id)}
                  >
                    <i className="bi bi-heart-fill me-1"></i>
                    {recipe.likes?.length || 0}
                  </button>
                  
                  <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setActiveRecipe(activeRecipe === recipe.id ? null : recipe.id)}
                  >
                    <i className="bi bi-chat-left-text me-1"></i>
                    {recipe.comments?.length || 0}
                  </button>
                  
                  {user && user.email !== recipe.userId && (
                    <button 
                      className={`btn btn-sm ${recipe.reports?.includes(user?.email) ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => handleReport(recipe.id)}
                    >
                      <i className="bi bi-flag-fill"></i>
                    </button>
                  )}
                </div>

                {activeRecipe === recipe.id && (
                  <div className="mt-3">
                    <div className="mb-3">
                      {recipe.comments?.map((comment, index) => (
                        <div key={index} className="border-bottom mb-2 pb-2">
                          <p className="small mb-1">
                            <strong>{comment.userName}</strong>
                            <span className="text-muted ms-2">
                              {new Date(comment.timestamp).toLocaleDateString()}
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
                        onClick={() => handleComment(recipe.id)}
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