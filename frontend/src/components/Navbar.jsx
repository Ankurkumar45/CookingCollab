import React from 'react';

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-danger bg-gradient">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <a className="navbar-brand" href="/">CookginCollabe</a>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Contact Us</a>
              </li>
            </ul>
            <a class="link-light bg-success p-2" href="/login">Login </a>/<a class="link-light bg-info p-2" href="/register"> Register</a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
