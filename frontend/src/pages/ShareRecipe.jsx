import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShareRecipe = () => {
    const navigate = useNavigate();
    const [recipeData, setRecipeData] = useState({
        title: '',
        image: '',
        description: '',
        ingredients: '',
        prerequisites: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Check authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipeData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5242880) { // 5MB limit
                setError('Image size should be less than 5MB');
                return;
            }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                navigate('/login');
                return;
            }

            const response = await axios.post(
                'https://cookingcollab.onrender.com/api/recipes',
                recipeData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Use response data
            console.log('Recipe shared successfully:', response.data);
            
            setSuccess(true);
            // Reset form
            setRecipeData({
                title: '',
                image: '',
                description: '',
                ingredients: '',
                prerequisites: '',
            });

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to share recipe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
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
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Share Your Recipe</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Recipe Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={recipeData.title}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">Recipe Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="image"
                                        name="image"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        required
                                    />
                                    <small className="text-muted">Maximum file size: 5MB</small>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={recipeData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="ingredients" className="form-label">Ingredients</label>
                                    <textarea
                                        className="form-control"
                                        id="ingredients"
                                        name="ingredients"
                                        value={recipeData.ingredients}
                                        onChange={handleInputChange}
                                        rows="4"
                                        required
                                        placeholder="Enter each ingredient on a new line"
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="prerequisites" className="form-label">Prerequisites</label>
                                    <textarea
                                        className="form-control"
                                        id="prerequisites"
                                        name="prerequisites"
                                        value={recipeData.prerequisites}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Tools, preparation steps, or special requirements"
                                    ></textarea>
                                </div>

                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-outline-danger"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Sharing Recipe...
                                            </>
                                        ) : 'Share Recipe'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareRecipe;