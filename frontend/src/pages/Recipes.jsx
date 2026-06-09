import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'https://cookingcollab.onrender.com/api';

// const TagBadge = ({ tag }) => (
//   <span className="tag tag-stone">{tag}</span>
// );

const RecipeSkeleton = () => (
  <div className="recipe-card animate-pulse">
    <div className="h-44 bg-stone-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-stone-100 rounded w-3/4" />
      <div className="h-3 bg-stone-100 rounded w-full" />
      <div className="h-3 bg-stone-100 rounded w-2/3" />
    </div>
  </div>
);

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [search, setSearch] = useState('');
  const [likeLoading, setLikeLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchRecipes(); }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/recipes`);
      setRecipes(res.data);
    } catch {
      setError('Could not load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (recipeId) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setLikeLoading(recipeId);
    try {
      await axios.post(`${API}/recipes/${recipeId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRecipes();
    } catch {
      setError('Could not like this recipe.');
    } finally {
      setLikeLoading(null);
    }
  };

  const handleComment = async (recipeId) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    if (!commentText.trim()) return;
    try {
      await axios.post(`${API}/recipes/${recipeId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText('');
      setActiveRecipe(null);
      fetchRecipes();
    } catch {
      setError('Could not post comment.');
    }
  };

  const filtered = recipes.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-medium text-stone-900 mb-4">Community recipes</h1>
          {/* Search */}
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 h-10 max-w-sm">
            <svg className="w-4 h-4 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search recipes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none flex-1 text-stone-900 placeholder-stone-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-stone-400 hover:text-stone-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Error */}
        {error && (
          <div className="alert-error mb-6">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-paprika-400 hover:text-paprika-700">✕</button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <RecipeSkeleton key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-stone-700 mb-2">
              {search ? `No recipes match "${search}"` : 'No recipes yet'}
            </h3>
            <p className="text-stone-400 text-sm mb-6">
              {search ? 'Try a different search term.' : 'Be the first to share a recipe!'}
            </p>
            {!search && (
              <button onClick={() => navigate('/share-your-recipe')} className="btn-primary">
                Share the first recipe
              </button>
            )}
          </div>
        )}

        {/* Recipe grid */}
        {!loading && filtered.length > 0 && (
          <>
            <p className="text-sm text-stone-400 mb-5">{filtered.length} recipe{filtered.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(recipe => (
                <div key={recipe._id} className="recipe-card flex flex-col">
                  {/* Image */}
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-herb-50 to-herb-100 flex items-center justify-center text-4xl">
                      🍳
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-medium text-stone-900 text-[15px] mb-1 line-clamp-1">{recipe.title}</h3>
                    <p className="text-sm text-stone-500 mb-2 line-clamp-2 leading-relaxed flex-1">{recipe.description}</p>
                    <p className="text-xs text-stone-400 mb-3">by {recipe.user?.name || 'Anonymous'}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                      <button
                        onClick={() => handleLike(recipe._id)}
                        disabled={likeLoading === recipe._id}
                        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-paprika-400 transition-colors px-2 py-1 rounded-lg hover:bg-paprika-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{recipe.likes?.length || 0}</span>
                      </button>

                      <button
                        onClick={() => setActiveRecipe(activeRecipe === recipe._id ? null : recipe._id)}
                        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-herb-400 transition-colors px-2 py-1 rounded-lg hover:bg-herb-50"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{recipe.comments?.length || 0}</span>
                      </button>
                    </div>

                    {/* Comments panel */}
                    {activeRecipe === recipe._id && (
                      <div className="mt-3 pt-3 border-t border-stone-100">
                        {recipe.comments?.length > 0 && (
                          <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
                            {recipe.comments.map((c, i) => (
                              <div key={i} className="text-xs">
                                <span className="font-medium text-stone-700">{c.user?.name || 'Anon'}</span>
                                <span className="text-stone-400 ml-1.5">
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                                <p className="text-stone-600 mt-0.5">{c.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="input-field text-xs py-1.5"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleComment(recipe._id)}
                          />
                          <button
                            onClick={() => handleComment(recipe._id)}
                            className="btn-primary px-3 py-1.5 text-xs flex-shrink-0"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Recipes;