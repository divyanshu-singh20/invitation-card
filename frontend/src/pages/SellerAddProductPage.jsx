import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerLayout from '../components/SellerLayout';
import api from '../utils/api';

const SellerAddProductPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const tagsDropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Images state
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  
  // Tags dropdown state
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
        setShowTagsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // All available tags
  const allTags = [
    // Style
    { group: 'Style', tags: ['royal', 'elegant', 'modern', 'traditional', 'luxury', 'premium', 'budget-friendly', 'minimalist', 'classic', 'vintage', 'contemporary', 'artistic', 'creative', 'designer', 'handcrafted'] },
    // Theme
    { group: 'Theme', tags: ['floral', 'paisley', 'mandala', 'peacock', 'lotus', 'kalash', 'ganesh', 'om', 'swastik', 'geometric', 'abstract', 'nature', 'royal-theme', 'palace', 'heritage'] },
    // Color
    { group: 'Color', tags: ['gold', 'silver', 'red', 'maroon', 'pink', 'blue', 'green', 'white', 'cream', 'ivory', 'multi-color', 'pastel', 'bright', 'dark', 'metallic'] },
    // Religion/Culture
    { group: 'Religion/Culture', tags: ['hindu', 'muslim', 'christian', 'sikh', 'jain', 'buddhist', 'south-indian', 'north-indian', 'rajasthani', 'gujarati', 'marathi', 'bengali', 'punjabi', 'tamil', 'telugu'] },
    // Occasion
    { group: 'Occasion', tags: ['wedding', 'engagement', 'reception', 'sangeet', 'mehndi', 'haldi', 'birthday', 'anniversary', 'baby-shower', 'naming-ceremony', 'mundan', 'thread-ceremony', 'retirement', 'farewell', 'graduation'] },
    // Material
    { group: 'Material', tags: ['paper', 'cardstock', 'handmade-paper', 'velvet', 'satin', 'silk', 'laser-cut', 'embossed', 'foil-stamped', 'matte', 'glossy', 'textured', 'eco-friendly', 'recycled'] },
    // Features
    { group: 'Features', tags: ['with-envelope', 'box-packing', 'ribbon', 'tassel', 'wax-seal', 'customizable', 'personalized', 'photo-insert', 'multi-fold', 'scroll', 'gate-fold', 'pocket-fold', 'single-fold'] },
    // Price Range
    { group: 'Price', tags: ['budget', 'mid-range', 'premium', 'luxury', 'value-for-money', 'best-seller', 'new-arrival', 'trending', 'popular'] },
    // Printing
    { group: 'Printing', tags: ['offset-print', 'digital-print', 'screen-print', 'letterpress', 'foil-print', 'uv-print', 'emboss-print', 'deboss-print', 'hot-foil', 'gold-foil', 'silver-foil'] },
    // Size
    { group: 'Size', tags: ['small', 'medium', 'large', 'a4', 'a5', 'a6', 'square', 'portrait', 'landscape', 'custom-size'] }
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    basePrice: '',
    pricePerHundred: '',
    discountPercent: '',
    minOrderQuantity: '50',
    deliveryDays: '7'
  });

  // Specifications
  const [specifications, setSpecifications] = useState({
    size: '8x4 inches',
    weight: '',
    material: '',
    printType: 'offset'
  });

  // Paper options
  const [paperOptions, setPaperOptions] = useState([
    { type: 'Matt Paper', gsm: 300, priceMultiplier: 1 }
  ]);

  // Colors
  const [colors, setColors] = useState([
    { name: 'Gold', code: '#FFD700' }
  ]);

  const categories = [
    { value: 'wedding-printing', label: 'Wedding Printing' },
    { value: 'birthday-anniversary', label: 'Birthday & Anniversary' },
    { value: 'grih-pravesh-puja', label: 'Grih Pravesh / Puja' },
    { value: 'business-printing', label: 'Business Printing' },
    { value: 'flex-banner-poster', label: 'Flex / Banner / Poster' },
    { value: 'shop-office-opening', label: 'Shop / Office Opening' },
    { value: 'religious-events', label: 'Religious Events' },
    { value: 'school-college-printing', label: 'School / College Printing' },
    { value: 'stickers-labels', label: 'Stickers & Labels' },
    { value: 'condolence-shraddh', label: 'Condolence / Shraddh' },
    { value: 'calendars-diaries', label: 'Calendars & Diaries' },
    { value: 'certificates-awards', label: 'Certificates & Awards' },
    { value: 'digital-invitations', label: 'Digital Invitations' },
    { value: 'personalized-gifts', label: 'Personalized Gifts' }
  ];

  const printTypes = [
    { value: 'offset', label: 'Offset Printing' },
    { value: 'digital', label: 'Digital Printing' },
    { value: 'screen', label: 'Screen Printing' },
    { value: 'foil', label: 'Foil Stamping' },
    { value: 'embossed', label: 'Embossed' },
    { value: 'letterpress', label: 'Letterpress' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setSpecifications(prev => ({ ...prev, [name]: value }));
  };

  // Image handling
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageError('');
    
    // Check total count
    if (images.length + files.length > 10) {
      setImageError('Maximum 10 images allowed');
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        setImageError('Only JPG, PNG, WEBP allowed');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Each image must be under 5MB');
        return false;
      }
      return true;
    });

    // Create preview URLs
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  // Paper options handling
  const addPaperOption = () => {
    setPaperOptions(prev => [...prev, { type: '', gsm: '', priceMultiplier: 1 }]);
  };

  const updatePaperOption = (index, field, value) => {
    setPaperOptions(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const removePaperOption = (index) => {
    setPaperOptions(prev => prev.filter((_, i) => i !== index));
  };

  // Colors handling
  const addColor = () => {
    setColors(prev => [...prev, { name: '', code: '#000000' }]);
  };

  const updateColor = (index, field, value) => {
    setColors(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const removeColor = (index) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setImageError('');

    // Validate images
    if (images.length < 2) {
      setImageError('Minimum 2 images are required');
      return;
    }
    if (images.length > 10) {
      setImageError('Maximum 10 images allowed');
      return;
    }

    // Validate required fields
    if (!formData.title || !formData.description || !formData.category || !formData.basePrice || !formData.pricePerHundred) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('sellerToken');
      
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append images
      images.forEach(img => {
        submitData.append('images', img.file);
      });

      // Append other data
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('subCategory', formData.subCategory);
      submitData.append('basePrice', formData.basePrice);
      submitData.append('pricePerHundred', formData.pricePerHundred);
      submitData.append('discountPercent', formData.discountPercent || 0);
      submitData.append('minOrderQuantity', formData.minOrderQuantity);
      submitData.append('deliveryDays', formData.deliveryDays);
      submitData.append('specifications', JSON.stringify(specifications));
      submitData.append('paperOptions', JSON.stringify(paperOptions.filter(p => p.type)));
      submitData.append('colors', JSON.stringify(colors.filter(c => c.name)));
      submitData.append('tags', JSON.stringify(selectedTags));

      const response = await api.post('/seller/products', submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess('Product added successfully and is now live!');
        setTimeout(() => {
          navigate('/seller/products');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-600">Add wedding card design to your shop</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Images Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Product Images <span className="text-red-500">*</span>
              <span className="text-sm font-normal text-gray-500 ml-2">(Min 2, Max 10)</span>
            </h2>
            
            {imageError && (
              <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm mb-4">
                {imageError}
              </div>
            )}

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={img.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-orange-500 text-white text-xs rounded">Main</span>
                  )}
                </div>
              ))}
              
              {images.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-orange-400 hover:bg-orange-50 transition-colors"
                >
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs text-gray-500 mt-1">Add Image</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />

            <p className="text-sm text-gray-500">
              Upload high quality images (JPG, PNG, WEBP). First image will be the main image.
            </p>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g., Royal Gold Hindu Wedding Card"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Describe your wedding card design in detail..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                  <input
                    type="text"
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g., Rajasthani Style"
                  />
                </div>
              </div>

              {/* Tags Multi-Select Dropdown */}
              <div className="relative" ref={tagsDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags <span className="text-gray-500 font-normal">(Select multiple)</span>
                </label>
                
                {/* Selected Tags Display */}
                <div 
                  onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-gray-100 rounded-xl cursor-pointer border-2 border-transparent focus-within:ring-2 focus-within:ring-orange-400 min-h-[44px] md:min-h-[48px] flex flex-wrap gap-1.5 md:gap-2 items-center"
                >
                  {selectedTags.length > 0 ? (
                    selectedTags.map(tag => (
                      <span 
                        key={tag} 
                        className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 md:py-1 rounded-lg text-xs md:text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTags(prev => prev.filter(t => t !== tag));
                          }}
                          className="hover:text-orange-900"
                        >
                          <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">Click to select tags...</span>
                  )}
                  <svg className={`w-4 h-4 md:w-5 md:h-5 text-gray-400 ml-auto transition-transform flex-shrink-0 ${showTagsDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Tags Dropdown */}
                {showTagsDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 md:max-h-80 overflow-y-auto">
                    {/* Quick Actions */}
                    <div className="sticky top-0 bg-white px-3 md:px-4 py-2 border-b border-gray-100 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTags([])}
                        className="text-xs md:text-sm text-gray-500 hover:text-red-600"
                      >
                        Clear All
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowTagsDropdown(false)}
                        className="ml-auto text-xs md:text-sm text-orange-600 font-medium"
                      >
                        Done ({selectedTags.length})
                      </button>
                    </div>

                    {/* Tags by Group */}
                    {allTags.map(group => (
                      <div key={group.group} className="border-b border-gray-100 last:border-0">
                        <div className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 font-medium text-xs md:text-sm text-gray-700 sticky top-10">
                          {group.group}
                        </div>
                        <div className="px-3 md:px-4 py-2 flex flex-wrap gap-1.5 md:gap-2">
                          {group.tags.map(tag => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                if (selectedTags.includes(tag)) {
                                  setSelectedTags(prev => prev.filter(t => t !== tag));
                                } else {
                                  setSelectedTags(prev => [...prev, tag]);
                                }
                              }}
                              className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-xs md:text-sm transition-colors ${
                                selectedTags.includes(tag)
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700'
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g., 15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per 100 (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pricePerHundred"
                  value={formData.pricePerHundred}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g., 1200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  min="0"
                  max="90"
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g., 10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Qty</label>
                <input
                  type="number"
                  name="minOrderQuantity"
                  value={formData.minOrderQuantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <input
                  type="text"
                  name="size"
                  value={specifications.size}
                  onChange={handleSpecChange}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g., 8x4 inches"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={specifications.weight}
                  onChange={handleSpecChange}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g., 50g"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                <input
                  type="text"
                  name="material"
                  value={specifications.material}
                  onChange={handleSpecChange}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g., Art Card 300 GSM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Print Type</label>
                <select
                  name="printType"
                  value={specifications.printType}
                  onChange={handleSpecChange}
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {printTypes.map(pt => (
                    <option key={pt.value} value={pt.value}>{pt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Days</label>
              <input
                type="number"
                name="deliveryDays"
                value={formData.deliveryDays}
                onChange={handleChange}
                min="1"
                className="w-32 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* Paper Options */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Paper Options</h2>
              <button
                type="button"
                onClick={addPaperOption}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                + Add Option
              </button>
            </div>
            
            <div className="space-y-3">
              {paperOptions.map((option, index) => (
                <div key={index} className="flex flex-wrap gap-3 items-center p-3 bg-gray-50 rounded-xl">
                  <input
                    type="text"
                    value={option.type}
                    onChange={(e) => updatePaperOption(index, 'type', e.target.value)}
                    className="flex-1 min-w-[150px] px-3 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Paper Type"
                  />
                  <input
                    type="number"
                    value={option.gsm}
                    onChange={(e) => updatePaperOption(index, 'gsm', e.target.value)}
                    className="w-24 px-3 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="GSM"
                  />
                  <input
                    type="number"
                    value={option.priceMultiplier}
                    onChange={(e) => updatePaperOption(index, 'priceMultiplier', e.target.value)}
                    step="0.1"
                    min="1"
                    className="w-24 px-3 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Multiplier"
                  />
                  {paperOptions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePaperOption(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Available Colors</h2>
              <button
                type="button"
                onClick={addColor}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                + Add Color
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                  <input
                    type="color"
                    value={color.code}
                    onChange={(e) => updateColor(index, 'code', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(index, 'name', e.target.value)}
                    className="w-28 px-3 py-2 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Color name"
                  />
                  {colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate('/seller/products')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Submit for Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </SellerLayout>
  );
};

export default SellerAddProductPage;
