import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (!order) {
      navigate('/');
    } else {
      // Create confetti effect
      createConfetti();
      
      // Play celebration sound (optional)
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBi+J0/LTgTQJGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+zPLaizsKGGS56+OZSAwNUKzn77ZqHgU7l9r1xnMpBSp+');
      // audio.play().catch(() => {}); // Ignore if autoplay blocked
    }
  }, [order, navigate]);

  const createConfetti = () => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581'];
    const confettiCount = 100;
    const confettiArray = [];

    for (let i = 0; i < confettiCount; i++) {
      confettiArray.push({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 3,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
      });
    }

    setConfetti(confettiArray);

    // Clear confetti after 5 seconds
    setTimeout(() => {
      setConfetti([]);
    }, 5000);
  };

  if (!order) {
    return null;
  }

  const whatsappMessage = encodeURIComponent(
    `Hi! I have successfully placed an order.\nOrder ID: ${order.orderId}\nThank you!`
  );

  return (
    <div className="min-h-screen bg-gray-50 py-16 relative overflow-hidden">
      {/* Confetti/Firecracker Effect */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.animationDelay}s`,
            backgroundColor: piece.backgroundColor,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
          }}
        />
      ))}

      {/* Firework Bursts */}
      <div className="firework-container">
        <div className="firework" style={{ left: '20%', top: '20%', animationDelay: '0s' }}></div>
        <div className="firework" style={{ left: '80%', top: '30%', animationDelay: '0.5s' }}></div>
        <div className="firework" style={{ left: '50%', top: '40%', animationDelay: '1s' }}></div>
        <div className="firework" style={{ left: '30%', top: '60%', animationDelay: '1.5s' }}></div>
        <div className="firework" style={{ left: '70%', top: '70%', animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center animate-fade-in-up">
            {/* Success Icon with pulse animation */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-pulse">
              🎉 Order Placed Successfully! 🎉
            </h1>

            <p className="text-gray-600 mb-8">
              Thank you for your order. We'll start working on your beautiful invitation cards right away.
            </p>

            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">{order.quantity} cards</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold text-primary-600">₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`font-semibold capitalize ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-semibold">
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* My Orders - Most Prominent */}
              <Link
                to="/my-orders"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                View My Orders
              </Link>

              <a
                href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
              >
                <span className="text-xl">📱</span>
                Confirm on WhatsApp
              </a>

              <Link
                to={`/track-order?orderId=${order.orderId}`}
                className="block w-full btn-primary"
              >
                Track Your Order
              </Link>

              <Link
                to="/designs"
                className="block w-full btn-outline"
              >
                Browse More Designs
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-sm text-gray-500">
              <p>
                A confirmation message has been sent to your mobile number.
                <br />
                For any queries, contact us at +91 9876543210
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
