import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartCount, getWishlistCount } from '../utils/userStorage';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate = useNavigate();

  // Update counts from user-specific storage
  const updateCounts = () => {
    setCartCount(getCartCount());
    setWishlistCount(getWishlistCount());
  };

  useEffect(() => {
    updateCounts();
    
    // Listen for cart/wishlist updates
    window.addEventListener('cartUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);
    window.addEventListener('storage', updateCounts);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCounts);
      window.removeEventListener('wishlistUpdated', updateCounts);
      window.removeEventListener('storage', updateCounts);
    };
  }, [user]); // Re-run when user changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleProtectedClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      setShowLoginAlert(true);
      setTimeout(() => setShowLoginAlert(false), 3000);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/designs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Main navbar menu items with hover dropdowns
  const menuItems = [
    {
      name: 'Wedding Cards',
      path: '/category/wedding-printing',
      dropdown: [
        { name: 'All Wedding Cards', path: '/category/wedding-printing' },
        { name: 'Hindu Wedding Cards', path: '/category/wedding-printing?type=hindu' },
        { name: 'Muslim Wedding Cards', path: '/category/wedding-printing?type=muslim' },
        { name: 'Christian Wedding Cards', path: '/category/wedding-printing?type=christian' },
        { name: 'Sikh Wedding Cards', path: '/category/wedding-printing?type=sikh' },
        { name: 'Digital Wedding Cards', path: '/category/digital-invitations' }
      ]
    },
    {
      name: 'Birthday & Anniversary',
      path: '/category/birthday-anniversary',
      dropdown: [
        { name: 'All Birthday & Anniversary', path: '/category/birthday-anniversary' },
        { name: 'Kids Birthday Cards', path: '/category/birthday-anniversary?type=kids' },
        { name: 'Anniversary Invitation Cards', path: '/category/birthday-anniversary?type=anniversary' },
        { name: 'Milestone Birthdays', path: '/category/birthday-anniversary?type=milestone' }
      ]
    },
    {
      name: 'Grih Pravesh / Puja',
      path: '/category/grih-pravesh-puja',
      dropdown: [
        { name: 'All Puja Cards', path: '/category/grih-pravesh-puja' },
        { name: 'Grih Pravesh Cards', path: '/category/grih-pravesh-puja?type=grih-pravesh' },
        { name: 'Satyanarayan Katha', path: '/category/grih-pravesh-puja?type=satyanarayan' },
        { name: 'Religious Events', path: '/category/religious-events' }
      ]
    },
    {
      name: 'Business Printing',
      path: '/category/business-printing',
      dropdown: [
        { name: 'All Business Printing', path: '/category/business-printing' },
        { name: 'Visiting Cards', path: '/category/business-printing?type=visiting' },
        { name: 'Letterheads', path: '/category/business-printing?type=letterhead' },
        { name: 'Shop / Office Opening', path: '/category/shop-office-opening' }
      ]
    },
    {
      name: 'More Categories',
      path: '/designs',
      dropdown: [
        { name: 'Flex / Banner / Poster', path: '/category/flex-banner-poster' },
        { name: 'Stickers & Labels', path: '/category/stickers-labels' },
        { name: 'Calendars & Diaries', path: '/category/calendars-diaries' },
        { name: 'Certificates & Awards', path: '/category/certificates-awards' },
        { name: 'Condolence / Shraddh', path: '/category/condolence-shraddh' },
        { name: 'School / College Printing', path: '/category/school-college-printing' },
        { name: 'Personalized Gifts', path: '/category/personalized-gifts' },
        { name: 'Digital Invitations', path: '/category/digital-invitations' }
      ]
    }
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Main Navbar */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4">
          {/* First Line - Logo, Search Bar and Actions */}
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <span className="text-xl sm:text-2xl font-bold text-red-600">Shadi Card</span>
            </Link>

            {/* Search Bar - Center */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for wedding cards, invitations, designs..."
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-1">
              {user ? (
                <>
                  {/* Wishlist - Only for logged in users */}
                  <button
                    onClick={() => navigate('/wishlist')}
                    className="flex flex-col items-center px-3 py-1 text-gray-600 hover:text-red-600 transition-colors relative"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-xs mt-0.5">Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 right-1 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </button>

                  {/* Your Orders - Only for logged in users */}
                  <button
                    onClick={() => navigate('/my-orders')}
                    className="flex flex-col items-center px-3 py-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-xs mt-0.5">Orders</span>
                  </button>

                  {/* Cart - Only for logged in users */}
                  <button
                    onClick={() => navigate('/cart')}
                    className="flex flex-col items-center px-3 py-1 text-gray-600 hover:text-red-600 transition-colors relative"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs mt-0.5">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                  </button>

                  {/* User Account Dropdown */}
                  <div className="relative group">
                    <button className="flex flex-col items-center px-3 py-1 text-gray-600 hover:text-red-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs mt-0.5">Account</span>
                    </button>
                    
                    {/* User Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-800">{user.name || 'User'}</p>
                          <p className="text-xs text-gray-500">{user.mobile || ''}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          👤 My Profile
                        </Link>
                        <Link
                          to="/my-orders"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          📦 My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          ❤️ Wishlist
                        </Link>
                        <Link
                          to="/cart"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          🛒 Cart
                        </Link>
                        <Link
                          to="/track-order"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          🚚 Track Order
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors border-t border-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Become a Seller - Only for non-logged in users */}
                  <Link
                    to="/seller"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-medium text-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Become a Seller
                  </Link>

                  {/* Login Button */}
                  <Link
                    to="/login"
                    className="flex flex-col items-center px-3 py-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs mt-0.5">Login</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Icons - Right Side (Search + Menu) */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Mobile Search Icon */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="text-gray-700 hover:text-red-600 flex-shrink-0 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileSearchOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  )}
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-red-600 flex-shrink-0 p-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar - Appears below header when search icon clicked */}
      {isMobileSearchOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-md">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={(e) => { handleSearch(e); setIsMobileSearchOpen(false); }}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search designs..."
                  className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  autoFocus
                />
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Alert Popup */}
      {showLoginAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="font-medium">Please login first to continue</span>
          <Link to="/login" className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-semibold hover:bg-gray-100">
            Login Now
          </Link>
        </div>
      )}

      {/* Second Line - Menu Items */}
      <div className="bg-gray-50 border-b border-gray-100 hidden lg:block">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center space-x-8">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors py-3 block"
                >
                  {item.name}
                </Link>

                {/* Hover Dropdown Menu */}
                {item.dropdown && (
                  <div
                    className={`absolute left-0 top-full w-64 bg-white border border-gray-100 rounded-md shadow-lg transition-all duration-200 z-50 ${
                      activeDropdown === item.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <div className="py-2">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop/Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="fixed top-16 left-0 right-0 bg-white z-50 lg:hidden shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="container mx-auto px-4 py-4">
            {/* User Actions at Top */}
            {user ? (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4 p-3 bg-red-50 rounded-lg">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                  </div>
                </div>
                
                {/* Quick Action Grid */}
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </Link>
                  
                  <Link
                    to="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 relative"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-1 font-semibold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 relative"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-pink-500 text-white text-xs rounded-full px-2 py-1 font-semibold">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Orders</span>
                  </Link>
                </div>
                
                {/* Additional Links */}
                <div className="space-y-1">
                  <Link
                    to="/track-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Track Order
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full text-left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login / Register
                </Link>
              </div>
            )}
          </div>
        </div>
        </>
      )}
    </header>
  );
};

export default Header;
