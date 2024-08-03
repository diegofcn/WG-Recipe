import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../AuthContext'; // Import AuthContext

function Navbar() {
  const [transparent, setTransparent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext); // Use AuthContext

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY >= 80) {
        setTransparent(true);
      } else {
        setTransparent(false);
      }
    };

    window.addEventListener('scroll', changeBackground);

    return () => {
      window.removeEventListener('scroll', changeBackground);
    };
  }, []);

  return (
    <nav className="sticky w-full mt-8 z-10 transition-opacity duration-300 ease-in-out bg-white">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between p-4">
        <div className="flex justify-between w-full lg:w-auto">
          <Link to="/" className="text-2xl font-cormorant me-6 font-semibold text-gray-700 uppercase">
            Kitchen Chaos
          </Link>
          <button className="text-gray-700 lg:hidden" onClick={toggleMenu}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <div className={`flex-col lg:flex-row lg:flex lg:items-center ${isOpen ? 'flex' : 'hidden'} w-full lg:w-auto mt-4 lg:mt-0 space-y-4 lg:space-y-0 lg:space-x-10 xl:space-x-20`}>
          <Link to="/" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Home</Link>
          <Link to="/category/breakfast" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Breakfast</Link>
          <Link to="/category/dinner" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Dinner</Link>
          <Link to="/category/dessert" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Dessert</Link>
          <Link to="/category/snacks" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Snacks</Link>
          <Link to="/category/dips" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Dips</Link>
          {isAuthenticated ? (
            <>
              <Link to="/create" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Create</Link>
              <Link to="/favorites" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Favorites</Link>
              <button onClick={() => logout(navigate)} className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/api/auth/login" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Login</Link>
              <Link to="/api/auth/register" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
