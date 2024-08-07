import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import RecipeCard from './RecipeCard';

function RecipesList() {
  const { categoryName } = useParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, addFavorite, removeFavorite } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/recipes/category/${categoryName}`);
        setRecipes(response.data);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
        alert("Failed to load recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [categoryName]);

  const handleFavorite = (recipeId) => {
    if (user && user.favorites && user.favorites.includes(recipeId)) {
      removeFavorite(recipeId);
    } else {
      addFavorite(recipeId);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className='flex justify-center'>
      <div className="p-16 xl:w-2/3">
        <h2 className="text-2xl lg:text-6xl font-bold font-cormorant text-center capitalize mb-16 mt-8">{categoryName} Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {recipes.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} user={user} handleFavorite={handleFavorite} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecipesList;
