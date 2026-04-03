import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { adminCustomers } from '../services/admin.service';

const AdminCustomersPage = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchCustomers(token);
  }, [navigate, search]);

  const fetchCustomers = async (token) => {
    try {
      setLoading(true);
      const response = await adminCustomers.getAll(token, { search });
      setCustomers(response.data.customers);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <input
          type="text"
          placeholder="Search by name or mobile number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Orders</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total Spend</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Order</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Loading customers...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{customer.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">{customer.mobile}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">{customer.email || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                      {customer.totalOrders || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">
                      ₹{customer.totalSpend?.toLocaleString() || 0}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">
                      {customer.lastOrderDate 
                        ? new Date(customer.lastOrderDate).toLocaleDateString()
                        : '-'
                      }
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/admin/customers/${customer._id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomersPage;
