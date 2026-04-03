import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import allCategories from '../data/allCategories';
import designsDatabase from '../data/designsDatabase';

const CategoryListingPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  
  // Filters
  const [priceFilter, setPriceFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');

  // Get category info
  const categoryInfo = allCategories.find(cat => cat.slug === category);

  // Filtered designs
  const filteredDesigns = useMemo(() => {
    const allDesigns = designsDatabase[category] || [];
    let designs = [...allDesigns];

    // Price filter
    if (priceFilter === 'low') {
      designs = designs.filter(d => d.price < 20);
    } else if (priceFilter === 'medium') {
      designs = designs.filter(d => d.price >= 20 && d.price < 50);
    } else if (priceFilter === 'high') {
      designs = designs.filter(d => d.price >= 50);
    }

    // Language filter
    if (languageFilter !== 'all') {
      designs = designs.filter(d => d.language === languageFilter);
    }

    // Style filter
    if (styleFilter !== 'all') {
      designs = designs.filter(d => d.style === styleFilter);
    }

    return designs;
  }, [category, priceFilter, languageFilter, styleFilter]);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Category Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-700 font-semibold mb-4 inline-flex items-center"
          >
            ← Back to Home
          </button>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{categoryInfo.icon}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {categoryInfo.name}
              </h1>
              <p className="text-gray-600 mt-2">{categoryInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under ₹20</option>
                  <option value="medium">₹20 - ₹50</option>
                  <option value="high">Above ₹50</option>
                </select>
              </div>

              {/* Language Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Languages</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Hinglish">Hinglish</option>
                </select>
              </div>

              {/* Style Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Card Style
                </label>
                <select
                  value={styleFilter}
                  onChange={(e) => setStyleFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Styles</option>
                  <option value="Simple">Simple</option>
                  <option value="Premium">Premium</option>
                  <option value="Royal">Royal</option>
                </select>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setPriceFilter('all');
                  setLanguageFilter('all');
                  setStyleFilter('all');
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Design Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredDesigns.length}</span> designs
              </p>
            </div>

            {filteredDesigns.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">No designs found matching your filters</p>
                <button
                  onClick={() => {
                    setPriceFilter('all');
                    setLanguageFilter('all');
                    setStyleFilter('all');
                  }}
                  className="mt-4 text-red-600 hover:text-red-700 font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDesigns.map((design) => (
                  <div
                    key={design.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="relative h-64 bg-gray-100 overflow-hidden">
                      <img
                        src={design.image}
                        alt={design.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Language Badge */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                        {design.language}
                      </div>

                      {/* Style Badge */}
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        {design.style}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {design.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {design.description}
                      </p>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Starting from</p>
                          <p className="text-2xl font-bold text-red-600">
                            ₹{design.price}
                          </p>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/design/${design.id}`)}
                          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => navigate(`/customize/${design.id}`)}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                        >
                          Customize
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryListingPage;
