import React, { useState } from 'react';

const ShareRecipe = () => {

    const [recipeData, setRecipeData] = useState({
        rescipeName: "",
        image: "",
        description: "",
        ingredients: "",
        prerequisites: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipeData({
            ...recipeData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setRecipeData({
            ...recipeData,
            image: file,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Recipe submitted:", recipeData);
    };

    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
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