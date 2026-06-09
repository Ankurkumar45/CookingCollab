import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import './App.css';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ShareRecipe from './pages/ShareRecipe';
import Dashboard from './components/Dashboard';
import Recipes from './pages/Recipes';
import Protected from './components/Protected';
import About from './pages/About';
import Contact from './pages/Contact';
import EditRecipie from './pages/EditRecipie';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/share-your-recipe" element={<ShareRecipe />} />
        <Route path="/dashboard" element={
          <Protected><Dashboard /></Protected>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/edit-recipe/:id" element={<EditRecipie />} />
      </Routes>
    </Router>
  );
}

export default App;