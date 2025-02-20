import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import poster_01 from '../assets/posters/poster-01.jpg';
import poster_02 from '../assets/posters/poster-02.jpg';
import ShareRecipe from './ShareRecipe';

const Home = () => {
  const [shareRecipe, setShareRecipe] = useState(false);
  const navigate = useNavigate();

  const handleShareRecipe = () => {
    const user = localStorage.getItem('username');
    if (user) {
      setShareRecipe(true);
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div className="container-fluid p-0">
        <div id="recipeCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#recipeCarousel" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#recipeCarousel" data-bs-slide-to="1"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={poster_01} className="d-block w-100" alt="Recipe Poster 1" style={{ height: '70vh', objectFit: 'cover' }} />
              <div className="carousel-caption d-none d-md-block">
                <h2>Discover Amazing Recipes</h2>
                <p>Share and explore delicious recipes from around the world</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src={poster_02} className="d-block w-100" alt="Recipe Poster 2" style={{ height: '70vh', objectFit: 'cover' }} />
              <div className="carousel-caption d-none d-md-block">
                <h2>Cook Like a Pro</h2>
                <p>Learn new cooking techniques and recipes</p>
              </div>
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#recipeCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#recipeCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className="container mt-5">
          <h2 className="text-center mb-4">Featured Recipes</h2>
          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Latest Recipes</h5>
                  <p className="card-text">Discover our newest and most trending recipes shared by our community.</p>
                  <button className="btn btn-outline-danger">View More</button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Popular Categories</h5>
                  <p className="card-text">Browse through our most popular recipe categories.</p>
                  <button className="btn btn-outline-danger">Explore</button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Share Your Recipe</h5>
                  <p className="card-text">Got a unique recipe? Share it with our community!</p>
                  <button 
                    className="btn btn-outline-danger" 
                    onClick={handleShareRecipe}
                  >
                    Share Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {shareRecipe && (
          <div className="modal-backdrop show">
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Share Your Recipe</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShareRecipe(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <ShareRecipe onClose={() => setShareRecipe(false)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
