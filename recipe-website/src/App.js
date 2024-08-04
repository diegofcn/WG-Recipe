import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {

  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navbar />} />
        </Routes>
        <Routes>
        <Route path="/api/auth/register" element={<Register />} />
        <Route path="/api/auth/login" element={<Login />} />
        {isAuthenticated && <Route path="/create" element={<CreateRecipe />} />}
        {isAuthenticated && <Route path="/favorites" element={<Favorites />} />}
        <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/category/:categoryName" element={<RecipesList />} />
          <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
          {isAuthenticated && <Route path="/edit-recipe/:recipeId" element={<CreateRecipe />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
