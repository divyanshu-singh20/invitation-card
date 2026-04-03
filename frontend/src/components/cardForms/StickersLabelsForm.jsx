
const StickersLabelsForm = ({ details, updateDetails }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        Stickers & Labels Information
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Text / Brand Name *</label>
          <input
            type="text"
            value={details.textBrandName}
            onChange={(e) => updateDetails('textBrandName', e.target.value)}
            className="w-full px-4 py-2.5 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter text or brand name for sticker/label"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
          <select
            value={details.size}
            onChange={(e) => updateDetails('size', e.target.value)}
            className="w-full px-4 py-2.5 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select Size</option>
            <option value="1x1 inch">1 x 1 inch</option>
            <option value="2x1 inch">2 x 1 inch</option>
            <option value="2x2 inch">2 x 2 inch</option>
            <option value="3x2 inch">3 x 2 inch</option>
            <option value="3x3 inch">3 x 3 inch</option>
            <option value="4x3 inch">4 x 3 inch</option>
            <option value="4x4 inch">4 x 4 inch</option>
            <option value="custom">Custom Size</option>
          </select>
        </div>

        {details.size === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Size *</label>
            <input
              type="text"
              value={details.customSize}
              onChange={(e) => updateDetails('customSize', e.target.value)}
              className="w-full px-4 py-2.5 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., 5x3 inch"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Shape *</label>
          <select
            value={details.shape}
            onChange={(e) => updateDetails('shape', e.target.value)}
            className="w-full px-4 py-2.5 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select Shape</option>
            <option value="round">Round / Circle</option>
            <option value="square">Square</option>
            <option value="rectangle">Rectangle</option>
            <option value="oval">Oval</option>
            <option value="custom">Custom Shape</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material *</label>
          <select
            value={details.material}
            onChange={(e) => updateDetails('material', e.target.value)}
            className="w-full px-4 py-2.5 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          >
            <option value="">Select Material</option>
            <option value="paper">Paper</option>
            <option value="vinyl">Vinyl</option>
            <option value="transparent">Transparent</option>
            <option value="metallic">Metallic</option>
            <option value="glossy">Glossy</option>
            <option value="matte">Matte</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details (Optional)</label>
          <textarea
            value={details.additionalDetails}
            onChange={(e) => updateDetails('additionalDetails', e.target.value)}
            className="w-full px-4 py-2.5 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            rows="2"
            placeholder="Any specific requirements or design preferences"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
          <input
            type="tel"
            value={details.contactNumber}
            onChange={(e) => updateDetails('contactNumber', e.target.value)}
            className="w-full px-4 py-2.5 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="10-digit mobile number"
            maxLength="10"
            required
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 mt-6">
        <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Sticker/Label Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {details.textBrandName && <div><span className="font-semibold">Text:</span> {details.textBrandName}</div>}
          {details.size && <div><span className="font-semibold">Size:</span> {details.size === 'custom' ? details.customSize : details.size}</div>}
          {details.shape && <div><span className="font-semibold">Shape:</span> {details.shape}</div>}
          {details.material && <div><span className="font-semibold">Material:</span> {details.material}</div>}
        </div>
      </div>
    </div>
  );
};

export default StickersLabelsForm;
