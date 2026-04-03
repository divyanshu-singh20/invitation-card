import React from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryData } from '../data/categories';

const CategoryScroll = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <section className="bg-white py-3 border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Left Gradient Fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none hidden md:block"></div>
          
          {/* Categories Scroll */}
          <div className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide -mx-2 px-2">
            {categoryData.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="flex-shrink-0 flex flex-col items-center cursor-pointer group"
              >
                {/* Circular Image Container */}
                <div className={`
                  relative w-16 h-16 sm:w-18 sm:h-18 ${category.bgColor} 
                  rounded-full overflow-hidden shadow-sm 
                  transition-all duration-300 
                  group-hover:shadow-lg group-hover:scale-105
                  border-2 border-white
                `}>
                  {/* Category Image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  
                  {/* Icon Badge */}
                  <div className="absolute bottom-0 right-0 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm text-xs">
                    {category.icon}
                  </div>
                </div>

                {/* Category Name */}
                <p className="mt-2 text-xs font-medium text-gray-700 text-center max-w-[70px] leading-tight group-hover:text-primary-600 transition-colors">
                  {category.name}
                </p>
              </div>
            ))}
          </div>

          {/* Right Gradient Fade */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none hidden md:block"></div>
        </div>
      </div>
    </section>
  );
};

export default CategoryScroll;
