import React, { useState } from 'react';

function Dropdown({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  let hoverTimeout;

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => setIsOpen(false), 200);
  };
  return (
    <div 
      className="relative group" 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="hover:text-primary text-gray-700 uppercase">{title}</button>
      <div className={`absolute left-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {children}
      </div>
    </div>
  );
}

export default Dropdown;
