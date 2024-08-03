const recipes = [
  { 
    id: 1, 
    title: 'Spaghetti Carbonara', 
    category: 'dinner', 
    duration: '20 mins', 
    imageUrl: 'https://source.unsplash.com/random/80x80?spaghetti', 
    ingredients: [
      { amount: '100g', name: 'Pasta' },
      { amount: '2', name: 'Eggs' },
      { amount: '50g', name: 'Parmesan Cheese' },
      { amount: '100g', name: 'Bacon' }
    ],
    instructions: "Boil pasta. Mix eggs and cheese. Cook bacon. Combine all with pasta.",
    macros: {
      calories: '500 kcal',
      carbs: '60g',
      protein: '25g',
      fat: '20g'
    }
  },
  { 
    id: 2, 
    title: 'Classic Pancakes', 
    category: 'breakfast', 
    duration: '15 mins', 
    imageUrl: 'https://www.einfachbacken.de/sites/einfachbacken.de/files/styles/700_530/public/2020-08/american_pancakes.jpg', 
    ingredients: [
      { amount: '100g', name: 'Pasta' },
      { amount: '2', name: 'Eggs' },
      { amount: '50g', name: 'Parmesan Cheese' },
      { amount: '100g', name: 'Bacon' }
    ],
    instructions: "Mix ingredients. Cook on griddle. Flip pancakes. Serve hot.",
    macros: {
      calories: '350 kcal',
      carbs: '45g',
      protein: '10g',
      fat: '15g'
    }
  },
  { 
    id: 3, 
    title: 'Avocado Toast', 
    category: 'breakfast', 
    duration: '10 mins', 
    imageUrl: 'https://source.unsplash.com/random/80x80?avocado-toast', 
    ingredients: [
      { amount: '100g', name: 'Pasta' },
      { amount: '2', name: 'Eggs' },
      { amount: '50g', name: 'Parmesan Cheese' },
      { amount: '100g', name: 'Bacon' }
    ],
    instructions: "Toast bread. Mash avocado with salt and pepper. Spread on toast.",
    macros: {
      calories: '300 kcal',
      carbs: '35g',
      protein: '5g',
      fat: '15g'
    }
  }
  // Add more dummy recipes here...
];

export default recipes;
