import React from 'react';

const CategoryCard = ({ category, onClick }) => {
  const categoryImages = {
    hindu: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop&q=80',
    muslim: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=300&fit=crop&q=80',
    christian: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=300&fit=crop&q=80',
    modern: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop&q=80',
    traditional: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400&h=300&fit=crop&q=80'
  };

  const categoryNames = {
    hindu: 'Hindu Wedding',
    muslim: 'Muslim Wedding',
    christian: 'Christian Wedding',
    modern: 'Modern / Minimal',
    traditional: 'Traditional'
  };

  const categoryIcons = {
    hindu: '🕉️',
    muslim: '☪️',
    christian: '✝️',
    modern: '✨',
    traditional: '🌸'
  };

  return (
    <div
      onClick={() => onClick(category)}
      className="card cursor-pointer group overflow-hidden"
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={categoryImages[category] || categoryImages.modern}
          alt={categoryNames[category]}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end pb-6">
          <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
            {categoryIcons[category]}
          </div>
          <h3 className="text-white text-xl font-bold text-center px-2">
            {categoryNames[category]}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
