const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./auth');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const Recipe = require('./models/Recipe');
const User = require('./models/User');
const app = express();
const PORT = process.env.PORT || 5000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello from Recipe App Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post('/recipes', auth, async (req, res) => {
    const recipe = new Recipe({ ...req.body, user: req.user.id });
  
    if (recipe.instructions && recipe.instructions.length) {
      recipe.instructions.forEach((instruction, index) => {
        instruction.stepNumber = index + 1;
      });
    }
  
    try {
      await recipe.save();
      res.status(201).send(recipe);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  app.get('/recipes/search', async (req, res) => {
    const { title, tags } = req.query;
    let query = {};
  
    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Case insensitive search
    }
  
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }
  
    try {
      const recipes = await Recipe.find(query);
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching recipes', error });
    }
  });

  // Endpoint to fetch all available tags
app.get('/tags', async (req, res) => {
  try {
    const tags = await Recipe.distinct('tags');
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tags', error });
  }
});

app.get('/recipes', async (req, res) => {
    try {
      const recipes = await Recipe.find();
      res.status(200).json(recipes);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
});

app.get('/recipes/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const recipe = await Recipe.findById(id);
      if (!recipe) return res.status(404).send("No recipe found.");
      res.status(200).json(recipe);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
});

app.patch('/recipes/:id', auth, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  console.log("Patch Request ID:", id);
  console.log("Update Data:", updateData);

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      console.log("Recipe not found");
      return res.status(404).send('Recipe not found');
    }

    if ((!recipe.user || recipe.user.toString() !== req.user.id) && req.user.role !== 'admin') {
      console.log("User not authorized");
      return res.status(403).send('User not authorized');
  }

    if (updateData.instructions && updateData.instructions.length) {
      updateData.instructions.forEach((instruction, index) => {
        instruction.stepNumber = index + 1;
      });
    }

    // If recipe.user is missing, set it to the admin's ID
    if (!recipe.user && req.user.role === 'admin') {
      recipe.user = req.user.id;
  }

    Object.assign(recipe, updateData);
    await recipe.save();

    console.log("Updated Recipe:", recipe);

    res.send(recipe);
  } catch (error) {
    console.error("Error saving recipe:", error.message);
    res.status(400).send({ message: error.message });
  }
});


  app.delete('/recipes/:id', auth, async (req, res) => {
    const { id } = req.params;
    console.log('Deleting recipe with ID:', id);
    console.log('Request headers:', req.headers);
  
    try {
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        console.log('Recipe not found');
        return res.status(404).send("No recipe found.");
      }
  
      if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
        console.log('User not authorized');
        return res.status(403).send('User not authorized');
      }
  
      await Recipe.deleteOne({ _id: id });
      console.log('Recipe successfully deleted');
      res.status(200).json({ message: 'Recipe successfully deleted' });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      res.status(400).json({ message: error.message });
    }
  });
  

app.get('/recipes/category/:categoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const recipes = await Recipe.find({ category: categoryName });
        if (!recipes.length) {
            return res.status(404).json({ message: 'No recipes found in this category' });
        }
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error });
    }
});
  
  

app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received Registration Data:", req.body);

  try {
    // Check if the username or email is already in use
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return res.status(400).send('Username or email already in use');
    }
    
      // Hash the password and create the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      res.status(201).send({ message: 'User registered' });
  } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).send('Error registering user');
  }
});



  
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send('User not found');
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).send('Invalid password');
  
      const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token, userId: user._id });
    } catch (error) {
      res.status(400).send('Error logging in');
    }
  });

  app.get('/api/auth/me', async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json({ user });
    } catch (err) {
      res.status(401).send('Token is not valid');
    }
  });

  // Add a recipe to favorites
app.post('/api/favorites/:recipeId', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user.favorites.includes(req.params.recipeId)) {
        user.favorites.push(req.params.recipeId);
        await user.save();
      }
      res.status(200).json(user.favorites);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Remove a recipe from favorites
app.delete('/api/favorites/:recipeId', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      user.favorites = user.favorites.filter(fav => fav.toString() !== req.params.recipeId);
      await user.save();
      res.status(200).json(user.favorites);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  // Get favorite recipes
app.get('/api/favorites', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate('favorites');
      res.status(200).json(user.favorites);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// New endpoint for image uploads
app.post('/api/upload', auth, async (req, res) => {
  try {
    const { data } = req.body;
    const uploadResponse = await cloudinary.uploader.upload(data, {
      upload_preset: 'ml_default'
    });
    res.status(200).json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});


