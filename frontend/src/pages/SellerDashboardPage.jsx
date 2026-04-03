import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SellerLayout from '../components/SellerLayout';
import api, { getImageUrl } from '../utils/api';

const SellerDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [sellerStatus, setSellerStatus] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSellerStatus();
  }, []);

  const fetchSellerStatus = async () => {
    try {
      const token = localStorage.getItem('sellerToken');
      
      if (!token) {
        navigate('/seller/login');
        return;
      }
      
      // First check seller status
      const statusRes = await api.get('/seller/dashboard/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSellerStatus(statusRes.data.data);
      
      // If approved, fetch full dashboard
      if (statusRes.data.data.status === 'approved') {
        const dashboardRes = await api.get('/seller/dashboard/overview', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(dashboardRes.data.data);
      }
    } catch (err) {
      // If token is invalid or not a seller, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('sellerToken');
        navigate('/seller/login');
        return;
      }
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link }) => (
    <Link to={link || '#'} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          <svg className={`w-7 h-7 ${color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
          </svg>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      </SellerLayout>
    );
  }

  // Show pending approval message
  if (sellerStatus && sellerStatus.status === 'pending') {
    return (
      <SellerLayout>
        <div className="max-w-2xl mx-auto mt-10">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-yellow-800 mb-2">Account Pending Approval</h1>
            <p className="text-yellow-700 mb-6">
              Welcome, <strong>{sellerStatus.ownerName}</strong>! Your seller account for <strong>"{sellerStatus.shopName}"</strong> is currently under review.
            </p>
            <div className="bg-white rounded-xl p-4 mb-6">
              <p className="text-gray-600 text-sm">
                📝 Our team is reviewing your application.<br/>
                ⏰ This usually takes 24-48 hours.<br/>
                📧 You'll receive an email once approved.
              </p>
            </div>
            <Link
              to="/seller/profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              View Profile
            </Link>
          </div>
        </div>
      </SellerLayout>
    );
  }

  // Show rejected message
  if (sellerStatus && sellerStatus.status === 'rejected') {
    return (
      <SellerLayout>
        <div className="max-w-2xl mx-auto mt-10">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-800 mb-2">Application Rejected</h1>
            <p className="text-red-700 mb-6">
              Unfortunately, your seller application has been rejected.
            </p>
            <p className="text-gray-600 text-sm">
              Please contact support for more information.
            </p>
          </div>
        </div>
      </SellerLayout>
    );
  }

  // Show deactivated message
  if (sellerStatus && !sellerStatus.isActive) {
    return (
      <SellerLayout>
        <div className="max-w-2xl mx-auto mt-10">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Deactivated</h1>
            <p className="text-gray-600 mb-6">
              Your seller account has been deactivated. Please contact support.
            </p>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {dashboardData?.seller?.ownerName || 'Seller'}! 👋
        </h1>
        <p className="text-gray-600">{dashboardData?.seller?.shopName}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Products"
          value={dashboardData?.productStats?.total || 0}
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          color="text-blue-600"
          link="/seller/products"
        />
        <StatCard
          title="Active Products"
          value={dashboardData?.productStats?.active || 0}
          icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          color="text-green-600"
          link="/seller/products?status=approved"
        />
        <StatCard
          title="Pending Review"
          value={dashboardData?.productStats?.pending || 0}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          color="text-yellow-600"
          link="/seller/products?status=pending"
        />
        <StatCard
          title="Total Views"
          value={dashboardData?.viewsAndOrders?.views || 0}
          icon="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          color="text-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/seller/products/add"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </Link>
          <Link
            to="/seller/products"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">View Products</span>
          </Link>
          <Link
            to="/seller/orders"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">View Orders</span>
          </Link>
          <Link
            to="/seller/profile"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Products</h2>
          <Link to="/seller/products" className="text-orange-600 hover:underline text-sm">
            View All →
          </Link>
        </div>

        {dashboardData?.recentProducts?.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.recentProducts.map((product) => (
              <div key={product._id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                <img
                  src={getImageUrl(product.images?.[0]?.url)}
                  alt={product.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">{product.title}</h3>
                  <p className="text-sm text-gray-500">₹{product.basePrice}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.status === 'approved' ? 'bg-green-100 text-green-700' :
                  product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  product.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {product.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-500 mb-4">No products yet</p>
            <Link
              to="/seller/products/add"
              className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerDashboardPage;
