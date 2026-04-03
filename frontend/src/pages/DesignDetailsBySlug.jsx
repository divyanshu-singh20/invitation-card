import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import homeDesignData from '../data/homeDesignData';
import menuData from '../data/menuData';

const DesignDetailsBySlug = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [paperType, setPaperType] = useState('standard');
  const [finishType, setFinishType] = useState('matte');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // Find design in homeDesignData
    for (const [categorySlug, designs] of Object.entries(homeDesignData)) {
      const foundDesign = designs.find(d => d.slug === slug);
      if (foundDesign) {
        setDesign(foundDesign);
        const catInfo = menuData.find(m => m.slug === categorySlug);
        setCategoryInfo(catInfo);
        break;
      }
    }
  }, [slug]);

  // Pricing logic
  const paperPrices = {
    standard: { name: 'Standard Paper', price: 0 },
    premium: { name: 'Premium Paper (250 GSM)', price: 5 },
    artcard: { name: 'Art Card (300 GSM)', price: 10 }
  };

  const finishPrices = {
    matte: { name: 'Matte Finish', price: 0 },
    glossy: { name: 'Glossy Finish', price: 3 },
    foil: { name: 'Foil Print', price: 8 }
  };

  const calculatePrice = () => {
    if (!design) return 0;
    const basePrice = design.price || 0;
    const paperCost = paperPrices[paperType]?.price || 0;
    const finishCost = finishPrices[finishType]?.price || 0;
    const pricePerCard = basePrice + paperCost + finishCost;
    return pricePerCard * quantity;
  };

  const handleCustomizeOrder = () => {
    if (!design) return;

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      // Show login prompt
      setShowLoginPrompt(true);
      return;
    }

    // Store order details in localStorage for checkout
    const orderDetails = {
      design: {
        id: design.id,
        name: design.name,
        slug: design.slug,
        image: design.image,
        basePrice: design.price
      },
      category: categoryInfo?.name || 'Design',
      quantity,
      paperType: paperPrices[paperType].name,
      finishType: finishPrices[finishType].name,
      pricePerCard: design.price + paperPrices[paperType].price + finishPrices[finishType].price,
      totalPrice: calculatePrice(),
      orderId: `ORD${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));
    navigate('/customize-details', { state: { orderDetails } });
  };

  const handleLoginRedirect = () => {
    // Save current page to return after login
    localStorage.setItem('redirectAfterLogin', `/design/${slug}`);
    navigate('/login');
  };

  if (!design) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading design...</p>
        </div>
      </div>
    );
  }

  const totalPrice = calculatePrice();
  const estimatedDeliveryDays = quantity <= 100 ? 5 : quantity <= 500 ? 7 : 10;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + estimatedDeliveryDays);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <button onClick={() => navigate('/')} className="text-gray-600 hover:text-red-600">Home</button>
            <span className="text-gray-400">/</span>
            {categoryInfo && (
              <>
                <span className="text-gray-600">{categoryInfo.name}</span>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-900 font-medium">{design.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={design.image}
                alt={design.name}
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">Product Features</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>High-quality printing on premium paper</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Customizable text, colors, and design elements</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Fast delivery across India</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Professional design with modern aesthetics</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{design.name}</h1>
              <p className="text-gray-600 mb-4">
                {categoryInfo?.name || 'Premium Design'} - Perfect for your special occasion
              </p>

              {/* Price Display */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">Base Price per Card:</span>
                  <span className="text-xl font-bold text-red-600">₹{design.price}</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-bold text-red-600">
                  <span>Total Price:</span>
                  <span>₹{totalPrice}</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">For {quantity} cards</p>
              </div>

              {/* Quantity Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity (Minimum 50 cards)
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(50, quantity - 50))}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(50, parseInt(e.target.value) || 50))}
                    className="w-24 text-center border border-gray-300 rounded-lg py-2 font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 50)}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  {[50, 100, 200, 500].map(qty => (
                    <button
                      key={qty}
                      onClick={() => setQuantity(qty)}
                      className={`px-3 py-1 text-sm rounded ${
                        quantity === qty
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {qty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Paper Type
                </label>
                <div className="space-y-2">
                  {Object.entries(paperPrices).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paperType"
                          value={key}
                          checked={paperType === key}
                          onChange={(e) => setPaperType(e.target.value)}
                          className="w-4 h-4 text-red-600"
                        />
                        <span className="text-sm">{value.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {value.price === 0 ? 'Included' : `+₹${value.price}/card`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Finish Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Finish Type
                </label>
                <div className="space-y-2">
                  {Object.entries(finishPrices).map(([key, value]) => (
                    <label key={key} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="finishType"
                          value={key}
                          checked={finishType === key}
                          onChange={(e) => setFinishType(e.target.value)}
                          className="w-4 h-4 text-red-600"
                        />
                        <span className="text-sm">{value.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {value.price === 0 ? 'Included' : `+₹${value.price}/card`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Estimate */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-blue-800">
                  <span className="text-xl">🚚</span>
                  <div>
                    <p className="font-semibold text-sm">Estimated Delivery</p>
                    <p className="text-xs">
                      {deliveryDate.toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-xs mt-1">({estimatedDeliveryDays} business days)</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCustomizeOrder}
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Customize & Order Now
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  ← Back to Designs
                </button>
              </div>

              {/* Login Prompt Modal */}
              {showLoginPrompt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-8 max-w-md mx-4 relative animate-fade-in-up">
                    <button
                      onClick={() => setShowLoginPrompt(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                    >
                      ×
                    </button>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h3>
                      <p className="text-gray-600 mb-6">
                        Please login to continue with your order. Don't have an account? Sign up in seconds!
                      </p>
                      <div className="space-y-3">
                        <button
                          onClick={handleLoginRedirect}
                          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300"
                        >
                          Login / Sign Up
                        </button>
                        <button
                          onClick={() => setShowLoginPrompt(false)}
                          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">💯</div>
                  <p className="text-xs font-semibold text-gray-700">Quality Assured</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🔒</div>
                  <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">⚡</div>
                  <p className="text-xs font-semibold text-gray-700">Fast Delivery</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🎨</div>
                  <p className="text-xs font-semibold text-gray-700">Custom Design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetailsBySlug;
