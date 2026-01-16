import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const navLists = ['Home', 'About', 'Recipes', 'Contact'];

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-danger bg-gradient">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-around" id="navbarTogglerDemo01">
            <a className="navbar-brand" href="/">CookingCollab</a>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navLists.map((item, index) => (
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href={`/${item.toLowerCase()}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            {
              isLoggedIn ? (
                <div>
                  <a className="btn btn-outline-light me-2" href="/dashboard" role="button">Dashboard</a>
                  <button
                    className="btn btn-outline-light"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <a className="btn btn-outline-light me-2" href="/login" role="button">Login</a>
                  <a className="btn btn-outline-light" href="/register" role="button" onClick={logout}>Register</a>
                </div>
              )
            }
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
