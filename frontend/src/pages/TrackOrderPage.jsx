import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Order status steps
  const statusSteps = [
    { id: 1, name: 'Design Submitted', icon: '📝' },
    { id: 2, name: 'Approved', icon: '✅' },
    { id: 3, name: 'Printing', icon: '🖨️' },
    { id: 4, name: 'Dispatched', icon: '📦' },
    { id: 5, name: 'Delivered', icon: '🎉' }
  ];

  const handleTrack = (e) => {
    e.preventDefault();
    
    // Demo: Simulate order tracking
    if (orderId.startsWith('ORD')) {
      // Create dummy order data
      const dummyOrder = {
        orderId: orderId,
        status: 'Printing',
        currentStep: 3,
        designName: 'Royal Red Wedding Card',
        quantity: 100,
        totalPrice: 2500,
        orderDate: '2024-12-20',
        estimatedDelivery: '2024-12-27',
        timeline: [
          { status: 'Design Submitted', date: '2024-12-20 10:30 AM', completed: true },
          { status: 'Approved', date: '2024-12-21 02:15 PM', completed: true },
          { status: 'Printing', date: '2024-12-23 09:00 AM', completed: true },
          { status: 'Dispatched', date: 'Pending', completed: false },
          { status: 'Delivered', date: 'Pending', completed: false }
        ]
      };
      
      setOrderData(dummyOrder);
      setError('');
    } else {
      setError('Invalid Order ID. Please check and try again.');
      setOrderData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Track Your Order
            </h1>
            <p className="text-gray-600">
              Enter your order ID to check the status
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleTrack} className="flex gap-3">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g., ORD1234567890)"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Track
              </button>
            </form>
            {error && (
              <p className="text-red-600 text-sm mt-3">{error}</p>
            )}
          </div>

          {/* Order Status */}
          {orderData && (
            <div className="space-y-6">
              {/* Order Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      Order #{orderData.orderId}
                    </h2>
                    <p className="text-gray-600">{orderData.designName}</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold text-sm">
                    {orderData.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                    <p className="text-lg font-semibold text-gray-800">{orderData.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Price</p>
                    <p className="text-lg font-semibold text-gray-800">₹{orderData.totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order Date</p>
                    <p className="text-lg font-semibold text-gray-800">{new Date(orderData.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Est. Delivery</p>
                    <p className="text-lg font-semibold text-gray-800">{new Date(orderData.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Order Timeline</h3>
                
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  {orderData.timeline.map((item, index) => (
                    <div key={index} className="relative flex items-start mb-8 last:mb-0">
                      {/* Icon */}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        item.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {statusSteps[index].icon}
                      </div>

                      {/* Content */}
                      <div className="ml-6 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-semibold ${
                              item.completed ? 'text-gray-800' : 'text-gray-400'
                            }`}>
                              {item.status}
                            </h4>
                            <p className={`text-sm ${
                              item.completed ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {item.date}
                            </p>
                          </div>
                          {item.completed && (
                            <div className="text-green-600 font-semibold text-sm">
                              ✓ Completed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}

          {/* Help Section */}
          {!orderData && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                You can find your Order ID in the confirmation email or SMS sent after placing your order.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Contact Customer Support →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
