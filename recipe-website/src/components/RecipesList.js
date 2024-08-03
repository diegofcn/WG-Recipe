import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

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
        <h2 className="text-2xl lg:text-6xl font-bold font-cormorant text-center capitalize mb-16 mt-24">{categoryName} Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {recipes.map(recipe => (
            <div key={recipe._id} className="relative flex flex-row bg-white shadow-lg rounded-lg overflow-hidden hover:bg-gray-200 transition-colors duration-200 ease-in-out">
              <Link to={`/recipe/${recipe._id}`} className="w-full flex flex-row">
                <img src={recipe.imageUrl} alt={recipe.title} className="w-1/3 md:w-1/2 lg:w-1/3 object-cover"/>
                <div className="p-16 md:p-4 lg:p-16 flex flex-col justify-center w-2/3">
                  <h3 className="text-sm md:text-md lg:text-lg capitalize font-semibold">{recipe.title}</h3>
                  <p className="text-sm md:text-md lg:text-lg text-gray-600">{recipe.duration}</p>
                </div>
              </Link>
              {user && (
                <button
                  onClick={() => handleFavorite(recipe._id)}
                  className="absolute top-4 right-4 text-2xl text-slate-300"
                >
                  {user.favorites && user.favorites.includes(recipe._id) ? <FaHeart /> : <FaRegHeart />}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecipesList;
