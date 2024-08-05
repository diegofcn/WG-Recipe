import React, { useContext, useRef, useState } from 'react';
import { ShoppingListContext } from '../ShoppingListContext';
import { FaTrashAlt } from 'react-icons/fa';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode.react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { FaSpinner } from 'react-icons/fa';

function ShoppingList() {
  const { shoppingList, removeFromShoppingList, clearShoppingList } = useContext(ShoppingListContext);
  const listRef = useRef();
  const [imageUrl, setImageUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const [loadingQr, setLoadingQr] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  const groupIngredients = (ingredients) => {
    const grouped = {};

    ingredients.forEach((item) => {
      if (!grouped[item.name]) {
        grouped[item.name] = [];
      }
      grouped[item.name].push(item);
    });

    return grouped;
  };

  const groupedIngredients = groupIngredients(shoppingList);


  const handleGenerateQrCode = async () => {
    setLoadingQr(true);
    if (listRef.current === null) {
        return;
      }
    const node = document.getElementById('shopping-list');
    try {
      const dataUrl = await toPng(listRef.current);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to generate a QR code');
        return;
      }
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload`, { data: dataUrl }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("QR Code Image URL:", response.data.url);
      setQrCodeUrl(response.data.url);
    } catch (error) {
      console.error('Could not generate QR code', error);
    } finally {
      setLoadingQr(false);
    }
  };

  const handleDownloadImage = async () => {
    setLoadingDownload(true);
    if (listRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(listRef.current);
      const link = document.createElement('a');
      link.download = 'shopping-list.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Could not generate image', error);
    } finally {
        setLoadingDownload(false);
    }
  };

  return (
    <div id="shopping-list" className="max-w-4xl mx-auto p-5">
      <h2 className="text-2xl font-bold mb-6 text-center">Shopping List</h2>
      {shoppingList.length === 0 ? (
        <p className="text-center text-lg">Your shopping list is empty.</p>
      ) : (
        <>
          <div ref={listRef} className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Items to Buy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(groupedIngredients).map(([name, items], index) => (
                <div key={index} className="flex flex-col p-4 bg-gray-50 border rounded-lg">
                  <div className="font-bold text-lg mb-2">{name}</div>
                  {items.map((item, subIndex) => (
                    <div key={subIndex} className="flex justify-between items-center">
                      <span className="block">{item.amount} (Recipe: {item.recipeName})</span>
                      <button
                        onClick={() => removeFromShoppingList(item)}
                        className="text-red-500 hover:text-red-700 ml-4"
                      >
                        <FaTrashAlt />
                        </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={clearShoppingList}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4"
            >
              Clear Shopping List
            </button>
            <button
              onClick={handleGenerateQrCode}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-4 flex items-center"
              disabled={loadingQr}
            >
              {loadingQr && <FaSpinner className="animate-spin mr-2" />}
              Generate QR Code
            </button>
            <button
              onClick={handleDownloadImage}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
              disabled={loadingDownload}
            >
              {loadingDownload && <FaSpinner className="animate-spin mr-2" />}
              Download Image
            </button>
          </div>
          {qrCodeUrl && (
            <div className="flex justify-center mt-6">
              <QRCode value={qrCodeUrl} />
            </div>
          )}
          {imageUrl && (
            <div className="flex justify-center mt-6">
              <a href={imageUrl} download="shopping-list.png">
                <img src={imageUrl} alt="Shopping List" className="w-1/2" />
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ShoppingList;
