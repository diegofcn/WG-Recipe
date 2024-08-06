import React, { useContext }  from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg'
import backgroundImage from '../assets/avocado.jpg';
import { AuthContext } from '../AuthContext'; 

function Hero() {

  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  return (
    <div className="relative bg-white min-h-screen flex flex-col items-center overflow-hidden">
      <div className="relative z-10 text-center p-8">
        <img src={logo} alt="Recipe World Logo" className="w-16 sm:w-24 h-16 sm:h-24 mx-auto mb-4" />
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-cormorant uppercase text-gray-800">Kitchen Chaos</h1>
        <span className="block mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-primary font-handwritten">flavorful & easy</span>
      </div>
      <div className="mt-8 text-lg sm:text-xl lg:text-2xl">
        <div className="mt-8 flex flex-wrap justify-center space-x-4 sm:space-x-4 md:space-x-6 lg:space-x-10 xl:space-x-20">
          <Link to="/category/breakfast" className="hover:text-primary text-gray-700 uppercase">breakfast</Link>
          <Link to="/category/dinner" className="hover:text-primary text-gray-700 uppercase">dinner</Link>
          <Link to="/category/dessert" className="hover:text-primary text-gray-700 uppercase">dessert</Link>
          <Link to="/category/snacks" className="hover:text-primary text-gray-700 uppercase">snacks</Link>
          <Link to="/category/dips" className="hover:text-primary text-gray-700 uppercase">dips</Link>
          <Link to="/category/cocktails" className="hover:text-primary text-gray-700 uppercase">Cocktails</Link>
          {isAuthenticated ? (
            <>
              <Link to="/create" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Create</Link>
              <button onClick={() => logout(navigate)} className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/api/auth/login" className="hover:text-primary text-gray-700 uppercase text-center lg:text-left">Login / Register</Link>
            </>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 w-full h-1/2">
        <img src={backgroundImage} alt="Background" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default Hero;
