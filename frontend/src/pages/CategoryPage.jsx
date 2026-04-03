import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import menuData from '../data/menuData';
import api, { getImageUrl } from '../utils/api';

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Get category name from menuData
  const category = menuData.find(cat => cat.slug === slug);
  const categoryName = category?.name || slug?.replace(/-/g, ' ');

  useEffect(() => {
    fetchProducts();
  }, [slug, sort, pagination.current]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: slug,
        page: pagination.current,
        limit: 12,
        sort: sort
      });

      if (priceRange.min) params.append('minPrice', priceRange.min);
      if (priceRange.max) params.append('maxPrice', priceRange.max);

      const response = await api.get(`/products?${params}`);
      if (response.data.success) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      // Error fetching products
    } finally {
      setLoading(false);
    }
  };

  const handlePriceFilter = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4">
          <nav className="text-red-100 text-sm mb-2">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span className="text-white capitalize">{categoryName}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold capitalize">{categoryName}</h1>
          <p className="text-red-100 mt-2">{pagination.total} products available</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between mb-6 md:mb-8 bg-white p-3 md:p-4 rounded-xl shadow-sm">
          {/* Price Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="number"
              placeholder="Min ₹"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-20 sm:w-24 px-2 sm:px-3 py-2 border rounded-lg text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-20 sm:w-24 px-2 sm:px-3 py-2 border rounded-lg text-sm"
            />
            <button
              onClick={handlePriceFilter}
              className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Apply
            </button>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Found</h2>
            <p className="text-gray-600 mb-6">No products available in this category yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-700"
            >
              Browse All Categories
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product.slug}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={getImageUrl(product.images?.[0]?.url)}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">{product.title}</h3>
                    {product.seller?.shopName && (
                      <p className="text-gray-500 text-xs mb-2">{product.seller.shopName}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-red-600 font-bold text-lg">₹{product.basePrice}</span>
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {product.views || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                  disabled={pagination.current === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Previous
                </button>
                
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPagination(prev => ({ ...prev, current: i + 1 }))}
                    className={`w-10 h-10 rounded-lg ${
                      pagination.current === i + 1
                        ? 'bg-red-600 text-white'
                        : 'border hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                  disabled={pagination.current === pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
