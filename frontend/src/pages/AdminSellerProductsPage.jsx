import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import api, { getImageUrl } from '../utils/api';

const AdminSellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectModal, setRejectModal] = useState({ show: false, product: null, reason: '' });
  const [filters, setFilters] = useState({ status: 'pending' });
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.current]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: pagination.current,
        limit: 10,
        ...(filters.status && { status: filters.status })
      });
      
      const response = await api.get(`/admin/seller-products?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProducts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      // Error fetching products
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await api.patch(`/admin/seller-products/${productId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      setSelectedProduct(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async () => {
    if (!rejectModal.reason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      await api.patch(`/admin/seller-products/${rejectModal.product._id}/reject`, 
        { reason: rejectModal.reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRejectModal({ show: false, product: null, reason: '' });
      fetchProducts();
      setSelectedProduct(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    }
  };

  const handleToggleFeatured = async (productId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await api.patch(`/admin/seller-products/${productId}/featured`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Seller Products</h1>
        <p className="text-gray-600">Review and manage seller product submissions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex gap-2 flex-wrap">
          {['pending', 'approved', 'rejected', ''].map((status) => (
            <button
              key={status}
              onClick={() => setFilters({ ...filters, status })}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filters.status === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Product</th>
                <th className="text-left p-4 font-semibold text-gray-600">Seller</th>
                <th className="text-left p-4 font-semibold text-gray-600">Category</th>
                <th className="text-left p-4 font-semibold text-gray-600">Price</th>
                <th className="text-left p-4 font-semibold text-gray-600">Status</th>
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
                    <p className="font-medium text-gray-800">{product.seller?.shopName}</p>
                    <p className="text-sm text-gray-500">{product.seller?.email}</p>
                  </td>
                  <td className="p-4 capitalize">{product.category}</td>
                  <td className="p-4 font-semibold">₹{product.basePrice}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        View
                      </button>
                      {product.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(product._id)}
                            className="px-3 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectModal({ show: true, product, reason: '' })}
                            className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
            disabled={pagination.current === 1}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">{pagination.current} / {pagination.pages}</span>
          <button
            onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
            disabled={pagination.current === pagination.pages}
            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">{selectedProduct.title}</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Images */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {selectedProduct.images?.map((img, i) => (
                <img key={i} src={getImageUrl(img.url)} alt="" className="w-full aspect-square object-cover rounded-lg" />
              ))}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium capitalize">{selectedProduct.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Base Price</p>
                <p className="font-medium">₹{selectedProduct.basePrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price per 100</p>
                <p className="font-medium">₹{selectedProduct.pricePerHundred}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Min Order</p>
                <p className="font-medium">{selectedProduct.minOrderQuantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Days</p>
                <p className="font-medium">{selectedProduct.deliveryDays} days</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Seller</p>
                <p className="font-medium">{selectedProduct.seller?.shopName}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Description</p>
              <p className="text-gray-700">{selectedProduct.description}</p>
            </div>

            {/* Actions */}
            {selectedProduct.status === 'pending' && (
              <div className="flex gap-4">
                <button
                  onClick={() => handleApprove(selectedProduct._id)}
                  className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600"
                >
                  Approve Product
                </button>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setRejectModal({ show: true, product: selectedProduct, reason: '' });
                  }}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
                >
                  Reject Product
                </button>
              </div>
            )}
            
            {selectedProduct.status === 'approved' && (
              <button
                onClick={() => handleToggleFeatured(selectedProduct._id)}
                className={`w-full py-3 rounded-xl ${
                  selectedProduct.featured
                    ? 'bg-gray-200 text-gray-700'
                    : 'bg-orange-500 text-white'
                }`}
              >
                {selectedProduct.featured ? 'Remove from Featured' : 'Mark as Featured'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reject Product</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting "{rejectModal.product?.title}"
            </p>
            <textarea
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-4">
              <button
                onClick={() => setRejectModal({ show: false, product: null, reason: '' })}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSellerProductsPage;
