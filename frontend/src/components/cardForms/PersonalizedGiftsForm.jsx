
const PersonalizedGiftsForm = ({ details, updateDetails }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        Personalized Gifts Details
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
          <select
            value={details.productType}
            onChange={(e) => updateDetails('productType', e.target.value)}
            className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            required
          >
            <option value="">Select Product Type</option>
            <option value="mug">Mug</option>
            <option value="t-shirt">T-Shirt</option>
            <option value="photo-frame">Photo Frame</option>
            <option value="keychain">Keychain</option>
            <option value="cushion">Cushion</option>
            <option value="lamp">LED Lamp</option>
            <option value="bottle">Water Bottle</option>
            <option value="mousepad">Mouse Pad</option>
            <option value="pen">Pen</option>
            <option value="diary">Diary/Notebook</option>
            <option value="clock">Wall Clock</option>
            <option value="cap">Cap</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
          <input
            type="number"
            value={details.quantity}
            onChange={(e) => updateDetails('quantity', e.target.value)}
            className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            placeholder="Number of items"
            min="1"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Text / Name to Print *</label>
          <input
            type="text"
            value={details.textToPrint}
            onChange={(e) => updateDetails('textToPrint', e.target.value)}
            className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            placeholder="Enter text or name to be printed"
            required
          />
        </div>

        {/* T-Shirt specific fields */}
        {details.productType === 't-shirt' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">T-Shirt Size *</label>
              <select
                value={details.tshirtSize}
                onChange={(e) => updateDetails('tshirtSize', e.target.value)}
                className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                required
              >
                <option value="">Select Size</option>
                <option value="S">Small (S)</option>
                <option value="M">Medium (M)</option>
                <option value="L">Large (L)</option>
                <option value="XL">Extra Large (XL)</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">T-Shirt Color *</label>
              <select
                value={details.tshirtColor}
                onChange={(e) => updateDetails('tshirtColor', e.target.value)}
                className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                required
              >
                <option value="">Select Color</option>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>
          </>
        )}

        {/* Photo Frame specific fields */}
        {details.productType === 'photo-frame' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frame Size *</label>
            <select
              value={details.frameSize}
              onChange={(e) => updateDetails('frameSize', e.target.value)}
              className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              required
            >
              <option value="">Select Size</option>
              <option value="4x6">4 x 6 inches</option>
              <option value="5x7">5 x 7 inches</option>
              <option value="8x10">8 x 10 inches</option>
              <option value="8x12">8 x 12 inches</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Printing Type *</label>
          <select
            value={details.printingType}
            onChange={(e) => updateDetails('printingType', e.target.value)}
            className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            required
          >
            <option value="">Select Type</option>
            <option value="text-only">Text Only</option>
            <option value="photo-only">Photo Only</option>
            <option value="text-photo">Text + Photo</option>
            <option value="custom-design">Custom Design</option>
          </select>
        </div>

        {(details.printingType === 'photo-only' || details.printingType === 'text-photo' || details.printingType === 'custom-design') && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo / Design *</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    updateDetails('photoPreview', reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              required
            />
            {details.photoPreview && (
              <div className="mt-3">
                <img 
                  src={details.photoPreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-rose-300"
                />
              </div>
            )}
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Message / Quote (Optional)</label>
          <textarea
            value={details.message}
            onChange={(e) => updateDetails('message', e.target.value)}
            className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
            rows="2"
            placeholder="Add a special message or quote"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Occasion *</label>
          <select
            value={details.occasion}
            onChange={(e) => updateDetails('occasion', e.target.value)}
            className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            required
          >
            <option value="">Select Occasion</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="valentine">Valentine's Day</option>
            <option value="wedding">Wedding</option>
            <option value="farewell">Farewell</option>
            <option value="corporate">Corporate Gift</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
          <input
            type="tel"
            value={details.contactNumber}
            onChange={(e) => updateDetails('contactNumber', e.target.value)}
            className="w-full px-4 py-2.5 border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            placeholder="10-digit mobile number"
            maxLength="10"
            required
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-4 rounded-lg border border-rose-200 mt-6">
        <h4 className="font-semibold text-rose-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          Gift Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {details.productType && <div><span className="font-semibold">Product:</span> {details.productType}</div>}
          {details.quantity && <div><span className="font-semibold">Quantity:</span> {details.quantity} items</div>}
          {details.textToPrint && <div><span className="font-semibold">Text:</span> {details.textToPrint}</div>}
          {details.occasion && <div><span className="font-semibold">Occasion:</span> {details.occasion}</div>}
          {details.printingType && <div><span className="font-semibold">Type:</span> {details.printingType}</div>}
        </div>
      </div>
    </div>
  );
};

export default PersonalizedGiftsForm;
