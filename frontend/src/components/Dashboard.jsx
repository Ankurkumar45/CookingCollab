import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://cookingcollab.onrender.com/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    const load = async () => {
      try {
        const [userRes, recipesRes] = await Promise.all([
          axios.get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/recipes/user`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUser(userRes.data);
        setRecipes(recipesRes.data);
      } catch (err) {
        if (err.response?.status === 401) { localStorage.clear(); navigate('/login'); }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/recipes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setRecipes(r => r.filter(r => r._id !== id));
    } catch {
      alert('Could not delete recipe.');
    } finally {
      setDeleteId(null);
    }
  };

  const totalLikes = recipes.reduce((sum, r) => sum + (r.likes?.length || 0), 0);
  const totalComments = recipes.reduce((sum, r) => sum + (r.comments?.length || 0), 0);
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-stone-900">My dashboard</h1>
              <p className="text-stone-500 text-sm mt-0.5">Manage your recipes and track engagement</p>
            </div>
            <button onClick={() => navigate('/share-your-recipe')} className="btn-primary flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New recipe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Profile + stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Profile card */}
          <div className="card p-6 flex items-center gap-4">
            {user?.image ? (
              <img src={user.image} alt="Profile" className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="avatar w-16 h-16 text-xl flex-shrink-0">{initials}</div>
            )}
            <div className="min-w-0">
              <h3 className="font-medium text-stone-900 truncate">{user?.name}</h3>
              <p className="text-stone-400 text-sm truncate">{user?.email}</p>
              <span className="tag tag-green mt-2 inline-flex">🍳 Home cook</span>
            </div>
          </div>

          {/* Stats */}
          <div className="md:col-span-2 grid grid-cols-3 gap-3">
            <div className="stat-card text-center">
              <p className="text-2xl font-medium text-stone-900">{recipes.length}</p>
              <p className="text-xs text-stone-400 mt-1">Recipes shared</p>
            </div>
            <div className="stat-card text-center">
              <p className="text-2xl font-medium text-stone-900">{totalLikes}</p>
              <p className="text-xs text-stone-400 mt-1">Likes received</p>
            </div>
            <div className="stat-card text-center">
              <p className="text-2xl font-medium text-stone-900">{totalComments}</p>
              <p className="text-xs text-stone-400 mt-1">Comments</p>
            </div>
          </div>
        </div>

        {/* Recipes section */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium text-stone-900">Your recipes</h2>
            <span className="text-sm text-stone-400">{recipes.length} total</span>
          </div>

          {recipes.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-stone-700 mb-2">No recipes yet</h3>
              <p className="text-stone-400 text-sm mb-6">Share your first recipe with the community.</p>
              <button onClick={() => navigate('/share-your-recipe')} className="btn-primary mx-auto">
                Share your first recipe
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recipes.map(recipe => (
                <div key={recipe._id} className="card flex flex-col">
                  {recipe.image ? (
                    <img src={recipe.image} alt={recipe.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-herb-50 to-herb-100 flex items-center justify-center text-4xl">🍳</div>
                  )}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-medium text-stone-900 text-[15px] mb-1 line-clamp-1">{recipe.title}</h3>
                    <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed flex-1 mb-3">
                      {recipe.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-paprika-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {recipe.likes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {recipe.comments?.length || 0}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-stone-100">
                      <button
                        onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs text-stone-500 hover:text-herb-400 py-1.5 rounded-lg hover:bg-herb-50 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(recipe._id)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs text-stone-500 hover:text-paprika-400 py-1.5 rounded-lg hover:bg-paprika-50 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-medium text-stone-900 mb-2">Delete this recipe?</h3>
            <p className="text-sm text-stone-500 mb-5">This action cannot be undone. The recipe will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;