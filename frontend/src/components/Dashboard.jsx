import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      const allRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
      const userRecipes = allRecipes.filter(recipe => recipe.userId === currentUser.email);
      setRecipes(userRecipes);
    }
  }, [navigate]);

  return (
    <div className="container py-5">
      {user && (
        <>
          <div className="row mb-5">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body text-center">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt="Profile" 
                      className="rounded-circle mb-3"
                      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="bg-secondary rounded-circle mb-3 mx-auto d-flex align-items-center justify-content-center"
                         style={{ width: '150px', height: '150px' }}>
                      <span className="display-4 text-white">{user.name[0]}</span>
                    </div>
                  )}
                  <h4>{user.name}</h4>
                  <p className="text-muted">{user.email}</p>
                </div>
              </div>
            </div>
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
                        <h3>0</h3>
                        <p className="mb-0">Likes Received</p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="border rounded p-3 text-center">
                        <h3>0</h3>
                        <p className="mb-0">Comments</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h4 className="mb-4">Your Recipes</h4>
              {recipes.length > 0 ? (
                <div className="row g-4">
                  {recipes.map((recipe, index) => (
                    <div key={index} className="col-md-4">
                      <div className="card h-100">
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
                        </div>
                        <div className="card-footer bg-transparent">
                          <button className="btn btn-outline-danger me-2">Edit</button>
                          <button className="btn btn-outline-danger">Delete</button>
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
        </>
      )}
    </div>
  );
};

export default Dashboard;