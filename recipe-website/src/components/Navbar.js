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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky w-full z-10 transition-opacity duration-300 ease-in-out bg-white">
      <div className="container mx-auto flex flex-col xl:flex-row items-center justify-between p-4">
        <div className="flex justify-between w-full xl:w-auto">
          <Link to="/" className="text-2xl font-cormorant me-6 font-semibold text-gray-700 uppercase">
            Kitchen Chaos
          </Link>
          <button className="text-gray-700 xl:hidden z-30" onClick={toggleMenu}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        <div className={`drawer fixed top-0 right-0 w-1/2 md:w-1/3 h-full bg-white shadow-lg xl:static xl:w-auto xl:h-auto xl:bg-transparent xl:shadow-none flex flex-col xl:flex-row items-center justify-center transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} xl:translate-x-0 z-20`}>
          <div className="flex flex-col xl:flex-row xl:flex xl:items-center space-y-4 xl:space-y-0 xl:space-x-10 2xl:space-x-20 p-4 xl:p-0">
            <Link to="/" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/category/breakfast" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Breakfast</Link>
            <Link to="/category/dinner" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Dinner</Link>
            <Link to="/category/dessert" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Dessert</Link>
            <Link to="/category/snacks" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Snacks</Link>
            <Link to="/category/dips" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Dips</Link>
            <Link to="/category/cocktails" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Cocktails</Link>
            <Link to="/shopping-list" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Shopping List</Link>
            <hr className="w-full border-gray-300 my-4 xl:hidden" />
            {isAuthenticated ? (
              <>
                <Link to="/create" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Create</Link>
                <Link to="/favorites" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Favorites</Link>
                <button onClick={handleLogout} className="hover:text-primary text-gray-700 uppercase text-center xl:text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/api/auth/login" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/api/auth/register" className="hover:text-primary text-gray-700 uppercase text-center xl:text-left" onClick={() => setIsOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
        {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-10" onClick={toggleMenu}></div>}
      </div>
    </nav>
  );
}

export default Navbar;
