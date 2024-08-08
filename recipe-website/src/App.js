import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Home from './components/Home';
import RecipesList from './components/RecipesList';
import RecipeDetail from './components/RecipeDetail';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import CreateRecipe from './components/CreateRecipe';
import { AuthContext } from './AuthContext';
import Favorites from './components/Favorites';
import ShoppingList from './components/ShoppingList';
import SearchRecipes from './components/SearchRecipes';

function App() {

  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div className="App">
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api/auth/register" element={<Register />} />
        <Route path="/api/auth/login" element={<Login />} />
        {isAuthenticated && <Route path="/create" element={<CreateRecipe />} />}
        {isAuthenticated && <Route path="/favorites" element={<Favorites />} />}
        <Route path="/shopping-list" element={<ShoppingList />} />
        <Route path="/category/:categoryName" element={<RecipesList />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
        <Route path="/search" element={<SearchRecipes />} />
        {isAuthenticated && <Route path="/edit-recipe/:recipeId" element={<CreateRecipe />} />}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
