import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaTrashAlt } from 'react-icons/fa';

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
  
      alert(`Recipe ${recipeId ? 'updated' : 'created'} successfully!`);
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
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mt-32 mb-4">
            <h2 className="block text-gray-700 text-xl font-bold mb-6">Create Recipe</h2>
            
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Title
                </label>
                <input type="text" name="title" id="title" value={recipe.title} onChange={handleInputChange}
                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                  Category
              </label>
              <select 
                  name="category" 
                  id="category" 
                  value={recipe.category} 
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
                    Duration
                </label>
                <input type="text" name="duration" id="duration" value={recipe.duration} onChange={handleInputChange}
                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imageUrl">
                    Image URL
                </label>
                <input type="text" name="imageUrl" id="imageUrl" value={recipe.imageUrl} onChange={handleInputChange}
                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="mb-4">
          <h3 className="block text-gray-700 text-sm font-bold mb-2">Tags</h3>
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={handleTagInput}
              placeholder="Enter a tag"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <button
              type="button"
              onClick={addTag}
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap mt-2">
            {recipe.tags.map((tag, index) => (
              <div key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
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

            <div className="mb-4">
              <h3 className="block text-gray-700 text-sm font-bold mb-2">Instructions</h3>
              {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="mb-2">
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={`instruction-${index}`}>
                          Step {index + 1}
                      </label>
                      <textarea
                          id={`instruction-${index}`}
                          name="description"
                          rows={3}
                          value={instruction.description}
                          onChange={e => handleInstructionChange(index, e)}
                          placeholder="Describe this step"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <button type="button" onClick={() => removeInstruction(index)}
                          className="text-red-500 hover:text-red-700 text-sm py-1 px-2 mt-1">
                          Remove Step
                      </button>
                  </div>
              ))}
              <button type="button" onClick={addInstruction}
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Add New Step
              </button>
            </div>

            <div className="mb-4">
                <h3 className="block text-gray-700 text-sm font-bold mb-2">Ingredients</h3>
                {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="mb-2">
                      <input type="text" placeholder="Name" name="name"
                               value={ingredient.name}
                               onChange={event => handleIngredientChange(index, event)}
                               className="shadow appearance-none border rounded py-2 px-3 text-gray-700 mr-2 w-full md:w-auto"/>
                        <input type="text" placeholder="Amount" name="amount"
                               value={ingredient.amount}
                               onChange={event => handleIngredientChange(index, event)}
                               className="shadow appearance-none border rounded py-2 px-3 text-gray-700 mr-2 w-full md:w-auto"/>
                        
                    </div>
                ))}
                <button type="button" onClick={addIngredient}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Add Ingredient
                </button>
            </div>

            <div className="mb-6">
    <h3 className="block text-gray-700 text-md font-bold mb-2">Macros</h3>
    <div className="mb-2">
        <label htmlFor="calories" className="block text-gray-700 text-sm font-bold mb-1">
            Calories
        </label>
        <input type="text" id="calories" name="calories" placeholder="Calories" 
               value={recipe.macros.calories} onChange={handleMacroChange}
               className="shadow appearance-none border rounded w-50 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
    </div>
    <div className="mb-2">
        <label htmlFor="carbs" className="block text-gray-700 text-sm font-bold mb-1">
            Carbs
        </label>
        <input type="text" id="carbs" name="carbs" placeholder="Carbs"
               value={recipe.macros.carbs} onChange={handleMacroChange}
               className="shadow appearance-none border rounded w-50 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
    </div>
    <div className="mb-2">
        <label htmlFor="protein" className="block text-gray-700 text-sm font-bold mb-1">
            Protein
        </label>
        <input type="text" id="protein" name="protein" placeholder="Protein"
               value={recipe.macros.protein} onChange={handleMacroChange}
               className="shadow appearance-none border rounded w-50 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
    </div>
    <div className="mb-2">
        <label htmlFor="fat" className="block text-gray-700 text-sm font-bold mb-1">
            Fat
        </label>
        <input type="text" id="fat" name="fat" placeholder="Fat"
               value={recipe.macros.fat} onChange={handleMacroChange}
               className="shadow appearance-none border rounded w-50 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
    </div>
</div>



            <div className="flex items-center justify-between">
                <button type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Submit
                </button>
            </div>
        </form>
    </div>
);
}

export default CreateRecipe;
