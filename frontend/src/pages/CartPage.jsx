import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { getImageUrl } from '../utils/api';
import { clearCart as clearUserCart, getCart, setCart } from '../utils/userStorage';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Load cart from user-specific storage
    const savedCart = getCart();
    setCartItems(savedCart);
    setLoading(false);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index].quantity = newQuantity;
    setCartItems(updatedCart);
    setCart(updatedCart);
  };

  const removeItem = (index) => {
    const item = cartItems[index];
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    setCart(updatedCart);
    showToast(`${item.title || 'Item'} removed from cart`, 'info');
  };

  const handleClearCart = () => {
    setCartItems([]);
    clearUserCart();
    showToast('Cart cleared', 'info');
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.basePrice || item.price || 20;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleBuyNow = (item) => {
    // Navigate to product detail page where user can use the Buy Now modal
    navigate(`/product/${item.slug}`, {
      state: { openBuyNow: true, quantity: item.quantity }
    });
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
          <h1 className="text-2xl font-bold text-gray-800">🛒 Shopping Cart</h1>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
            <Link
              to="/"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div key={item.id || item._id || index} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                  {/* Product Image */}
                  <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title || item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.slug}`}>
                      <h3 className="font-semibold text-gray-800 hover:text-red-500 transition-colors line-clamp-1">
                        {item.title || item.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                    <p className="text-red-600 font-bold mt-1">₹{item.basePrice || item.price || 20}/card</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 10)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 10)}
                          className="px-3 py-1 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm text-gray-500">cards</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800">
                        ₹{(item.basePrice || item.price || 20) * item.quantity}
                      </p>
                      <button
                        onClick={() => handleBuyNow(item)}
                        className="mt-2 text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg transition-colors"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items ({cartItems.length})</span>
                    <span className="font-medium">₹{getSubtotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-base">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-red-600">₹{getSubtotal()}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                  <span className="font-medium">🎉 Free Delivery</span> on all orders
                </div>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Click "Buy Now" on individual items to proceed
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
