import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaRegClock, FaHeart, FaRegHeart, FaTrash, FaEdit } from "react-icons/fa";
import { AuthContext } from '../AuthContext';
import { ShoppingListContext } from '../ShoppingListContext';

function RecipeDetail() {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, addFavorite, removeFavorite  } = useContext(AuthContext);
    const { addToShoppingList, removeFromShoppingList, shoppingList } = useContext(ShoppingListContext);
    const [clickedIngredients, setClickedIngredients] = useState(() => {
      const savedClickedIngredients = localStorage.getItem(`clickedIngredients_${recipeId}`);
      return savedClickedIngredients ? JSON.parse(savedClickedIngredients) : [];
    });

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/recipes/${recipeId}`);
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

    useEffect(() => {
      localStorage.setItem(`clickedIngredients_${recipeId}`, JSON.stringify(clickedIngredients));
    }, [clickedIngredients, recipeId]);

    useEffect(() => {
      // Update clickedIngredients based on the current shopping list
      const savedClickedIngredients = shoppingList
        .filter(item => item.recipeId === recipeId)
        .map(item => item.name);
      setClickedIngredients(savedClickedIngredients);
    }, [shoppingList, recipeId]);

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
    
          await axios.delete(`${process.env.REACT_APP_API_URL}/recipes/${recipeId}`, {
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

    const handleIngredientClick = (ingredient) => {
      const ingredientWithRecipeId = { ...ingredient, recipeId };
      setClickedIngredients((prev) => {
        if (prev.includes(ingredient.name)) {
          removeFromShoppingList(ingredientWithRecipeId);
          return prev.filter(item => item !== ingredient.name);
        } else {
          addToShoppingList(ingredientWithRecipeId, recipe.title);
          return [...prev, ingredient.name];
        }
      });
    };
  
    

    if (loading) return <p>Loading...</p>;
    if (!recipe) return <p>No recipe found</p>;

    const isOwner = user && recipe.user === user._id;
    const isFavorite = user && user.favorites && user.favorites.includes(recipeId);

    return (
      <div className="flex justify-center">
        <div className="hidden 2xl:block 2xl:w-1/5"></div> {/* Left empty space */}
        <div className="w-full 2xl:w-3/5 p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className='lg:mt-16 mt-4 lg:col-span-1'>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl capitalize font-fancy text-blue-300 tracking-widest text-left mb-8">{recipe.title}</h1>
            <div className='flex ps-10 mt-12'>
            { isOwner && (
            <>
              <button onClick={handleDelete} className='w-12'>
              <FaTrash className='cursor-pointer text-slate-600 text-xl'/>
              </button>
              <button className='w-12'>
              <Link to={`/edit-recipe/${recipeId}`} className='text-slate-600 text-xl'><FaEdit /></Link>
              </button>
            </>
          )}
          <button onClick={handleFavorite} className='w-12'>
            {isFavorite ? <FaHeart className='text-red-600 text-xl' /> : <FaRegHeart className='text-slate-600 text-xl'/>}
          </button>
          </div>
            <div className='p-4'>
              <h2 className="text-xl font-semibold mb-2 tracking-widest mt-16 uppercase">Ingredients</h2>
              <hr className='mb-6'/>
              <div className="mb-4">
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`flex justify-start items-center space-x-24 mb-2 p-2 rounded cursor-pointer ${clickedIngredients.includes(ingredient.name) ? 'bg-gray-200 line-through' : 'hover:bg-gray-100'}`}
                  onClick={() => handleIngredientClick(ingredient)}
                >
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