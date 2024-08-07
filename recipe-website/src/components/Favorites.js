import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import RecipeCard from './RecipeCard';
import { FaHeart } from 'react-icons/fa';

const Favorites = () => {
  const { user, removeFavorite } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/favorites`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(response.data);
      } catch (error) {
        console.error('Failed to fetch favorite recipes:', error);
      }
    };

    fetchFavorites();
  }, []);

  if (!user) return <p>Please log in to view your favorite recipes.</p>;

  const handleUnfavorite = (recipeId) => {
    removeFavorite(recipeId);
    setFavorites(favorites.filter(recipe => recipe._id !== recipeId));
  };

  return (
    <div className="flex justify-center">
      <div className="p-16 w-full 2xl:w-2/3">
        <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold font-cormorant text-center capitalize mb-16 mt-24">Favorite Recipes</h2>
        {favorites.length === 0 ? (
          <p className="text-center text-xl text-gray-600 mt-16">You have no favorite recipes yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {favorites.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} user={user} handleFavorite={handleUnfavorite} />
          ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
