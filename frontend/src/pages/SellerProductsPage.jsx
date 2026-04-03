import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SellerLayout from '../components/SellerLayout';
import api, { getImageUrl } from '../utils/api';

const SellerProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    category: ''
  });
  const [deleteModal, setDeleteModal] = useState({ show: false, product: null });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.current]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('sellerToken');
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 10,
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category: filters.category })
      });
      
      const response = await api.get(`/seller/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProducts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.product) return;
    
    try {
      const token = localStorage.getItem('sellerToken');
      await api.delete(`/seller/products/${deleteModal.product._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDeleteModal({ show: false, product: null });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleToggleActive = async (productId) => {
    try {
      const token = localStorage.getItem('sellerToken');
      await api.patch(`/seller/products/${productId}/toggle-active`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update product');
    }
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'hindu', label: 'Hindu' },
    { value: 'muslim', label: 'Muslim' },
    { value: 'christian', label: 'Christian' },
    { value: 'sikh', label: 'Sikh' },
    { value: 'modern', label: 'Modern' },
    { value: 'traditional', label: 'Traditional' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'budget', label: 'Budget' }
  ];

  const statuses = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'draft', label: 'Draft' }
  ];

  return (
    <SellerLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Products</h1>
          <p className="text-gray-600">Manage your wedding card designs</p>
        </div>
        <Link
          to="/seller/products/add"
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {statuses.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {categories.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-6">Start adding your wedding card designs to sell</p>
          <Link
            to="/seller/products/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Product
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-600">Product</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Category</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Price</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-600">Active</th>
                    <th className="text-right p-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(product.images?.[0]?.url)}
                            alt={product.title}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-medium text-gray-800">{product.title}</h3>
                            <p className="text-sm text-gray-500">{product.images?.length || 0} images</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize text-gray-700">{product.category}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-800">₹{product.basePrice}</span>
                        {product.discountPercent > 0 && (
                          <span className="ml-2 text-xs text-green-600">-{product.discountPercent}%</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.status === 'approved' ? 'bg-green-100 text-green-700' :
                          product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          product.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {product.status}
                        </span>
                        {product.status === 'rejected' && product.rejectionReason && (
                          <p className="text-xs text-red-500 mt-1" title={product.rejectionReason}>
                            Reason: {product.rejectionReason.slice(0, 30)}...
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleActive(product._id)}
                          disabled={product.status !== 'approved'}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            product.isActive && product.status === 'approved' ? 'bg-green-500' : 'bg-gray-300'
                          } ${product.status !== 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            product.isActive ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/seller/products/edit/${product._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ show: true, product })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                disabled={pagination.current === 1}
                className="px-4 py-2 rounded-lg bg-white border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {pagination.current} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                disabled={pagination.current === pagination.pages}
                className="px-4 py-2 rounded-lg bg-white border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Product?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteModal.product?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteModal({ show: false, product: null })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerProductsPage;
