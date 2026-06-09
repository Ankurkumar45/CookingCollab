import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShareRecipe = () => {
    const navigate = useNavigate();
    const [recipeData, setRecipeData] = useState({
        title: '', image: '', description: '', ingredients: '', prerequisites: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [step, setStep] = useState(1); // multi-step form

    useEffect(() => {
        if (!localStorage.getItem('token')) navigate('/login');
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipeData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5242880) { setError('Image must be under 5MB.'); return; }
        const reader = new FileReader();
        reader.onloadend = () => {
            setRecipeData(prev => ({ ...prev, image: reader.result }));
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) { navigate('/login'); return; }
            await axios.post('https://cookingcollab.onrender.com/api/recipes', recipeData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not share recipe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Details', 'Ingredients', 'Review'];

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Header */}
            <div className="bg-white border-b border-stone-200">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 mb-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                    <h1 className="text-2xl font-medium text-stone-900 mb-4">Share a recipe</h1>

                    {/* Step indicators */}
                    <div className="flex items-center gap-2">
                        {steps.map((s, i) => (
                            <React.Fragment key={s}>
                                <div className={`flex items-center gap-1.5 text-xs font-medium ${i + 1 <= step ? 'text-herb-400' : 'text-stone-400'}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${i + 1 < step ? 'bg-herb-400 text-white' :
                                            i + 1 === step ? 'border-2 border-herb-400 text-herb-400' :
                                                'border border-stone-300 text-stone-300'
                                        }`}>
                                        {i + 1 < step ? '✓' : i + 1}
                                    </div>
                                    {s}
                                </div>
                                {i < steps.length - 1 && <div className={`flex-1 h-px ${i + 1 < step ? 'bg-herb-400' : 'bg-stone-200'}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
                {error && (
                    <div className="alert-error mb-6">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="ml-auto">✕</button>
                    </div>
                )}

                {success && (
                    <div className="alert-success mb-6">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Recipe shared! Redirecting to your dashboard...</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Details */}
                    {step === 1 && (
                        <div className="card p-6 space-y-5">
                            <div>
                                <label className="input-label">Recipe title *</label>
                                <input type="text" name="title" className="input-field" placeholder="e.g. Spiced lamb tagine"
                                    value={recipeData.title} onChange={handleChange} required />
                            </div>

                            <div>
                                <label className="input-label">Description *</label>
                                <textarea name="description" className="input-field resize-none" rows={3}
                                    placeholder="Briefly describe your recipe — what it tastes like, where it's from, why you love it."
                                    value={recipeData.description} onChange={handleChange} required />
                            </div>

                            <div>
                                <label className="input-label">Recipe photo *</label>
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-stone-200" />
                                        <button type="button" onClick={() => { setImagePreview(null); setRecipeData(p => ({ ...p, image: '' })); }}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm border border-stone-200 text-stone-500 hover:text-paprika-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer hover:border-herb-400 hover:bg-herb-50 transition-colors">
                                        <svg className="w-8 h-8 text-stone-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm text-stone-400">Click to upload a photo</span>
                                        <span className="text-xs text-stone-300 mt-0.5">Max 5MB · JPG, PNG, WEBP</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button type="button" onClick={() => setStep(2)} disabled={!recipeData.title || !recipeData.description}
                                    className="btn-primary px-6">
                                    Next: Ingredients →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Ingredients */}
                    {step === 2 && (
                        <div className="card p-6 space-y-5">
                            <div>
                                <label className="input-label">Ingredients *</label>
                                <p className="text-xs text-stone-400 mb-2">List each ingredient on a new line. E.g. "2 cups flour"</p>
                                <textarea name="ingredients" className="input-field resize-none font-mono text-xs" rows={8}
                                    placeholder={"500g chicken breast\n2 tbsp olive oil\n1 tsp cumin\n..."}
                                    value={recipeData.ingredients} onChange={handleChange} required />
                            </div>

                            <div>
                                <label className="input-label">Prerequisites <span className="text-stone-400 font-normal">(optional)</span></label>
                                <p className="text-xs text-stone-400 mb-2">Equipment, prep steps, or special requirements</p>
                                <textarea name="prerequisites" className="input-field resize-none" rows={3}
                                    placeholder="e.g. Preheat oven to 200°C. You'll need a large skillet or wok."
                                    value={recipeData.prerequisites} onChange={handleChange} />
                            </div>

                            <div className="flex justify-between">
                                <button type="button" onClick={() => setStep(1)} className="btn-ghost text-stone-500">
                                    ← Back
                                </button>
                                <button type="button" onClick={() => setStep(3)} disabled={!recipeData.ingredients}
                                    className="btn-primary px-6">
                                    Review →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Review */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="card overflow-hidden">
                                {imagePreview && <img src={imagePreview} alt="Recipe" className="w-full h-52 object-cover" />}
                                <div className="p-5">
                                    <h2 className="text-xl font-medium text-stone-900 mb-2">{recipeData.title}</h2>
                                    <p className="text-sm text-stone-500 mb-4 leading-relaxed">{recipeData.description}</p>
                                    {recipeData.prerequisites && (
                                        <div className="bg-saffron-50 rounded-xl p-3 mb-4">
                                            <p className="text-xs font-medium text-saffron-700 mb-1">Prerequisites</p>
                                            <p className="text-xs text-stone-600">{recipeData.prerequisites}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-xs font-medium text-stone-600 mb-2">Ingredients</p>
                                        <ul className="space-y-1">
                                            {recipeData.ingredients.split('\n').filter(Boolean).map((ing, i) => (
                                                <li key={i} className="text-sm text-stone-700 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-herb-400 flex-shrink-0" />
                                                    {ing}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button type="button" onClick={() => setStep(2)} className="btn-ghost text-stone-500">
                                    ← Edit
                                </button>
                                <button type="submit" disabled={loading}
                                    className="btn-primary px-8 flex items-center gap-2">
                                    {loading
                                        ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Publishing...</>
                                        : 'Publish recipe'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ShareRecipe;