import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { orderService } from '../services/api.service';
import api, { getImageUrl } from '../utils/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Support both old and new state formats
  const { 
    // New format from ProductDetailPage
    product, 
    cardDetails, 
    quickContact, 
    orderType,
    orderNote,
    // Old format (for backward compatibility)
    design, 
    customization, 
    quantity: stateQuantity, 
    paperType, 
    price: statePrice 
  } = location.state || {};

  // Use product or design (for backward compatibility)
  const productData = product || design;
  const quantity = stateQuantity || 100;
  const price = statePrice || ((productData?.basePrice || 20) * quantity);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [address, setAddress] = useState({
    name: quickContact?.fullName || '',
    mobile: quickContact?.mobileNumber || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  React.useEffect(() => {
    if (!productData) {
      navigate('/');
    }
  }, [productData, navigate]);

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (orderData) => {
    const res = await loadRazorpayScript();
    
    if (!res) {
      alert('Razorpay SDK failed to load. Please check your internet connection.');
      return;
    }

    // Configure Razorpay to open selected payment method directly
    const getPaymentConfig = () => {
      switch (paymentMethod) {
        case 'upi':
          return {
            display: {
              blocks: {
                upi: {
                  name: 'UPI Payment',
                  instruments: [
                    { method: 'upi', flows: ['qr', 'collect', 'intent'] }
                  ]
                }
              },
              sequence: ['block.upi'],
              preferences: { show_default_blocks: false }
            }
          };
        case 'card':
          return {
            display: {
              blocks: {
                card: {
                  name: 'Card Payment',
                  instruments: [
                    { method: 'card' }
                  ]
                }
              },
              sequence: ['block.card'],
              preferences: { show_default_blocks: false }
            }
          };
        case 'netbanking':
          return {
            display: {
              blocks: {
                netbanking: {
                  name: 'Net Banking',
                  instruments: [
                    { method: 'netbanking' }
                  ]
                }
              },
              sequence: ['block.netbanking'],
              preferences: { show_default_blocks: false }
            }
          };
        case 'wallet':
          return {
            display: {
              blocks: {
                wallet: {
                  name: 'Wallet Payment',
                  instruments: [
                    { method: 'wallet', wallets: ['paytm', 'phonepe', 'amazonpay', 'mobikwik', 'freecharge'] }
                  ]
                }
              },
              sequence: ['block.wallet'],
              preferences: { show_default_blocks: false }
            }
          };
        default:
          return {
            display: {
              preferences: { show_default_blocks: true }
            }
          };
      }
    };

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_RHEYsHtNLxCDbx',
      amount: orderData.razorpayOrder.amount,
      currency: 'INR',
      name: 'Shadi Card',
      description: `Wedding Invitation Cards - Order #${orderData.order.orderId}`,
      image: 'https://i.imgur.com/3g7nmJC.png',
      order_id: orderData.razorpayOrder.id,
      handler: async function (response) {
        try {
          setLoading(true);
          
          // Verify payment with backend
          const verifyResponse = await orderService.verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: orderData.order.orderId,
            paymentMethod: response.method || 'upi'
          });
          
          if (verifyResponse.success) {
            // Clear cart after successful payment
            if (user) {
              localStorage.removeItem(`${user.id || user._id}_cart`);
            } else {
              localStorage.removeItem('guest_cart');
            }
            
            // Navigate to success page
            navigate('/order-success', {
              state: { order: verifyResponse.order || orderData.order }
            });
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          alert('Payment verification failed. Your order is on hold. Please contact support with Order ID: ' + orderData.order.orderId);
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: address.name,
        contact: address.mobile,
        email: ''
      },
      notes: {
        address: `${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}`
      },
      theme: {
        color: '#dc2626',
        backdrop_color: 'rgba(0,0,0,0.6)'
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
        },
        escape: true,
        animation: true
      },
      config: getPaymentConfig()
    };

    const paymentObject = new window.Razorpay(options);
    
    paymentObject.on('payment.failed', async function(response) {
      console.error('Payment failed:', response);
      setLoading(true);
      
      try {
        // Update order status to failed
        await api.post('/orders/payment-failed', {
          orderId: orderData.order.orderId,
          errorCode: response.error.code,
          errorDescription: response.error.description
        });
      } catch (err) {
        console.error('Error updating failed payment:', err);
      }
      
      alert(`Payment Failed: ${response.error.description}. Order ID: ${orderData.order.orderId}. Please try again or contact support.`);
      setLoading(false);
    });
    
    paymentObject.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate address
    if (!address.name || !address.mobile || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
      alert('Please fill in all address fields');
      return;
    }
    
    // Validate mobile number
    if (!/^\d{10}$/.test(address.mobile)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setLoading(true);

    try {
      const calculatedPrice = productData?.basePrice || productData?.price || 20;
      const calculatedQuantity = quantity || 100;
      const calculatedTotal = price || (calculatedPrice * calculatedQuantity);
      
      const orderData = {
        // Store product info for both static and DB products
        productInfo: {
          id: productData._id || productData.id || productData.slug,
          name: productData.title || productData.name,
          slug: productData.slug,
          price: calculatedPrice,
          image: productData.images?.[0]?.url || productData.image
        },
        quantity: calculatedQuantity,
        pricePerCard: calculatedPrice,
        totalAmount: calculatedTotal,
        shippingAddress: {
          name: address.name,
          mobile: address.mobile,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2 || '',
          city: address.city,
          state: address.state,
          pincode: address.pincode
        },
        paymentMethod: paymentMethod || 'online',
        deliveryDays: productData?.deliveryDays || 7,
        orderType: orderType || 'manual',
        orderNote: orderNote || ''
      };

      // Add card details or quick contact based on order type
      if (orderType === 'contact') {
        orderData.quickContact = quickContact;
        orderData.orderNote = 'Details will be shared on call';
      } else if (cardDetails) {
        orderData.cardDetails = cardDetails;
      } else if (customization) {
        orderData.customization = customization._id || customization;
      }

      // Add user or guest info
      if (user) {
        orderData.user = user.id || user._id;
      } else {
        orderData.guestName = address.name;
        orderData.guestMobile = address.mobile;
      }

      console.log('Sending order data:', orderData);

      const response = await orderService.createOrder(orderData);

      // Always use online payment
      await handlePayment(response.data);
    } catch (error) {
      console.error('Order error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.details 
        ? error.response.data.details.map(d => `${d.field}: ${d.message}`).join(', ')
        : error.response?.data?.message || 'Error placing order. Please try again.';
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!productData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6">
      {loading && <Loader fullScreen />}
      
      <div className="container mx-auto px-3 sm:px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">🛒 Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Order Type Badge */}
              {orderType && (
                <div className={`p-3 rounded-lg border ${
                  orderType === 'contact' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {orderType === 'contact' ? (
                      <>
                        <span className="text-2xl">📞</span>
                        <div>
                          <p className="font-semibold text-green-800">Quick Order - Contact for Details</p>
                          <p className="text-sm text-green-600">Our team will call you to collect card details</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">📝</span>
                        <div>
                          <p className="font-semibold text-red-800">Self Customization Order</p>
                          <p className="text-sm text-red-600">Card details have been submitted</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
                <h2 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                  <span>📍</span> Delivery Address
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={address.name}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Enter full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={address.mobile}
                      onChange={handleAddressChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="10 digit mobile number"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="House no, Building name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 2</label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={address.addressLine2}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Street, Area, Landmark"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      required
                      pattern="[0-9]{6}"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="6 digit pincode"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
                <h2 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                  <span>💳</span> Payment Method
                  <span className="ml-auto text-xs text-green-600 font-medium bg-green-100 px-2 py-0.5 rounded-full">🔒 Secure</span>
                </h2>
                
                <div className="space-y-2">
                  {/* UPI Option */}
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-red-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-semibold text-gray-800 text-sm">UPI</div>
                      <div className="text-xs text-gray-500">Google Pay, PhonePe, Paytm, BHIM</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-5" />
                    </div>
                  </label>

                  {/* Card Option */}
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'card' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-red-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-semibold text-gray-800 text-sm">Credit / Debit Card</div>
                      <div className="text-xs text-gray-500">Visa, Mastercard, Rupay</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                    </div>
                  </label>

                  {/* Net Banking Option */}
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'netbanking' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-red-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-semibold text-gray-800 text-sm">Net Banking</div>
                      <div className="text-xs text-gray-500">All Indian Banks supported</div>
                    </div>
                    <span className="text-xl">🏦</span>
                  </label>

                  {/* Wallet Option */}
                  <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'wallet' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === 'wallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-red-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-semibold text-gray-800 text-sm">Wallet</div>
                      <div className="text-xs text-gray-500">Amazon Pay, Mobikwik, Freecharge</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Amazon_Pay_logo.svg" alt="Amazon Pay" className="h-4" />
                    </div>
                  </label>
                </div>

                {/* Security Badge */}
                <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>100% Secure Payment via Razorpay</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-base py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Place Order - ₹{price}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 sticky top-20">
              <h2 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2">
                <span>🛍️</span> Order Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <img
                    src={getImageUrl(productData.images?.[0]?.url || productData.image)}
                    alt={productData.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm text-gray-800">{productData.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">Qty: {quantity} cards</p>
                    <p className="text-sm font-semibold text-red-600 mt-1">₹{productData?.basePrice || 20}/card</p>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
                    <span>Total:</span>
                    <span className="text-red-600">₹{price}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-2 rounded-lg text-xs text-green-800 border border-green-200">
                  <div className="flex items-center gap-2">
                    <span>🚚</span>
                    <span className="font-medium">Delivery: {productData.deliveryDays || 7} working days</span>
                  </div>
                </div>

                {/* Order Type Info */}
                {orderType === 'contact' && (
                  <div className="bg-amber-50 p-2 rounded-lg text-xs text-amber-800 border border-amber-200">
                    <div className="flex items-center gap-2">
                      <span>📝</span>
                      <span className="font-medium">Details will be shared on call</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
