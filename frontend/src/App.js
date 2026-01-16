import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
// import Forms from './components/Forms';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Protected from './components/Protected';
import Register from './pages/Register';
import ShareRecipe from './pages/ShareRecipe';
import Dashboard from './components/Dashboard';
import About from './pages/About';
import Recipes from './pages/Recipes';
import Contact from './pages/Contact';
import EditRecipie from './pages/EditRecipie';


function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('username');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/register' element={<Register setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/share-your-recipe' element={<ShareRecipe setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/home' element={<Home />} />
        <Route path='/dashboard' element={
          <Protected>
            <Dashboard />
          </Protected>
        } />
        <Route path='/about' element={<About />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/edit-recipe/:id" element={<EditRecipie />} />
      </Routes>
    </Router>
  );
}

export default App;
