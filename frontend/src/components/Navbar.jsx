import React from 'react';

const Navbar = () => {

  const navLists = ['Home', 'About', 'Recipes', 'Contact'];

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-danger bg-gradient">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-around" id="navbarTogglerDemo01">
            <a className="navbar-brand" href="/">CookginCollabe</a>
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navLists.map((item, index) => (
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href={`# ${item.toLowerCase()}`}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="/login"
              class="link-warning link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
            >
              Login
            </a>
            <span class="link-warning link-offset-2 link-underline-opacity-25">/</span>
            <a href="/register" class="link-warning link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">
              Register
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
