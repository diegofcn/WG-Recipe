import React from 'react';
import { Link } from 'react-router-dom';

const categories = ['Breakfast', 'Dinner', 'Dessert', 'Snacks', 'Dips'];

function CategorySlider() {
  return (
    <div className="flex flex-col justify-center mt-8 mb-8">
      <div className="relative z-10 text-center p-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-cormorant uppercase text-gray-800">Categories</h1>
        <span className="block mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-6xl text-primary font-handwritten">Let's cook!</span>
      </div>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 sm:gap-12 md:gap-16 lg:gap-24 overflow-x-auto px-4 mt-12">
          {categories.map(category => (
            <Link to={`/category/${category.toLowerCase()}`} key={category} className="min-w-max">
              <div className="w-60 sm:w-60 md:w-72 lg:w-80 h-40 sm:h-60 md:h-72 lg:h-80 bg-gray-200 flex justify-center items-center rounded-lg shadow-lg">
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold font-fancy">{category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategorySlider;
