import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Log the login attempt
      console.log('Attempting login with email:', formData.email);

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Log successful response
      console.log('Login response:', response.status);

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsLoggedIn(true);
        navigate('/dashboard');
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      // Detailed error logging
      console.error('Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 401) {
        setError('Email or password is incorrect');
      } else if (error.response?.status === 400) {
        setError(error.response.data.message || 'Invalid input');
      } else {
        setError('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}
      <div className="row justify-content-center">
        <div className='col-md-6'>
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className='form-label'>Email Address</label>
                  <input
                    type="email"
                    className='form-control'
                    id='email'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className='form-label'>Password</label>
                  <input
                    type="password"
                    className='form-control'
                    id='password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-outline-danger"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </div>
                <div className="mt-3 text-center">
                  <p>
                    Don't have an account? <Link to="/register">Register</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
