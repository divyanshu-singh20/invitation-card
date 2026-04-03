import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { adminPayments } from '../services/admin.service';

const AdminPaymentsPage = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchPayments(token);
  }, [navigate, filters]);

  const fetchPayments = async (token) => {
    try {
      setLoading(true);
      const response = await adminPayments.getAll(token, filters);
      setPayments(response.data.payments);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (id) => {
    const token = localStorage.getItem('adminToken');
    if (window.confirm('Mark this COD payment as paid?')) {
      try {
        await adminPayments.markPaid(token, id);
        fetchPayments(token);
        alert('Payment marked as paid');
      } catch (err) {
        alert('Failed to mark payment as paid');
      }
    }
  };

  const handleRefund = async (id) => {
    const token = localStorage.getItem('adminToken');
    const reason = prompt('Enter refund reason:');
    if (reason) {
      try {
        await adminPayments.refund(token, id, reason);
        fetchPayments(token);
        alert('Refund processed successfully');
      } catch (err) {
        alert('Failed to process refund');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-600',
      pending: 'bg-yellow-100 text-yellow-600',
      refunded: 'bg-red-100 text-red-600'
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <AdminLayout>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Payment Methods</option>
            <option value="upi">UPI</option>
            <option value="cod">Cash on Delivery</option>
          </select>

          <button
            onClick={() => setFilters({ status: '', paymentMethod: '' })}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Loading payments...
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  No payments found
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">
                      {payment.order?.orderId || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {payment.order?.user?.name || 'Guest'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.order?.user?.mobile}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">₹{payment.amount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="uppercase text-xs font-semibold text-gray-600">
                      {payment.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {payment.paymentMethod === 'cod' && payment.status === 'pending' && (
                        <button
                          onClick={() => handleMarkPaid(payment._id)}
                          className="text-green-600 hover:text-green-800 text-sm font-semibold"
                        >
                          Mark Paid
                        </button>
                      )}
                      {payment.status === 'paid' && (
                        <button
                          onClick={() => handleRefund(payment._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-semibold"
                        >
                          Refund
                        </button>
                      )}
                    </div>
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

export default AdminPaymentsPage;
