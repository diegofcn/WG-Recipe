import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaRegClock } from "react-icons/fa";
import { AuthContext } from '../AuthContext';

function RecipeDetail() {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, addFavorite, removeFavorite  } = useContext(AuthContext);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/recipes/${recipeId}`);
                setRecipe(response.data);
            } catch (error) {
                console.error("Failed to fetch recipe:", error);
                alert("Failed to load recipe details");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [recipeId]);

    const handleDelete = async () => {
      if (window.confirm("Are you sure you want to delete this recipe?")) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('You must be logged in to delete a recipe');
            return;
          }
    
          console.log('Deleting recipe with ID:', recipeId);
          console.log('Authorization Token:', token);
    
          await axios.delete(`http://localhost:5000/recipes/${recipeId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
    
          alert("Recipe deleted successfully");
          navigate('/'); 
        } catch (error) {
          console.error("Failed to delete recipe:", error);
          alert("Failed to delete recipe");
        }
      }
    };

    const handleFavorite = () => {
      if (user && user.favorites && user.favorites.includes(recipeId)) {
        removeFavorite(recipeId);
      } else {
        addFavorite(recipeId);
      }
    };
    

    if (loading) return <p>Loading...</p>;
    if (!recipe) return <p>No recipe found</p>;

    const isOwner = user && recipe.user === user._id;
    const isFavorite = user && user.favorites && user.favorites.includes(recipeId);
    console.log(recipe)
    console.log("fav", isFavorite)
    console.log(user)

    return (
      <div className="flex justify-center">
        <div className="hidden 2xl:block 2xl:w-1/5"></div> {/* Left empty space */}
        <div className="w-full 2xl:w-3/5 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className='lg:mt-16 mt-4 lg:col-span-1'>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl capitalize font-fancy text-blue-300 tracking-widest text-left mb-8">{recipe.title}</h1>
            { isOwner && (
            <>
              <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete Recipe
              </button>
              <Link to={`/edit-recipe/${recipeId}`} className="text-blue-500 ml-4">Edit</Link>
            </>
          )}
          <button onClick={handleFavorite} className={`bg-${isFavorite ? 'red' : 'green'}-500 hover:bg-${isFavorite ? 'red' : 'green'}-700 text-red font-bold py-2 px-4 rounded mt-4`}>
            {isFavorite ? 'Unfavorite' : 'Favorite'}
          </button>
            <div className='p-4'>
              <h2 className="text-xl font-semibold mb-2 tracking-widest mt-16 uppercase">Ingredients</h2>
              <hr className='mb-6'/>
              <div className="mb-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-start items-center space-x-24 mb-2">
                    <span className="font-semibold w-20">{ingredient.amount}</span>
                    <span className="flex-1 text-left">{ingredient.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-sky-100 p-4 rounded-lg mt-16">
            <h2 className="text-xl font-semibold tracking-widest uppercase mb-2">Macros</h2>
            <hr className='mb-8'/>
            <div className="mb-4">
              <div className="flex justify-start items-center space-x-16 mb-2"> 
                <span className="font-semibold w-32">Calories</span>
                <span className="flex-1 text-left">{recipe.macros.calories}</span>
              </div>
              <div className="flex justify-start items-center space-x-16 mb-2">
                <span className="font-semibold w-32">Carbs</span>
                <span className="flex-1 text-left">{recipe.macros.carbs}</span>
              </div>
              <div className="flex justify-start items-center space-x-16 mb-2"> 
                <span className="font-semibold w-32">Protein</span>
                <span className="flex-1 text-left">{recipe.macros.protein}</span>
              </div>
              <div className="flex justify-start items-center space-x-16 mb-2">
                <span className="font-semibold w-32">Fat</span>
                <span className="flex-1 text-left">{recipe.macros.fat}</span>
              </div>
            </div>
          </div>
          </div>
          <div className='mt-16 lg:col-span-2'>
          <div className="flex justify-end xl:justify-center mt-12 xl:mt-24">
            <p className="text-md xl:text-xl font-semibold text-amber-600 tracking-widest mb-1 flex items-center">
              <FaRegClock className="mr-2" /> Duration: {recipe.duration}
            </p>
          </div>
            <div className='flex justify-end'>
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="mb-4 w-full max-w-md mt-24 shadow-lg rounded-lg"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2 mt-8 uppercase tracking-widest">Instructions</h2>
            <hr className='mb-8'/>
            <div className="grid grid-cols-[auto_1fr] gap-2">
              {recipe.instructions.map((step, index) => (
                  <React.Fragment key={index}>
                      <div className="text-lg font-semibold text-gray-800 mb-8">
                          Step {index + 1}
                      </div>
                      <div className="text-lg text-gray-700 ms-24">
                          {step.description}
                      </div>
                  </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden 2xl:block 2xl:w-1/5"></div> {/* Right empty space */}
      </div>
    );
}

export default RecipeDetail;