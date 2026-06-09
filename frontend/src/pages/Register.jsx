import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', image: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5242880) { setError('Image must be under 5MB.'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('https://cookingcollab.onrender.com/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.image,
      });
      if (res.status === 201) {
        setIsLoggedIn && setIsLoggedIn(false);
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = () => showPassword
    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🍳</div>
          <h1 className="text-2xl font-medium text-stone-900">Join CookingCollab</h1>
          <p className="text-stone-500 text-sm mt-1">Create your free account and start sharing</p>
        </div>

        <div className="card p-6">
          {error && (
            <div className="alert-error mb-4">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar preview + upload */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {preview
                  ? <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  : <svg className="w-6 h-6 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                }
              </div>
              <div>
                <label className="input-label">Profile photo <span className="text-stone-400 font-normal">(optional)</span></label>
                <input type="file" accept="image/*" onChange={handleImageChange}
                  className="text-xs text-stone-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-stone-100 file:text-stone-600 hover:file:bg-stone-200 cursor-pointer" />
              </div>
            </div>

            <div>
              <label className="input-label">Full name</label>
              <input type="text" name="name" className="input-field" placeholder="Ankur Dwivedi"
                value={formData.name} onChange={handleChange} required autoComplete="name" />
            </div>

            <div>
              <label className="input-label">Email address</label>
              <input type="email" name="email" className="input-field" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required autoComplete="email" />
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password"
                  className="input-field pr-10" placeholder="At least 8 characters"
                  value={formData.password} onChange={handleChange} required autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  <EyeIcon />
                </button>
              </div>
            </div>

            <div>
              <label className="input-label">Confirm password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="confirmPassword"
                  className="input-field pr-10" placeholder="Repeat your password"
                  value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  <EyeIcon />
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 mt-2">
              {loading
                ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Creating account...</>
                : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-herb-400 hover:text-herb-600 no-underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;