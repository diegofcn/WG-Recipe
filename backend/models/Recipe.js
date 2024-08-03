const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Ingredient subdocument schema
const ingredientSchema = new Schema({
  amount: { type: String, required: true },
  name: { type: String, required: true }
});

const instructionSchema = new Schema({
    stepNumber: { type: Number, required: false },
    description: { type: String, required: true }
});

// Macros subdocument schema
const macrosSchema = new Schema({
  calories: { type: String, required: false },
  carbs: { type: String, required: false },
  protein: { type: String, required: false },
  fat: { type: String, required: false }
});

// Main Recipe Schema
const recipeSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  duration: { type: String, required: true },
  imageUrl: { type: String, required: false },
  ingredients: [ingredientSchema],
  instructions: [instructionSchema],
  macros: macrosSchema,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
