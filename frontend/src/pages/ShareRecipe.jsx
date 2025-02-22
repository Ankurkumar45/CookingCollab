import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShareRecipe = () => {
    const navigate = useNavigate();
    const [recipeData, setRecipeData] = useState({
        recipeName: "",
        image: "",
        description: "",
        ingredients: "",
        prerequisites: "",
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Check authentication on component mount
    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipeData({
            ...recipeData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setRecipeData(prev => ({
                    ...prev,
                    image: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                setError('You must be logged in to share a recipe');
                return;
            }

            // Create recipe object with user information
            const newRecipe = {
                ...recipeData,
                userId: currentUser.email,
                authorName: currentUser.name,
                createdAt: new Date().toISOString(),
                id: Date.now().toString()
            };

            // Get existing recipes or initialize empty array
            const existingRecipes = JSON.parse(localStorage.getItem('recipes') || '[]');
            
            // Add new recipe
            existingRecipes.push(newRecipe);
            
            // Save to localStorage
            localStorage.setItem('recipes', JSON.stringify(existingRecipes));

            // Show success message
            setSuccess(true);
            
            // Reset form
            setRecipeData({
                recipeName: "",
                image: "",
                description: "",
                ingredients: "",
                prerequisites: "",
            });

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            setError('Failed to save recipe. Please try again.');
        }
    };

    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {error && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                {error}
                                <button type="button" className="btn-close" onClick={() => setError('')}></button>
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert">
                                Recipe shared successfully!
                                <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
                            </div>
                        )}
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Share Your Recipe</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="recipeName" className="form-label">
                                            Recipe Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="recipeName"
                                            name="recipeName"
                                            value={recipeData.recipeName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="image" className="form-label">
                                            Recipe Image
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            name="image"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">
                                            Description
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={recipeData.description}
                                            onChange={handleInputChange}
                                            rows="4"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="ingredients" className="form-label">
                                            Ingredients
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="ingredients"
                                            name="ingredients"
                                            value={recipeData.ingredients}
                                            onChange={handleInputChange}
                                            rows="4"
                                            required
                                        ></textarea>
                                        <small className="text-muted">
                                            List each ingredient on a new line.
                                        </small>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="prerequisites" className="form-label">
                                            Prerequisites
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="prerequisites"
                                            name="prerequisites"
                                            value={recipeData.prerequisites}
                                            onChange={handleInputChange}
                                            rows="4"
                                        ></textarea>
                                        <small className="text-muted">
                                            List any prerequisites (e.g., tools, skills, or preparation steps).
                                        </small>
                                    </div>

                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-outline-danger">
                                            Submit Recipe
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ShareRecipe;