import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function RecipeCard({ recipe, user, handleFavorite, handleDelete, handleEdit }) {
    const isFavorite = user && user.favorites && user.favorites.includes(recipe._id);
  
    return (
        <div className="relative bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-shadow duration-300">
          <Link to={`/recipe/${recipe._id}`} className="flex flex-col h-full">
            <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-48 2xl:h-64 object-cover" />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-2xl font-semibold mb-2 capitalize">{recipe.title}</h3>
              <p className="text-gray-600 mb-4">{recipe.duration}</p>
              <div className="flex flex-wrap mt-2">
                {recipe.tags && recipe.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
          <div className="absolute top-2 right-2 flex space-x-2">
            
          <button
          onClick={() => handleFavorite(recipe._id)}
          className="bg-gray-800 bg-opacity-60 hover:bg-opacity-80 rounded-full p-2 text-slate-200 hover:text-red-500 transition-colors duration-200"
        >
          {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </button>
          </div>
        </div>
      );
};

export default RecipeCard;
