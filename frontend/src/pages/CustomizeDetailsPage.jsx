import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CustomizeDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/customize-details');
      navigate('/login');
      return;
    }

    // Get order details from location state or localStorage
    const details = location.state?.orderDetails || JSON.parse(localStorage.getItem('pendingOrder') || 'null');
    if (!details) {
      navigate('/');
      return;
    }
    setOrderDetails(details);
  }, [location, navigate]);

  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    email: '',
    phone: '',
    
    // Event Details (for invitations)
    eventName: '',
    groomName: '',
    brideName: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    address: '',
    customMessage: '',
    
    // Design Customization
    fontStyle: 'elegant',
    fontColor: '#000000',
    
    // Delivery Address
    deliveryName: '',
    deliveryPhone: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryPincode: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = 'Delivery address is required';
    if (!formData.deliveryCity.trim()) newErrors.deliveryCity = 'City is required';
    if (!formData.deliveryState.trim()) newErrors.deliveryState = 'State is required';
    if (!formData.deliveryPincode.trim()) newErrors.deliveryPincode = 'Pincode is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }
    
    // Pincode validation
    const pincodeRegex = /^\d{6}$/;
    if (formData.deliveryPincode && !pincodeRegex.test(formData.deliveryPincode)) {
      newErrors.deliveryPincode = 'Invalid pincode (6 digits required)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill all required fields correctly');
      return;
    }

    // Combine order details with form data
    const completeOrder = {
      ...orderDetails,
      customerDetails: formData,
      status: 'pending',
      paymentStatus: 'pending'
    };

    // Save to localStorage
    localStorage.setItem('completeOrder', JSON.stringify(completeOrder));
    
    // Navigate to checkout
    navigate('/checkout-payment', { state: { order: completeOrder } });
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Customize Your Order</h1>
            <p className="text-gray-600">Fill in the details to personalize your design</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                        placeholder="10-digit mobile number"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Event/Card Details */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Card Details (Optional)</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                      <input
                        type="text"
                        name="eventName"
                        value={formData.eventName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="e.g., Wedding, Birthday"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                      <input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Groom/Person 1 Name</label>
                      <input
                        type="text"
                        name="groomName"
                        value={formData.groomName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bride/Person 2 Name</label>
                      <input
                        type="text"
                        name="brideName"
                        value={formData.brideName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Time</label>
                      <input
                        type="time"
                        name="eventTime"
                        value={formData.eventTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                      <input
                        type="text"
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Enter venue name"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Full venue address"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Custom Message</label>
                      <textarea
                        name="customMessage"
                        value={formData.customMessage}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Any special message or instructions for the card design..."
                      />
                    </div>
                  </div>
                </div>

                {/* Design Preferences */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Design Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Font Style</label>
                      <select
                        name="fontStyle"
                        value={formData.fontStyle}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="elegant">Elegant</option>
                        <option value="modern">Modern</option>
                        <option value="traditional">Traditional</option>
                        <option value="decorative">Decorative</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Font Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          name="fontColor"
                          value={formData.fontColor}
                          onChange={handleChange}
                          className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.fontColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, fontColor: e.target.value }))}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Address <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        rows="2"
                        className={`w-full px-4 py-2 border ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                        placeholder="House/Flat No., Street, Area"
                      />
                      {errors.deliveryAddress && <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="deliveryCity"
                        value={formData.deliveryCity}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.deliveryCity ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                        placeholder="Enter city"
                      />
                      {errors.deliveryCity && <p className="text-red-500 text-xs mt-1">{errors.deliveryCity}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="deliveryState"
                        value={formData.deliveryState}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.deliveryState ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                        placeholder="Enter state"
                      />
                      {errors.deliveryState && <p className="text-red-500 text-xs mt-1">{errors.deliveryState}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        name="deliveryPincode"
                        value={formData.deliveryPincode}
                        onChange={handleChange}
                        maxLength="6"
                        className={`w-full px-4 py-2 border ${errors.deliveryPincode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                        placeholder="6-digit pincode"
                      />
                      {errors.deliveryPincode && <p className="text-red-500 text-xs mt-1">{errors.deliveryPincode}</p>}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Proceed to Payment →
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="mb-4">
                  <img
                    src={orderDetails.design.image}
                    alt={orderDetails.design.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Design</p>
                    <p className="font-semibold text-gray-800">{orderDetails.design.name}</p>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Quantity</span>
                      <span className="font-medium">{orderDetails.quantity} cards</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Paper Type</span>
                      <span className="font-medium">{orderDetails.paperType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Finish Type</span>
                      <span className="font-medium">{orderDetails.finishType}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Price per card</span>
                      <span className="font-medium">₹{orderDetails.pricePerCard}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-red-600">
                      <span>Total Amount</span>
                      <span>₹{orderDetails.totalPrice}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg text-sm">
                    <span>✓</span>
                    <span className="font-medium">Free delivery on all orders</span>
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

export default CustomizeDetailsPage;
