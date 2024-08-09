import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

function CreateRecipe() {
  const { recipeId } = useParams();  // This will be undefined if creating a new recipe
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: "",
    category: "",
    duration: "",
    imageUrl: "",
    ingredients: [],
    instructions: [],
    macros: {
      calories: "",
      carbs: "",
      protein: "",
      fat: "",
    },
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (recipeId) {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}/recipes/${recipeId}`)
            .then(response => {
                setRecipe(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch recipe:', error);
                alert('Error loading recipe data');
            })
            .finally(() => setLoading(false));
    }
}, [recipeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = () => {
    setRecipe({
      ...recipe,
      tags: [...recipe.tags, tagInput]
    });
    setTagInput("");
  };

  const removeTag = (tag) => {
    setRecipe({
      ...recipe,
      tags: recipe.tags.filter(t => t !== tag)
    });
  };

  const handleIngredientChange = (index, event) => {
    const newIngredients = recipe.ingredients.map((ingredient, i) => {
      if (index !== i) return ingredient;
      return { ...ingredient, [event.target.name]: event.target.value };
    });
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [...recipe.ingredients, { amount: "", name: "" }],
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const handleInstructionChange = (index, event) => {
    const newInstructions = recipe.instructions.map((instruction, i) => {
        if (i === index) {
            return { ...instruction, description: event.target.value };
        }
        return instruction;
    });
    setRecipe({ ...recipe, instructions: newInstructions });
};

const addInstruction = () => {
    setRecipe({
        ...recipe,
        instructions: [...recipe.instructions, { description: "" }]
    });
};

const removeInstruction = index => {
    const newInstructions = recipe.instructions.filter((_, i) => i !== index);
    setRecipe({ ...recipe, instructions: newInstructions });
};

  const handleMacroChange = (e) => {
    const { name, value } = e.target;
    setRecipe({
      ...recipe,
      macros: { ...recipe.macros, [name]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = recipeId ? 'patch' : 'post';
    const url = recipeId ? `${process.env.REACT_APP_API_URL}/recipes/${recipeId}` : `${process.env.REACT_APP_API_URL}/recipes`;
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to create or update a recipe');
        return;
      }
  
      // Log the method, URL, and recipe data being submitted
      console.log("Request Method:", method);
      console.log("Request URL:", url);
      console.log("Recipe Data:", recipe);
  
      const response = await axios({
        method: method,
        url: url,
        data: recipe,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      // Log the response from the server
      console.log("Response Data:", response.data);
  
      toast.success(`Recipe ${recipeId ? 'updated' : 'created'} successfully!`);
      navigate(`/recipe/${response.data._id}`);
    } catch (error) {
      // Log the error details
      console.error("Error Status:", error.response ? error.response.status : "No status");
      console.error("Error Data:", error.response ? error.response.data : "No response data");
      console.error("Error Headers:", error.response ? error.response.headers : "No response headers");
      console.error("Error Message:", error.message);
  
      alert(`Failed to ${recipeId ? 'update' : 'create'} recipe`);
    }
  };
  
  

if (loading) return <p>Loading...</p>;


return (
  <div className="max-w-4xl mx-auto p-5">
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 mt-20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Recipe</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={recipe.title}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="category">Category</label>
        <select
          name="category"
          id="category"
          value={recipe.category}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
        >
          <option value="">Select a category</option>
          <option value="breakfast">Breakfast</option>
          <option value="dinner">Dinner</option>
          <option value="dessert">Dessert</option>
          <option value="dips">Dips</option>
          <option value="snacks">Snacks</option>
          <option value="cocktails">Cocktails</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="duration">Duration</label>
        <input
          type="text"
          name="duration"
          id="duration"
          value={recipe.duration}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          name="imageUrl"
          id="imageUrl"
          value={recipe.imageUrl}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <h3 className="block text-gray-700 text-sm font-semibold mb-2">Tags</h3>
        <div className="flex items-center">
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInput}
            placeholder="Enter a tag"
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <button
            type="button"
            onClick={addTag}
            className="ml-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap mt-4">
          {recipe.tags.map((tag, index) => (
            <div key={index} className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="block text-gray-700 text-sm font-semibold mb-2">Instructions</h3>
        {recipe.instructions.map((instruction, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-1" htmlFor={`instruction-${index}`}>
              Step {index + 1}
            </label>
            <textarea
              id={`instruction-${index}`}
              name="description"
              rows={3}
              value={instruction.description}
              onChange={e => handleInstructionChange(index, e)}
              placeholder="Describe this step"
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeInstruction(index)}
              className="text-red-500 hover:text-red-700 text-sm mt-2"
            >
              Remove Step
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          className="mt-4 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Step
        </button>
      </div>

      <div className="mb-6">
          <h3 className="block text-gray-700 text-sm font-semibold mb-2">Ingredients</h3>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={ingredient.name}
                onChange={event => handleIngredientChange(index, event)}
                className="flex-grow px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none mr-2"
              />
              <input
                type="text"
                placeholder="Amount"
                name="amount"
                value={ingredient.amount}
                onChange={event => handleIngredientChange(index, event)}
                className="flex-grow px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none mr-2"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-red-500 hover:text-red-700 text-sm mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-4 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Ingredient
          </button>
        </div>

      <div className="mb-6">
        <h3 className="block text-gray-700 text-md font-semibold mb-2">Macros</h3>
        <div className="mb-4">
          <label htmlFor="calories" className="block text-gray-700 text-sm font-semibold mb-1">Calories</label>
          <input
            type="text"
            id="calories"
            name="calories"
            placeholder="Calories"
            value={recipe.macros.calories}
            onChange={handleMacroChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="carbs" className="block text-gray-700 text-sm font-semibold mb-1">Carbs</label>
          <input
            type="text"
            id="carbs"
            name="carbs"
            placeholder="Carbs"
            value={recipe.macros.carbs}
            onChange={handleMacroChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="protein" className="block text-gray-700 text-sm font-semibold mb-1">Protein</label>
          <input
            type="text"
            id="protein"
            name="protein"
            placeholder="Protein"
            value={recipe.macros.protein}
            onChange={handleMacroChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fat" className="block text-gray-700 text-sm font-semibold mb-1">Fat</label>
          <input
            type="text"
            id="fat"
            name="fat"
            placeholder="Fat"
            value={recipe.macros.fat}
            onChange={handleMacroChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
);
}

export default CreateRecipe;
