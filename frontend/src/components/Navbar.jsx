import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Recipes', href: '/recipes' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    setIsLoggedIn && setIsLoggedIn(false);
    navigate('/login');
  };

  const isActive = (href) =>
    href === '/'
      ? location.pathname === '/' || location.pathname === '/home'
      : location.pathname.startsWith(href);

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-herb-400 font-semibold text-base no-underline">
            <span className="text-xl">🍳</span>
            CookingCollab
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className={isActive(href) ? 'nav-link-active no-underline' : 'nav-link no-underline'}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" className="btn-ghost no-underline">
                  Dashboard
                </Link>
                <Link to="/share-your-recipe" className="btn-primary no-underline">
                  + Share Recipe
                </Link>
                <button onClick={logout} className="btn-ghost text-stone-500">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost no-underline text-stone-600">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary no-underline">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-100 py-3 flex flex-col gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                to={href}
                className="block px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg no-underline"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-stone-100 mt-2 pt-2 flex flex-col gap-1">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="block px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg no-underline" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link to="/share-your-recipe" className="block px-3 py-2 text-sm text-herb-400 font-medium hover:bg-herb-50 rounded-lg no-underline" onClick={() => setMenuOpen(false)}>+ Share Recipe</Link>
                  <button onClick={logout} className="text-left px-3 py-2 text-sm text-stone-500 hover:bg-stone-50 rounded-lg">Sign out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 rounded-lg no-underline" onClick={() => setMenuOpen(false)}>Sign in</Link>
                  <Link to="/register" className="block px-3 py-2 text-sm text-herb-400 font-medium hover:bg-herb-50 rounded-lg no-underline" onClick={() => setMenuOpen(false)}>Get started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;