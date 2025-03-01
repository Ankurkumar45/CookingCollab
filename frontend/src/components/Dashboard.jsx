import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLikes: 0,
    totalComments: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user profile data
        const userResponse = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(userResponse.data);
        // Fetch user's recipes
        const recipesResponse = await axios.get('http://localhost:5000/api/recipes/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRecipes(recipesResponse.data);

        // Fetch user stats
        const statsResponse = await axios.get('http://localhost:5000/api/users/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStats(statsResponse.data);

      } catch (error) {
        console.error('Error details:', error.response?.data); // Detailed error log
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update recipes list after deletion
      setRecipes(recipes.filter(recipe => recipe._id !== recipeId));

      // Update stats
      setStats(prev => ({
        ...prev,
        totalRecipes: prev.totalRecipes - 1
      }));

    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Failed to delete recipe');
    }
  };

  if (loading || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              {user?.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="bg-secondary rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center"
                  style={{ width: '150px', height: '150px' }}
                >
                  <span className="display-4 text-white">{user?.name?.[0]}</span>
                </div>
              )}
              <h4>{user?.name}</h4>
              <p className="text-muted">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Your Statistics</h5>
              <div className="row g-4 mt-2">
                <div className="col-md-4">
                  <div className="border rounded p-3 text-center">
                    <h3>{recipes.length}</h3>
                    <p className="mb-0">Recipes Shared</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded p-3 text-center">
                    <h3>{stats.totalLikes}</h3>
                    <p className="mb-0">Likes Received</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded p-3 text-center">
                    <h3>{stats.totalComments}</h3>
                    <p className="mb-0">Comments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Section */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Your Recipes</h4>
            <button
              className="btn btn-outline-danger"
              onClick={() => navigate('/share-your-recipe')}
            >
              <i className="bi bi-plus-lg me-2"></i>Add New Recipe
            </button>
          </div>
          {recipes.length > 0 ? (
            <div className="row g-4">
              {recipes.map((recipe) => (
                <div key={recipe._id} className="col-md-4">
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
                      <p className="card-text text-muted">
                        {recipe.description.length > 100
                          ? `${recipe.description.substring(0, 100)}...`
                          : recipe.description}
                      </p>
                      <div className="d-flex align-items-center text-muted small mb-2">
                        <i className="bi bi-heart-fill me-1 text-danger"></i>
                        <span className="me-3">{recipe.likes?.length || 0}</span>
                        <i className="bi bi-chat-fill me-1 text-danger"></i>
                        <span>{recipe.comments?.length || 0}</span>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent">
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                        >
                          <i className="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteRecipe(recipe._id)}
                        >
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-5 border rounded">
              <h5>You haven't shared any recipes yet</h5>
              <button
                className="btn btn-outline-danger mt-3"
                onClick={() => navigate('/share-your-recipe')}
              >
                Share Your First Recipe
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;