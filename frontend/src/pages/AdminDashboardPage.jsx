import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { adminDashboard } from '../services/admin.service';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchStats(token);
  }, [navigate]);

  const fetchStats = async (token) => {
    try {
      const response = await adminDashboard.getStats(token);
      setStats(response.data.stats);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats?.totalOrders || 0}
              </p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Today's Orders</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {stats?.todayOrders || 0}
              </p>
            </div>
            <div className="text-4xl">🎯</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹{stats?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Prints</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {stats?.pendingPrints || 0}
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {stats?.ordersByStatus?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-gray-600 capitalize">{item._id}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats?.recentOrders?.map((order) => (
              <div key={order._id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-semibold text-gray-800">{order.orderId}</p>
                  <p className="text-sm text-gray-500">{order.design?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">₹{order.totalPrice}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                    order.status === 'printing' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-indigo-50 text-indigo-600 py-3 px-4 rounded-lg font-semibold hover:bg-indigo-100 transition-colors"
          >
            View All Orders
          </button>
          <button
            onClick={() => navigate('/admin/customers')}
            className="bg-blue-50 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
          >
            View Customers
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            className="bg-gray-50 text-gray-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
