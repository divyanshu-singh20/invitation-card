import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import { designService } from '../services/api.service';

const DesignDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(100);
  const [paperType, setPaperType] = useState('standard');

  useEffect(() => {
    fetchDesign();
  }, [id]);

  const fetchDesign = async () => {
    try {
      const response = await designService.getDesignById(id);
      setDesign(response.data);
      if (response.data.paperOptions?.length > 0) {
        setPaperType(response.data.paperOptions[0].type);
      }
    } catch (error) {
      // Error fetching design
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!design) return 0;
    
    const paperOption = design.paperOptions?.find(p => p.type === paperType) || { priceMultiplier: 1 };
    const basePrice = design.pricePerHundred || design.basePrice;
    const sets = Math.ceil(quantity / 100);
    
    return Math.round(basePrice * sets * paperOption.priceMultiplier);
  };

  const handleCustomize = () => {
    navigate(`/customize/${id}`, {
      state: {
        design,
        quantity,
        paperType,
        price: calculatePrice()
      }
    });
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!design) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Design not found</h2>
          <button onClick={() => navigate('/designs')} className="btn-primary">
            Back to Designs
          </button>
        </div>
      </div>
    );
  }

  const images = design.images?.length > 0 
    ? design.images.map(img => ({
        url: typeof img === 'string' ? img : (img.url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop&q=80'),
        type: img.type || 'front'
      }))
    : [{ url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop&q=80', type: 'front' }];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/designs')}
          className="text-primary-600 hover:text-primary-700 mb-6 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Designs
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div>
              <div className="mb-4 relative group">
                <img
                  src={images[selectedImage]?.url}
                  alt={design.title}
                  className="w-full h-96 object-cover bg-gray-100 rounded-lg shadow-lg transition-all duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop&q=80';
                  }}
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
                  {images[selectedImage]?.type || 'front'} view
                </div>
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                        selectedImage === index ? 'border-primary-600 ring-2 ring-primary-300' : 'border-gray-200 hover:border-primary-400'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${design.title} - ${img.type}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=100&h=100&fit=crop&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {design.title}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {design.description}
              </p>

              <div className="mb-6 pb-6 border-b">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary-600">
                    ₹{calculatePrice()}
                  </span>
                  <span className="text-gray-500">for {quantity} cards</span>
                </div>
              </div>

              {/* Paper Type */}
              {design.paperOptions && design.paperOptions.length > 0 && (
                <div className="mb-6">
                  <label className="label">Paper Type</label>
                  <select
                    value={paperType}
                    onChange={(e) => setPaperType(e.target.value)}
                    className="input-field"
                  >
                    {design.paperOptions.map((option, index) => (
                      <option key={index} value={option.type}>
                        {option.type.charAt(0).toUpperCase() + option.type.slice(1)}
                        {option.priceMultiplier !== 1 && ` (${option.priceMultiplier}x price)`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="label">Quantity</label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(50, parseInt(e.target.value) || 50))}
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-1">Minimum order: 50 cards</p>
              </div>

              {/* Delivery */}
              <div className="mb-6">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Delivery in {design.deliveryDays || 7} days
                </div>
              </div>

              {/* Category */}
              <div className="mb-8">
                <span className="inline-block bg-primary-100 text-primary-800 px-4 py-1 rounded-full text-sm font-semibold capitalize">
                  {design.category}
                </span>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleCustomize}
                className="w-full btn-primary text-lg py-4"
              >
                Customize Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignDetailsPage;
