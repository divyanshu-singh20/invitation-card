// User-specific storage utility
// All cart, wishlist, orders data is stored per user

export const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user?.id || user?._id || 'guest';
};

export const getStorageKey = (key) => {
  const userId = getUserId();
  return `${userId}_${key}`;
};

// Helper to get product ID (handles both id and _id)
const getProductId = (product) => {
  return product?.id || product?._id || product?.slug;
};

// Cart functions
export const getCart = () => {
  const key = getStorageKey('cart');
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const setCart = (cart) => {
  const key = getStorageKey('cart');
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
};

export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const productId = getProductId(product);
  const existingIndex = cart.findIndex(item => (item.id === productId || item._id === productId || item.slug === product.slug));
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: productId,
      _id: product._id,
      title: product.title || product.name,
      image: product.thumbnail || product.images?.[0]?.url || product.images?.[0] || product.image,
      price: product.basePrice || product.price,
      originalPrice: product.originalPrice,
      quantity: quantity,
      slug: product.slug,
      category: product.category
    });
  }
  
  setCart(cart);
  return { success: true, message: `${product.title || product.name} added to cart!` };
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const newCart = cart.filter(item => item.id !== productId && item._id !== productId && item.slug !== productId);
  setCart(newCart);
  return { success: true, message: 'Item removed from cart' };
};

export const updateCartQuantity = (productId, quantity) => {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === productId || item._id === productId || item.slug === productId);
  if (index > -1) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    setCart(cart);
  }
  return { success: true };
};

export const clearCart = () => {
  setCart([]);
  return { success: true, message: 'Cart cleared' };
};

// Wishlist functions
export const getWishlist = () => {
  const key = getStorageKey('wishlist');
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const setWishlist = (wishlist) => {
  const key = getStorageKey('wishlist');
  localStorage.setItem(key, JSON.stringify(wishlist));
  window.dispatchEvent(new Event('wishlistUpdated'));
};

export const addToWishlist = (product) => {
  const wishlist = getWishlist();
  const productId = getProductId(product);
  const exists = wishlist.some(item => item.id === productId || item._id === productId || item.slug === product.slug);
  
  if (exists) {
    return { success: false, message: 'Item already in wishlist' };
  }
  
  wishlist.push({
    id: productId,
    _id: product._id,
    title: product.title || product.name,
    image: product.thumbnail || product.images?.[0]?.url || product.images?.[0] || product.image,
    price: product.basePrice || product.price,
    originalPrice: product.originalPrice,
    slug: product.slug,
    category: product.category
  });
  
  setWishlist(wishlist);
  return { success: true, message: `${product.title || product.name} added to wishlist!` };
};

export const removeFromWishlist = (productId) => {
  const wishlist = getWishlist();
  const newWishlist = wishlist.filter(item => item.id !== productId && item._id !== productId && item.slug !== productId);
  setWishlist(newWishlist);
  return { success: true, message: 'Removed from wishlist' };
};

export const isInWishlist = (productId) => {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === productId || item._id === productId || item.slug === productId);
};

export const clearWishlist = () => {
  setWishlist([]);
  return { success: true, message: 'Wishlist cleared' };
};

// Orders functions
export const getOrders = () => {
  const key = getStorageKey('orders');
  return JSON.parse(localStorage.getItem(key) || '[]');
};

export const setOrders = (orders) => {
  const key = getStorageKey('orders');
  localStorage.setItem(key, JSON.stringify(orders));
};

export const addOrder = (order) => {
  const orders = getOrders();
  orders.unshift(order); // Add to beginning
  setOrders(orders);
  return { success: true, message: 'Order placed successfully!' };
};

// Profile functions
export const getProfile = () => {
  const key = getStorageKey('profile');
  const savedProfile = localStorage.getItem(key);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (savedProfile) {
    return JSON.parse(savedProfile);
  }
  
  return {
    fullName: user.name || '',
    email: user.email || '',
    mobile: user.mobile || user.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  };
};

export const setProfile = (profile) => {
  const key = getStorageKey('profile');
  localStorage.setItem(key, JSON.stringify(profile));
  return { success: true, message: 'Profile updated!' };
};

// Get cart count for header
export const getCartCount = () => {
  const cart = getCart();
  return cart.length;  // Count number of items, not total quantity
};

// Get wishlist count for header
export const getWishlistCount = () => {
  const wishlist = getWishlist();
  return wishlist.length;
};
