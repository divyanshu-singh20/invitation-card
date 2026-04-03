import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { getImageUrl } from '../utils/api';
import { addToCart as addToUserCart, clearWishlist as clearUserWishlist, getWishlist, setWishlist } from '../utils/userStorage';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Load wishlist from user-specific storage
    const savedWishlist = getWishlist();
    setWishlistItems(savedWishlist);
    setLoading(false);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleRemoveFromWishlist = (index) => {
    const item = wishlistItems[index];
    const updatedWishlist = wishlistItems.filter((_, i) => i !== index);
    setWishlistItems(updatedWishlist);
    setWishlist(updatedWishlist);
    showToast(`${item.title || 'Item'} removed from wishlist`, 'info');
  };

  const handleAddToCart = (item) => {
    const result = addToUserCart(item, item.minimumOrder || 100);
    showToast(result.message, result.success ? 'success' : 'error');
  };

  const handleClearWishlist = () => {
    setWishlistItems([]);
    clearUserWishlist();
    showToast('Wishlist cleared', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">❤️ My Wishlist</h1>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-6">Save items you love by clicking the heart icon</p>
            <Link
              to="/"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {wishlistItems.map((item, index) => (
              <div key={item.id || item._id || index} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                {/* Product Image */}
                <div className="relative aspect-square">
                  <Link to={`/product/${item.slug}`}>
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <Link to={`/product/${item.slug}`}>
                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 hover:text-red-500 transition-colors">
                      {item.title || item.name}
                    </h3>
                  </Link>
                  <p className="text-red-600 font-bold mt-1">₹{item.basePrice || item.price || 20}/card</p>
                  
                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
