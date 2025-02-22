import React from 'react';

const About = () => {
    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    <h1 className="text-center mb-5">About Recipe Share</h1>

                    <div className="card mb-4">
                        <div className="card-body">
                            <h2 className="card-title h4">Our Mission</h2>
                            <p className="card-text">
                                Recipe Share is a community-driven platform dedicated to bringing food lovers together.
                                We believe that every recipe tells a story and every dish creates a memory. Our mission
                                is to create a space where passionate cooks can share their culinary creativity and
                                inspire others to explore the joy of cooking.
                            </p>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-body">
                            <h2 className="card-title h4">What We Offer</h2>
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <i className="bi bi-share-fill text-danger me-2"></i>
                                        <div>
                                            <h5 className="h6">Recipe Sharing</h5>
                                            <p className="small">Share your favorite recipes with our growing community</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <i className="bi bi-search text-danger me-2"></i>
                                        <div>
                                            <h5 className="h6">Recipe Discovery</h5>
                                            <p className="small">Explore unique recipes from around the world</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <i className="bi bi-people-fill text-danger me-2"></i>
                                        <div>
                                            <h5 className="h6">Community</h5>
                                            <p className="small">Connect with other food enthusiasts</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start">
                                        <i className="bi bi-star-fill text-danger me-2"></i>
                                        <div>
                                            <h5 className="h6">Personal Collections</h5>
                                            <p className="small">Save and organize your favorite recipes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-body">
                            <h2 className="card-title h4">Our Story</h2>
                            <p className="card-text">
                                Recipe Share started as a passion project in 2024, born from the idea that great recipes
                                deserve to be shared. What began as a simple recipe-sharing platform has grown into a
                                vibrant community of food lovers, home cooks, and culinary enthusiasts.
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body text-center">
                            <h2 className="card-title h4">Join Our Community</h2>
                            <p className="card-text">
                                Ready to start sharing your recipes and discovering new favorites?
                            </p>
                            <button
                                className="btn btn-outline-danger"
                                onClick={() => window.location.href = '/register'}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;