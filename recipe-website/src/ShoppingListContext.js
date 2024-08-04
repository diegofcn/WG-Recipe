import React, { createContext, useState, useEffect } from 'react';

export const ShoppingListContext = createContext();

export const ShoppingListProvider = ({ children }) => {
  const [shoppingList, setShoppingList] = useState(() => {
    const savedList = localStorage.getItem('shoppingList');
    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const addToShoppingList = (ingredient) => {
    setShoppingList((prevList) => {
      if (!prevList.some(item => item.name === ingredient.name)) {
        return [...prevList, ingredient];
      }
      return prevList;
    });
  };

  const removeFromShoppingList = (ingredient) => {
    setShoppingList((prevList) => prevList.filter(item => item.name !== ingredient.name));
  };

  const clearShoppingList = () => {
    setShoppingList([]);
    localStorage.removeItem('shoppingList');
    localStorage.removeItem('clickedIngredients');
  };

  return (
    <ShoppingListContext.Provider value={{ shoppingList, addToShoppingList, removeFromShoppingList, clearShoppingList }}>
      {children}
    </ShoppingListContext.Provider>
  );
};
