import React, { useContext } from 'react';
import { ShoppingListContext } from '../ShoppingListContext';

function ShoppingList() {
  const { shoppingList, removeFromShoppingList } = useContext(ShoppingListContext);

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Shopping List</h2>
      {shoppingList.length === 0 ? (
        <p>Your shopping list is empty.</p>
      ) : (
        <ul className="list-disc pl-5">
          {shoppingList.map((ingredient, index) => (
            <li key={index} className="mb-2">
              {ingredient.amount} {ingredient.name}
              <button
                onClick={() => removeFromShoppingList(ingredient)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShoppingList;
