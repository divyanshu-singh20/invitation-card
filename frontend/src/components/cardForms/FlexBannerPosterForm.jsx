
const FlexBannerPosterForm = ({ details, updateDetails }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        Flex / Banner / Poster Details
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content / Text to Print *</label>
          <textarea
            value={details.contentText}
            onChange={(e) => updateDetails('contentText', e.target.value)}
            className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
            rows="4"
            placeholder="Enter the text/content you want to print on flex/banner"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
            <select
              value={details.size}
              onChange={(e) => updateDetails('size', e.target.value)}
              className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Select Size</option>
              <option value="3x2 feet">3 x 2 feet</option>
              <option value="4x3 feet">4 x 3 feet</option>
              <option value="5x3 feet">5 x 3 feet</option>
              <option value="6x3 feet">6 x 3 feet</option>
              <option value="6x4 feet">6 x 4 feet</option>
              <option value="8x4 feet">8 x 4 feet</option>
              <option value="10x5 feet">10 x 5 feet</option>
              <option value="10x6 feet">10 x 6 feet</option>
              <option value="12x6 feet">12 x 6 feet</option>
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
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., 15x8 feet"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
            <select
              value={details.purpose}
              onChange={(e) => updateDetails('purpose', e.target.value)}
              className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Select Purpose</option>
              <option value="flex">Flex Banner</option>
              <option value="banner">Hanging Banner</option>
              <option value="poster">Poster</option>
              <option value="standee">Standee</option>
              <option value="backdrop">Event Backdrop</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
            <select
              value={details.language}
              onChange={(e) => updateDetails('language', e.target.value)}
              className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="bilingual">Bilingual (Hindi + English)</option>
              <option value="regional">Regional Language</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number (for verification) *</label>
          <input
            type="tel"
            value={details.contactNumber}
            onChange={(e) => updateDetails('contactNumber', e.target.value)}
            className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="10-digit mobile number"
            maxLength="10"
            required
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200 mt-6">
        <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Order Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {details.size && <div><span className="font-semibold">Size:</span> {details.size === 'custom' ? details.customSize : details.size}</div>}
          {details.purpose && <div><span className="font-semibold">Type:</span> {details.purpose}</div>}
          {details.language && <div><span className="font-semibold">Language:</span> {details.language}</div>}
          {details.contentText && <div><span className="font-semibold">Content Preview:</span> {details.contentText.substring(0, 100)}...</div>}
        </div>
      </div>
    </div>
  );
};

export default FlexBannerPosterForm;
