import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/checkout-payment');
      navigate('/login');
      return;
    }

    const orderData = location.state?.order || JSON.parse(localStorage.getItem('completeOrder') || 'null');
    if (!orderData) {
      navigate('/');
      return;
    }
    setOrder(orderData);
  }, [location, navigate]);

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Generate unique order ID
      const finalOrderId = `ORD${Date.now()}`;
      
      // Save order to localStorage (in real app, this would go to backend)
      const finalOrder = {
        ...order,
        orderId: finalOrderId,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
        orderStatus: 'confirmed',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Save to orders history
      const existingOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      existingOrders.unshift(finalOrder);
      localStorage.setItem('myOrders', JSON.stringify(existingOrders));

      // Clear pending orders
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('completeOrder');

      setProcessing(false);
      
      // Navigate to success page
      navigate('/order-success', { 
        state: { 
          order: finalOrder,
          isNewOrder: true
        }
      });
    }, 2000);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Payment</h1>
            <p className="text-gray-600">Choose your payment method and confirm order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Review */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Review</h2>
                <div className="flex gap-4">
                  <img
                    src={order.design.image}
                    alt={order.design.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{order.design.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">Quantity: {order.quantity} cards</p>
                    <p className="text-sm text-gray-600">{order.paperType} • {order.finishType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">₹{order.totalPrice}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Address</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800">{order.customerDetails.fullName}</p>
                  <p className="text-sm text-gray-600 mt-2">{order.customerDetails.deliveryAddress}</p>
                  <p className="text-sm text-gray-600">
                    {order.customerDetails.deliveryCity}, {order.customerDetails.deliveryState} - {order.customerDetails.deliveryPincode}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Phone: {order.customerDetails.phone}</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Payment Method</h2>
                
                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-red-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💵</span>
                        <div>
                          <p className="font-semibold text-gray-800">Cash on Delivery</p>
                          <p className="text-xs text-gray-600">Pay when you receive your order</p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* UPI */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-red-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">📱</span>
                        <div>
                          <p className="font-semibold text-gray-800">UPI / PhonePe / Google Pay</p>
                          <p className="text-xs text-gray-600">Pay instantly via UPI apps</p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Debit/Credit Card */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-red-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💳</span>
                        <div>
                          <p className="font-semibold text-gray-800">Debit / Credit Card</p>
                          <p className="text-xs text-gray-600">Visa, Mastercard, Rupay accepted</p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'netbanking' ? 'border-red-600 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-red-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🏦</span>
                        <div>
                          <p className="font-semibold text-gray-800">Net Banking</p>
                          <p className="text-xs text-gray-600">Pay via your bank account</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Payment Info */}
                {paymentMethod === 'cod' && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> You can pay in cash when the order is delivered to you. Please keep exact change ready.
                    </p>
                  </div>
                )}

                {paymentMethod !== 'cod' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Secure Payment:</strong> You will be redirected to secure payment gateway to complete the transaction.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={processing}
                  className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 disabled:opacity-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={processing}
                  className="flex-1 bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      Processing...
                    </span>
                  ) : (
                    'Confirm & Place Order'
                  )}
                </button>
              </div>
            </div>

            {/* Right: Price Breakdown */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Price Details</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cards ({order.quantity} qty)</span>
                    <span className="font-medium">₹{order.design.basePrice * order.quantity}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paper & Finish</span>
                    <span className="font-medium">
                      ₹{(order.pricePerCard - order.design.basePrice) * order.quantity}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-green-600">
                    <span>Delivery Charges</span>
                    <span className="font-medium">FREE</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total Amount</span>
                      <span className="text-red-600">₹{order.totalPrice}</span>
                    </div>
                  </div>
                  
                  {paymentMethod !== 'cod' && (
                    <div className="flex justify-between text-green-600 text-xs">
                      <span>Instant Discount (Online Payment)</span>
                      <span className="font-medium">-₹0</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-green-600">✓</span>
                    <span>100% Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-green-600">✓</span>
                    <span>Free Doorstep Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="text-green-600">✓</span>
                    <span>Quality Assured Printing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentPage;
