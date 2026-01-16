import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditRecipie() {

    const navigate = useNavigate();
    const { id } = useParams();
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

    // Check authentication and fetch recipe data on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`https://cookingcollab.onrender.com/api/recipes/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const recipe = response.data;
                setRecipeData({
                    title: recipe.title,
                    image: recipe.image,
                    description: recipe.description,
                    ingredients: recipe.ingredients.join('\n'),
                    prerequisites: recipe.prerequisites.join('\n'),
                });
            } catch (error) {
                setError('Failed to load recipe data');
            }
        };

        fetchRecipe();
    }, [navigate, id]);

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

            await axios.put(
                `https://cookingcollab.onrender.com/api/recipes/${id}`,
                recipeData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess(true);
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update recipe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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
                                Recipe updated successfully!
                                <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
                            </div>
                        )}
                        <div className="card shadow">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Edit Your Recipe</h2>
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
                                        {recipeData.image && <img src={recipeData.image} alt="Current recipe" className="img-fluid mb-2" style={{maxHeight: '200px'}} />}
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            name="image"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        <small className="text-muted">Maximum file size: 5MB (leave empty to keep current image)</small>
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
                                                    Updating Recipe...
                                                </>
                                            ) : 'Update Recipe'}
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

export default EditRecipie;
