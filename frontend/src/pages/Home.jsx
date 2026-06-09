import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Vegetarian', 'Quick & Easy', 'Desserts', 'Indian', 'Italian', 'Asian'];

const FEATURED = [
  { emoji: '🥗', title: 'Green goddess salad', time: '15 min', servings: 2, tags: ['Vegan', 'Quick'], gradient: 'from-herb-100 to-herb-400' },
  { emoji: '🍝', title: 'Cacio e pepe', time: '25 min', servings: 4, tags: ['Italian'], gradient: 'from-saffron-200 to-saffron-400' },
  { emoji: '🍜', title: 'Miso ramen bowl', time: '40 min', servings: 2, tags: ['Asian', 'Quick'], gradient: 'from-blue-100 to-blue-400' },
  { emoji: '🍛', title: 'Butter chicken', time: '50 min', servings: 4, tags: ['Indian', 'Spicy'], gradient: 'from-paprika-200 to-paprika-400' },
  { emoji: '🎂', title: 'Lemon drizzle cake', time: '60 min', servings: 8, tags: ['Dessert'], gradient: 'from-saffron-50 to-saffron-200' },
  { emoji: '🫕', title: 'Chickpea tagine', time: '35 min', servings: 4, tags: ['Vegan', 'Moroccan'], gradient: 'from-herb-50 to-herb-100' },
];

const TagBadge = ({ tag }) => {
  const colors = {
    Vegan: 'tag-green', Quick: 'tag-stone', 'Quick & Easy': 'tag-stone',
    Italian: 'tag-amber', Asian: 'tag-stone', Spicy: 'tag-red',
    Indian: 'tag-amber', Dessert: 'tag-amber', Moroccan: 'tag-green',
  };
  return <span className={`tag ${colors[tag] || 'tag-stone'}`}>{tag}</span>;
};

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  const handleShare = () => {
    const user = localStorage.getItem('username') || localStorage.getItem('token');
    navigate(user ? '/share-your-recipe' : '/login');
  };

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Hero */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="tag tag-green mb-4 inline-flex">🌿 Community recipes</span>
            <h1 className="text-4xl md:text-5xl font-medium text-stone-900 leading-tight mb-4">
              Cook together,<br />
              <span className="text-herb-400">share everything</span>
            </h1>
            <p className="text-stone-500 text-lg mb-8 leading-relaxed">
              Discover recipes from home cooks around the world. Like, comment, and share your own creations with the community.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleShare} className="btn-primary text-base px-6 py-2.5">
                Share a recipe
              </button>
              <Link to="/recipes" className="btn-outline text-base px-6 py-2.5 no-underline">
                Browse recipes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <section className="bg-white border-b border-stone-200 sticky top-14 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors flex-shrink-0 ${activeCategory === cat
                    ? 'bg-herb-400 text-white font-medium'
                    : 'text-stone-500 hover:bg-stone-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured recipes grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-stone-900">Featured recipes</h2>
          <Link to="/recipes" className="text-sm text-herb-400 hover:text-herb-600 no-underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED.map((recipe, i) => (
            <div key={i} className="recipe-card cursor-pointer">
              <div className={`h-40 bg-gradient-to-br ${recipe.gradient} flex items-center justify-center`}>
                <span className="text-5xl">{recipe.emoji}</span>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-stone-900 text-[15px] mb-2">{recipe.title}</h3>
                <div className="flex items-center gap-3 text-xs text-stone-400 mb-3">
                  <span>⏱ {recipe.time}</span>
                  <span>👥 {recipe.servings} servings</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.tags.map(t => <TagBadge key={t} tag={t} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-herb-400 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-medium text-white mb-2">Have a recipe to share?</h2>
            <p className="text-herb-100 text-sm">Join hundreds of home cooks contributing to the community.</p>
          </div>
          <button
            onClick={handleShare}
            className="bg-white text-herb-400 font-medium px-6 py-2.5 rounded-xl hover:bg-herb-50 transition-colors flex-shrink-0"
          >
            Share your recipe
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;