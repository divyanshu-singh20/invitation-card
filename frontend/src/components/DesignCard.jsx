import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/api';

const DesignCard = ({ design }) => {
  const mainImage = getImageUrl(
    design.images?.find(img => img.type === 'front')?.url || 
    design.images?.[0]?.url || 
    design.images?.[0]
  );

  return (
    <div className="card group cursor-pointer overflow-hidden">
      <div className="relative overflow-hidden h-72">
        <img
          src={mainImage}
          alt={design.title || design.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=500&fit=crop&q=80';
          }}
        />
        {design.featured && (
          <div className="absolute top-3 right-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Featured
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {design.title || design.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {design.description || 'Beautiful wedding invitation card'}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="text-xl font-bold text-primary-600">
              ₹{design.basePrice || design.price}
              <span className="text-sm font-normal text-gray-500">/100 cards</span>
            </p>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            <span className="capitalize">{design.category}</span>
          </div>
        </div>
        
        <Link
          to={`/design/${design._id}`}
          className="block w-full text-center btn-primary"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default DesignCard;
