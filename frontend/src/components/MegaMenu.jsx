import React from 'react';
import { useNavigate } from 'react-router-dom';

const MegaMenu = ({ category, open }) => {
  const navigate = useNavigate();

  if (!category) return null;

  return (
    <div
      className={`absolute left-0 right-0 top-full mt-2 transform transition-all duration-200 origin-top bg-white shadow-lg border-t border-gray-100 z-40 ${
        open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-gray-800">{category.name}</h4>
            <p className="text-xs text-gray-500 mt-1">Explore choices & sizes</p>
          </div>

          <div className="col-span-3 grid grid-cols-3 gap-4">
            {category.items.map((item) => (
              <button
                key={item}
                onClick={() => navigate(`/category/${category.slug}`)}
                className="text-left text-sm text-gray-700 hover:text-primary-600 transition px-2 py-1"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
