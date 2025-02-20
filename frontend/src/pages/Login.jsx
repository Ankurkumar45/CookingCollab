import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const passwordToggle = () => {
    setShowPassword(!showPassword);
  }

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/login", { email, password })
      localStorage.setItem('username', res.data.username);
      setIsLoggedIn(true);
      navigate('/home')
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  }

  return (
    <>
      <div className="main-container mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className='col-md-6'>
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title text-center mb-4">Login</h2>
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg>
                      <div>
                        Invalid Credentials
                      </div>
                    </div>
                  )}
                  <form action="">
                    <div className="mb-3">
                      <label htmlFor="email" className='form-label'>
                        Email Address
                      </label>
                      <input type="email"
                        className='form-control'
                        id='email'
                        name='email'
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className='form-label'>
                        Password
                      </label>
                      <div className="password-input input-group">
                        <input type={showPassword ? 'text' : 'password'}
                          className='form-control'
                          id='password'
                          name='password'
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />

                        <button
                          type='button'
                          className='password-mode'
                          onClick={passwordToggle}
                        >
                          {!showPassword ? <i class="bi bi-eye"></i> : <i class="bi bi-eye-slash"></i>}
                        </button>
                      </div>
                    </div>
                    <div className="d-grid">
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleLogin}
                      >
                        Login
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
      </div>
    </>
  );
}

export default Login;
