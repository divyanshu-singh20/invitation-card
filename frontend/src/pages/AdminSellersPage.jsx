import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import api from '../utils/api';

const AdminSellersPage = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [counts, setCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchSellers();
  }, [activeTab]);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await api.get(`/admin/sellers?status=${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSellers(response.data.sellers);
        setCounts(response.data.counts);
      }
    } catch (error) {
      // Error fetching sellers
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (sellerId) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await api.put(`/admin/sellers/${sellerId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchSellers();
        setShowModal(false);
        setSelectedSeller(null);
      }
    } catch (error) {
      alert('Failed to approve seller');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSeller) return;
    
    try {
      setActionLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await api.put(`/admin/sellers/${selectedSeller._id}/reject`, {
        reason: rejectReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchSellers();
        setShowModal(false);
        setSelectedSeller(null);
        setRejectReason('');
      }
    } catch (error) {
      alert('Failed to reject seller');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (sellerId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await api.put(`/admin/sellers/${sellerId}/toggle-active`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        fetchSellers();
      }
    } catch (error) {
      // Error toggling status
    }
  };

  const openSellerModal = (seller) => {
    setSelectedSeller(seller);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'approved', label: 'Approved', count: counts.approved },
    { id: 'rejected', label: 'Rejected', count: counts.rejected },
    { id: 'all', label: 'All', count: counts.all }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Seller Management</h1>
          <p className="text-gray-600">Manage seller registrations and approvals</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Sellers Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : sellers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">No sellers found</h3>
            <p className="text-gray-500">No {activeTab} seller registrations</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seller Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sellers.map((seller) => (
                  <tr key={seller._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-semibold">
                            {seller.ownerName?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{seller.ownerName}</div>
                          <div className="text-sm text-gray-500">{seller.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{seller.shopName}</div>
                      <div className="text-sm text-gray-500">{seller.shopType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{seller.phone}</div>
                      <div className="text-sm text-gray-500">{seller.address?.city}, {seller.address?.state}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(seller.status)}`}>
                        {seller.status.charAt(0).toUpperCase() + seller.status.slice(1)}
                      </span>
                      {seller.status === 'approved' && (
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${seller.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {seller.isActive ? 'Active' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(seller.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openSellerModal(seller)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {seller.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(seller._id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSeller(seller);
                              setShowModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {seller.status === 'approved' && (
                        <button
                          onClick={() => handleToggleActive(seller._id)}
                          className={seller.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                        >
                          {seller.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Seller Detail Modal */}
        {showModal && selectedSeller && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Seller Details</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedSeller(null);
                      setRejectReason('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Owner Name</p>
                      <p className="font-medium">{selectedSeller.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedSeller.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedSeller.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(selectedSeller.status)}`}>
                        {selectedSeller.status.charAt(0).toUpperCase() + selectedSeller.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shop Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Shop Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Shop Name</p>
                      <p className="font-medium">{selectedSeller.shopName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shop Type</p>
                      <p className="font-medium">{selectedSeller.shopType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">GST Number</p>
                      <p className="font-medium">{selectedSeller.gstNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">PAN Number</p>
                      <p className="font-medium">{selectedSeller.panNumber || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Address</h3>
                  <p className="text-gray-700">
                    {selectedSeller.address?.addressLine1}
                    {selectedSeller.address?.addressLine2 && `, ${selectedSeller.address.addressLine2}`}
                    <br />
                    {selectedSeller.address?.city}, {selectedSeller.address?.state} - {selectedSeller.address?.pincode}
                  </p>
                </div>

                {/* Bank Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Bank Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Bank Name</p>
                      <p className="font-medium">{selectedSeller.bankDetails?.bankName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Holder</p>
                      <p className="font-medium">{selectedSeller.bankDetails?.accountHolderName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="font-medium">{selectedSeller.bankDetails?.accountNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">IFSC Code</p>
                      <p className="font-medium">{selectedSeller.bankDetails?.ifscCode || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason Input (for pending sellers) */}
                {selectedSeller.status === 'pending' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Rejection Reason (Optional)</h3>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Enter reason for rejection..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={3}
                    />
                  </div>
                )}

                {/* Show rejection reason if rejected */}
                {selectedSeller.status === 'rejected' && selectedSeller.rejectionReason && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
                    <p className="text-red-700">{selectedSeller.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedSeller.status === 'pending' && (
                <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                  <button
                    onClick={() => handleReject()}
                    disabled={actionLoading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleApprove(selectedSeller._id)}
                    disabled={actionLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSellersPage;
