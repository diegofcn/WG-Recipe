import React, { useContext } from 'react';
import { ShoppingListContext } from '../ShoppingListContext';

function ShoppingList() {
  const { shoppingList, removeFromShoppingList, clearShoppingList } = useContext(ShoppingListContext);

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-6">Shopping List</h2>
      {shoppingList.length === 0 ? (
        <p>Your shopping list is empty.</p>
      ) : (
        <>
          <ul className="list-disc list-inside mb-6">
            {shoppingList.map((item, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
                <span>{item.amount} {item.name} (Recipe: {item.recipeName})</span>
                <button
                  onClick={() => removeFromShoppingList(item)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={clearShoppingList}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Clear Shopping List
          </button>
        </>
      )}
    </div>
  );
}

export default ShoppingList;
