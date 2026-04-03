import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import HomeCategories from '../components/HomeCategories';

import menuData from '../data/menuData';
import api, { getImageUrl } from '../utils/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/by-category?limit=6');
      if (response.data.success) {
        setProductsByCategory(response.data.data);
      }
    } catch (error) {
      // Error fetching products
    } finally {
      setLoading(false);
    }
  };

  // Map category slugs from menuData to display
  const getCategoryProducts = (categorySlug) => {
    return productsByCategory[categorySlug] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Category Strip - Horizontal Scrollable */}
      <HomeCategories />

      {/* Loading State */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading products...</p>
        </div>
      ) : Object.keys(productsByCategory).length === 0 ? (
        /* No Products State */
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Available Yet</h2>
            <p className="text-gray-600 mb-6">Our sellers are adding new products. Check back soon!</p>
            <button
              onClick={() => navigate('/seller/register')}
              className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700 transition"
            >
              Become a Seller
            </button>
          </div>
        </section>
      ) : (
        /* Design Showcase Sections - Products from Sellers */
        menuData.map((category) => {
          const products = getCategoryProducts(category.slug);
          if (products.length === 0) return null;

          return (
            <section key={category.id} className="py-12 bg-white">
              <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {category.name}
                  </h2>
                  <button
                    onClick={() => navigate(`/category/${category.slug}`)}
                    className="text-red-600 hover:text-red-700 font-semibold text-sm md:text-base"
                  >
                    View All →
                  </button>
                </div>

                {/* Product Cards */}
                <div className="relative">
                  <div className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-4 -mx-4 px-4">
                    {products.map((product) => (
                      <div
                        key={product._id || product.id}
                        onClick={() => navigate(`/product/${product.slug}`)}
                        className="flex-shrink-0 w-48 sm:w-56 md:w-64 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Image */}
                        <div className="relative h-36 sm:h-40 md:h-48 bg-gray-100 overflow-hidden">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name || product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                          
                          {/* Badge */}
                          {product.shopName && (
                            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium text-red-600 shadow-sm">
                              {product.shopName}
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-3 md:p-4">
                          <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2">
                            {product.name || product.title}
                          </h3>
                          <p className="text-red-600 font-semibold text-base md:text-lg mt-1 md:mt-2">₹{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })
      )}

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-gray-600">
              Professional printing with fast delivery across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                🎨
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Designs</h3>
              <p className="text-gray-600 text-sm">
                Professionally crafted templates for every occasion
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">
                Quick printing and doorstep delivery guaranteed
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                💯
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600 text-sm">
                Premium paper and printing quality on every order
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Simple 4-step process to get your perfect printing solution delivered
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-red-300 to-red-200" style={{ width: '85%', margin: '0 auto' }}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
              {[
                { step: '1', title: 'Select Design', icon: '🎨', desc: 'Browse and choose from our collection' },
                { step: '2', title: 'Customize', icon: '✏️', desc: 'Add your details and personalize' },
                { step: '3', title: 'Order', icon: '🛒', desc: 'Complete payment and place order' },
                { step: '4', title: 'Receive', icon: '📦', desc: 'Get delivered to your doorstep' }
              ].map((item, index) => (
                <div key={index} className="relative text-center group">
                  {/* Card */}
                  <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                    {/* Step Number Badge */}
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white font-bold text-xl mb-6 shadow-lg">
                      {item.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  
                  {/* Arrow Between Steps (Desktop Only) */}
                  {index < 3 && (
                    <div className="hidden md:block absolute top-14 -right-4 text-red-400 text-2xl z-10">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Perfect Card?
          </h2>
          <p className="text-lg text-red-100 mb-8">
            Browse our collection and start customizing today
          </p>
          <button
            onClick={() => navigate('/designs')}
            className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-50 transition-all duration-300"
          >
            Explore All Designs
          </button>
        </div>
      </section>

      
    </div>
  );
};

export default HomePage;
