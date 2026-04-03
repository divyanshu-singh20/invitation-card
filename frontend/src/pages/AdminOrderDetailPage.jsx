import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { adminOrders } from '../services/admin.service';
import { getImageUrl } from '../utils/api';

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchOrder(token);
  }, [id, navigate]);

  const fetchOrder = async (token) => {
    try {
      const response = await adminOrders.getById(token, id);
      setOrder(response.data.order);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin/login');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      await adminOrders.updateStatus(token, id, newStatus);
      fetchOrder(token);
      alert('Status updated successfully');
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading order details...</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <Link to="/admin/orders" className="text-indigo-600">
            ← Back to Orders
          </Link>
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            Order not found
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-4">
        <Link to="/admin/orders" className="text-indigo-600 text-sm">
          ← Back to Orders
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{order.orderId}</h2>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">
              ₹{order.totalAmount || order.totalPrice}
            </p>
            <span className="text-xs capitalize">{order.status}</span>
          </div>
        </div>

        {/* Product */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex gap-3">
          {(order.design?.images?.[0] || order.productInfo?.image) && (
            <img
              src={
                order.design?.images?.[0]
                  ? getImageUrl(order.design.images[0]?.url || order.design.images[0])
                  : order.productInfo?.image
              }
              alt="product"
              className="w-20 h-20 object-cover rounded"
            />
          )}
          <div>
            <p className="font-medium">
              {order.design?.name || order.productInfo?.name}
            </p>
            <p className="text-xs text-gray-600">
              Qty: {order.quantity} | ₹{order.pricePerCard}/item
            </p>
          </div>
        </div>

        {/* Customer */}
        <div className="bg-white rounded-lg shadow-sm p-4 grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500">Customer</p>
            <p className="font-medium">
              {order.user?.name || order.guestName}
            </p>
            <p>{order.user?.mobile || order.guestMobile}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Delivery Address</p>
            <p className="font-medium">{order.shippingAddress?.name}</p>
            <p>
              {order.shippingAddress?.addressLine1},{" "}
              {order.shippingAddress?.city}
            </p>
          </div>
        </div>

        {/* Customization */}
        {order.customization && (
          <div className="bg-white rounded-lg shadow-sm p-4 grid grid-cols-2 gap-3 text-sm">
            {order.customization.brideName && (
              <div>
                <p className="text-xs text-gray-500">Bride</p>
                <p>{order.customization.brideName}</p>
              </div>
            )}
            {order.customization.groomName && (
              <div>
                <p className="text-xs text-gray-500">Groom</p>
                <p>{order.customization.groomName}</p>
              </div>
            )}
          </div>
        )}

        {/* Status */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-2">
          {['received', 'designing', 'printing', 'dispatched', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => handleStatusUpdate(s)}
              disabled={order.status === s}
              className={`px-3 py-1 rounded text-xs capitalize ${
                order.status === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex gap-2">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded text-sm">
            Download PDF
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded text-sm">
            WhatsApp Update
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetailPage;
