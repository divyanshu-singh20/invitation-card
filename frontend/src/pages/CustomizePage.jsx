import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import designsDatabase from '../data/designsDatabase';

const CustomizePage = () => {
  const { designId } = useParams();
  const navigate = useNavigate();
  
  // Find design from all categories
  const [design, setDesign] = useState(null);

  useEffect(() => {
    // Search through all categories for the design
    for (const [catSlug, designs] of Object.entries(designsDatabase)) {
      const found = designs.find(d => d.id === designId);
      if (found) {
        setDesign(found);
        break;
      }
    }
  }, [designId]);

  // Form data
  const [formData, setFormData] = useState({
    eventType: '',
    name1: '',
    name2: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    customMessage: '',
    fontStyle: 'elegant',
    fontColor: '#000000',
    bgColor: '#FFFFFF',
    quantity: 50,
    paperType: 'standard',
    finishType: 'matte'
  });

  // Pricing constants
  const paperPrices = {
    standard: 0,
    premium: 5,
    artcard: 10
  };

  const finishPrices = {
    matte: 0,
    glossy: 3,
    foil: 8
  };

  // Calculate price
  const basePrice = design ? design.price : 0;
  const paperCost = paperPrices[formData.paperType] || 0;
  const finishCost = finishPrices[formData.finishType] || 0;
  const pricePerCard = basePrice + paperCost + finishCost;
  const totalPrice = pricePerCard * formData.quantity;

  // Estimated delivery
  const estimatedDeliveryDays = formData.quantity <= 100 ? 5 : formData.quantity <= 500 ? 7 : 10;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + estimatedDeliveryDays);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save order data to localStorage (for demo)
    const orderData = {
      design,
      formData,
      pricing: {
        pricePerCard,
        totalPrice,
        quantity: formData.quantity
      },
      orderId: `ORD${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));
    navigate('/checkout');
  };

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Design Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="text-red-600 hover:text-red-700 font-semibold mb-6 inline-flex items-center"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Customize Your Card
            </h1>
            <p className="text-gray-600 mb-6">{design.name}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Type
                </label>
                <input
                  type="text"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  placeholder="e.g., Wedding, Birthday, Anniversary"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name 1 / Business Name
                  </label>
                  <input
                    type="text"
                    name="name1"
                    value={formData.name1}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="name2"
                    value={formData.name2}
                    onChange={handleChange}
                    placeholder="Second name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="Venue name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Message
                </label>
                <textarea
                  name="customMessage"
                  value={formData.customMessage}
                  onChange={handleChange}
                  placeholder="Add your personal message"
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Font & Colors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Font Style
                  </label>
                  <select
                    name="fontStyle"
                    value={formData.fontStyle}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="elegant">Elegant</option>
                    <option value="modern">Modern</option>
                    <option value="traditional">Traditional</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Font Color
                  </label>
                  <input
                    type="color"
                    name="fontColor"
                    value={formData.fontColor}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 h-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    name="bgColor"
                    value={formData.bgColor}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 h-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="10"
                  step="10"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum order: 10 cards</p>
              </div>

              {/* Paper Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Paper Type
                </label>
                <select
                  name="paperType"
                  value={formData.paperType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="standard">Standard (+₹0)</option>
                  <option value="premium">Premium (+₹5)</option>
                  <option value="artcard">Art Card (+₹10)</option>
                </select>
              </div>

              {/* Finish Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Finish Type
                </label>
                <select
                  name="finishType"
                  value={formData.finishType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="matte">Matte (+₹0)</option>
                  <option value="glossy">Glossy (+₹3)</option>
                  <option value="foil">Foil (+₹8)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                Proceed to Checkout
              </button>
            </form>
          </div>

          {/* Right: Preview & Pricing */}
          <div className="space-y-6">
            {/* Live Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Live Preview</h3>
              <div 
                className="border-2 border-gray-200 rounded-lg p-8 text-center"
                style={{ 
                  backgroundColor: formData.bgColor,
                  color: formData.fontColor,
                  fontFamily: formData.fontStyle === 'elegant' ? 'serif' : formData.fontStyle === 'modern' ? 'sans-serif' : formData.fontStyle === 'traditional' ? 'Georgia' : 'Arial Black',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <div className="space-y-4">
                  {formData.eventType && (
                    <h2 className="text-2xl font-bold">{formData.eventType}</h2>
                  )}
                  {formData.name1 && (
                    <p className="text-xl">
                      {formData.name1}
                      {formData.name2 && ` & ${formData.name2}`}
                    </p>
                  )}
                  {formData.date && (
                    <p className="text-lg">{new Date(formData.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                  )}
                  {formData.time && (
                    <p className="text-lg">{formData.time}</p>
                  )}
                  {formData.venue && (
                    <p className="text-base mt-4">{formData.venue}</p>
                  )}
                  {formData.address && (
                    <p className="text-sm">{formData.address}</p>
                  )}
                  {formData.customMessage && (
                    <p className="text-base italic mt-4">{formData.customMessage}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Base Price:</span>
                  <span>₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Paper Type:</span>
                  <span>+₹{paperCost}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Finish Type:</span>
                  <span>+₹{finishCost}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-gray-800">
                  <span>Price per Card:</span>
                  <span>₹{pricePerCard}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Quantity:</span>
                  <span>× {formData.quantity}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-xl text-red-600">
                  <span>Total Price:</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-green-800">
                    <strong>Estimated Delivery:</strong> {deliveryDate.toLocaleDateString('en-IN', { dateStyle: 'long' })} ({estimatedDeliveryDays} days)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;
