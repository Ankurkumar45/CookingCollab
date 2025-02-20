import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        image: reader.result
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (existingUsers.some(user => user.email === formData.email)) {
      setError('Email already registered!');
      return;
    }

    // Add new user
    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      image: formData.image
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    setIsLoggedIn(true);
    navigate('/home');
  };

  const passwordToggle = () => {
    setShowPassword(!showPassword);
  }

  return (
    <>
      <div className="container mt-5">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}
        <div className="registration-form row justify-content-center">
          <div className='col-md-6'>
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Register</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className='form-label'>
                      Your Full Name
                    </label>
                    <input type="text"
                      className='form-control'
                      id='name'
                      name='name'
                      required
                      onChange={handleChange}
                      value={formData.name} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className='form-label'>
                      Email Address
                    </label>
                    <input type="email"
                      className='form-control'
                      id='email'
                      name='email'
                      required
                      onChange={handleChange}
                      value={formData.email} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className='form-label'>
                      Set Password
                    </label>
                    <div className="password-input input-group">
                      <input type={showPassword ? 'text' : 'password'}
                        className='form-control'
                        id='password'
                        name='password'
                        required
                        onChange={handleChange}
                        value={formData.password} />

                      <button
                        type='button'
                        className='password-mode'
                        onClick={passwordToggle}
                      >
                        {!showPassword ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirm-password" className='form-label'>
                      Confirm Password
                    </label>
                    <div className="password-input input-group">
                      <input type={showPassword ? 'text' : 'password'}
                        className='form-control'
                        id='confirm-password'
                        name='confirmPassword'
                        required
                        onChange={handleChange}
                        value={formData.confirmPassword} />

                      <button
                        type='button'
                        className='password-mode'
                        onClick={passwordToggle}
                      >
                        {!showPassword ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="image" className='form-label'>
                      Your Image
                    </label>
                    <div className="password-input input-group">
                      <input type='file'
                        className='form-control'
                        id='image'
                        name='image'
                        onChange={handleImageChange} />
                    </div>
                  </div>
                  <div className="d-grid">
                    <button className="btn btn-outline-danger">
                      Register
                    </button>
                  </div>
                  <div className="mt-3 text-center">
                    <p>
                      Already have an account? <Link to="/login">Login</Link>
                    </p>
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

export default Register;
