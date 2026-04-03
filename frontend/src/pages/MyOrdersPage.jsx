import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import ReviewModal from '../components/ReviewModal';
import { orderService } from '../services/api.service';
import { getImageUrl } from '../utils/api';
import api from '../utils/api';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewedOrders, setReviewedOrders] = useState(new Set());
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const fetchOrders = useCallback(async () => {
    try {
      // Try to fetch from API if user is logged in
      if (user) {
        const response = await orderService.getUserOrders(user.id);
        setOrders(response.data);
        
        // Check which orders have been reviewed
        const orderIds = response.data.map(o => o._id);
        await checkReviewedOrders(orderIds);
      } else {
        // Fallback to localStorage for demo
        const localOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
        setOrders(localOrders);
      }
    } catch (error) {
      // Fallback to localStorage on error
      const localOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      setOrders(localOrders);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const checkReviewedOrders = async (orderIds) => {
    try {
      // Check each order if it has been reviewed
      const promises = orderIds.map(orderId => 
        api.get(`/reviews/can-review/${orderId}`).catch(() => ({ data: { canReview: false } }))
      );
      const results = await Promise.all(promises);
      
      const reviewed = new Set();
      results.forEach((result, index) => {
        if (!result.data.canReview && result.data.message === 'You have already reviewed this order') {
          reviewed.add(orderIds[index]);
        }
      });
      setReviewedOrders(reviewed);
    } catch (error) {
      console.error('Error checking reviewed orders:', error);
    }
  };

  const handleWriteReview = (order) => {
    setSelectedOrder(order);
    setShowReviewModal(true);
  };

  const handleReviewSuccess = (review) => {
    setReviewedOrders(prev => new Set([...prev, selectedOrder._id]));
    // Optionally show a success message
    alert('Thank you for your review!');
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status) => {
    const colors = {
      ordered: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      printing: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleReorder = (order) => {
    // Navigate to product details page based on available info
    if (order.productInfo?.slug) {
      navigate(`/product/${order.productInfo.slug}`);
    } else if (order.design?._id) {
      navigate(`/design/${order.design._id}`);
    } else {
      navigate('/designs');
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <Link to="/designs" className="btn-primary">
            Browse Designs
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8">
              Start browsing our beautiful wedding invitation designs
            </p>
            <Link to="/designs" className="btn-primary">
              Explore Designs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-xl font-bold mb-2">
                        Order #{order.orderId}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-4 py-2 rounded-full font-semibold capitalize text-sm ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`mt-2 text-sm ${
                        order.paymentStatus === 'completed' || order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        Payment: {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Product Image */}
                    <div className="md:col-span-2">
                      <img
                        src={getImageUrl(
                          order.productInfo?.image || 
                          order.design?.image || 
                          order.design?.images?.[0]?.url ||
                          '/placeholder-card.png'
                        )}
                        alt={order.productInfo?.title || order.design?.name || order.design?.title}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="md:col-span-6">
                      <h3 className="font-semibold text-lg mb-2">
                        {order.productInfo?.title || order.design?.name || order.design?.title || 'Custom Design'}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Quantity: {order.quantity} cards</p>
                        {order.paperType && <p>Paper Type: {order.paperType}</p>}
                        {order.finishType && <p>Finish: {order.finishType}</p>}
                        {order.orderType && (
                          <p className="text-blue-600">
                            Type: {order.orderType === 'contact' ? 'Quick Order (Call/WhatsApp)' : 'Full Details Provided'}
                          </p>
                        )}
                        {order.quickContact && (
                          <p>Contact: {order.quickContact.fullName} - {order.quickContact.mobileNumber}</p>
                        )}
                        {order.customerDetails && (
                          <>
                            {order.customerDetails.groomName && <p>Groom: {order.customerDetails.groomName}</p>}
                            {order.customerDetails.brideName && <p>Bride: {order.customerDetails.brideName}</p>}
                            {order.customerDetails.eventName && <p>Event: {order.customerDetails.eventName}</p>}
                          </>
                        )}
                        {order.cardDetails && (
                          <>
                            {order.cardDetails.groomFullName && <p>Groom: {order.cardDetails.groomFullName}</p>}
                            {order.cardDetails.brideFullName && <p>Bride: {order.cardDetails.brideFullName}</p>}
                            {order.cardDetails.weddingDate && <p>Wedding: {order.cardDetails.weddingDate}</p>}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="md:col-span-4 flex flex-col justify-between items-end">
                      <div className="text-right mb-4">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-primary-600">
                          ₹{order.totalPrice || order.totalAmount}
                        </p>
                      </div>

                      <div className="flex flex-col w-full space-y-2">
                        <Link
                          to={`/track-order?orderId=${order.orderId}`}
                          className="btn-primary text-center text-sm py-2"
                        >
                          Track Order
                        </Link>
                        {order.orderStatus === 'delivered' && !reviewedOrders.has(order._id) && (
                          <button
                            onClick={() => handleWriteReview(order)}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-sm py-2 px-4 rounded-lg transition-colors font-medium"
                          >
                            Write Review
                          </button>
                        )}
                        {reviewedOrders.has(order._id) && (
                          <div className="text-center text-sm text-green-600 py-2">
                            ✓ Reviewed
                          </div>
                        )}
                        <button
                          onClick={() => handleReorder(order)}
                          className="btn-outline text-sm py-2"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {order.estimatedDelivery && order.orderStatus !== 'delivered' && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm">
                        <strong>Estimated Delivery:</strong>{' '}
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  {/* Delivered */}
                  {order.orderStatus === 'delivered' && (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-green-800 font-medium">
                        Delivered successfully
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedOrder && (
        <ReviewModal
          order={selectedOrder}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedOrder(null);
          }}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default MyOrdersPage;
