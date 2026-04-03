
const AnniversaryCardForm = ({ activeStep, details, updateDetails }) => {
  return (
    <>
      {/* Step 1: Couple Info */}
      {activeStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Couple Information
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Couple Name *</label>
              <input
                type="text"
                value={details.coupleName}
                onChange={(e) => updateDetails('coupleName', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Mr. & Mrs. Sharma"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anniversary Type *</label>
              <select
                value={details.anniversaryType}
                onChange={(e) => updateDetails('anniversaryType', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select Anniversary</option>
                <option value="1st">1st Anniversary</option>
                <option value="5th">5th Anniversary</option>
                <option value="10th">10th Anniversary</option>
                <option value="25th">25th Anniversary (Silver Jubilee)</option>
                <option value="50th">50th Anniversary (Golden Jubilee)</option>
                <option value="60th">60th Anniversary (Diamond Jubilee)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host Name *</label>
              <input
                type="text"
                value={details.hostName}
                onChange={(e) => updateDetails('hostName', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="From: Children / Family"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Event Details */}
      {activeStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Celebration Details
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Anniversary Date *</label>
              <input
                type="date"
                value={details.anniversaryDate}
                onChange={(e) => updateDetails('anniversaryDate', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Celebration Time *</label>
              <input
                type="time"
                value={details.anniversaryTime}
                onChange={(e) => updateDetails('anniversaryTime', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
              <input
                type="text"
                value={details.venue}
                onChange={(e) => updateDetails('venue', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Celebration venue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address *</label>
              <textarea
                value={details.venueAddress}
                onChange={(e) => updateDetails('venueAddress', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows="2"
                placeholder="Complete address"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Host & Theme */}
      {activeStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Theme & Message
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme Preference</label>
              <select
                value={details.themeColorPreference}
                onChange={(e) => updateDetails('themeColorPreference', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select Theme</option>
                <option value="Floral">Floral & Romantic</option>
                <option value="Classic">Classic & Elegant</option>
                <option value="Royal">Royal & Golden</option>
                <option value="Modern">Modern & Minimal</option>
                <option value="Traditional">Traditional Indian</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Message</label>
              <textarea
                value={details.invitationMessage}
                onChange={(e) => updateDetails('invitationMessage', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                rows="3"
                placeholder="Please join us to celebrate their journey of love..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quote (Optional)</label>
              <input
                type="text"
                value={details.quote}
                onChange={(e) => updateDetails('quote', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Love grows more tremendously full..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updateDetails('photo', file);
                      updateDetails('photoPreview', reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              {details.photoPreview && (
                <img src={details.photoPreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Contact */}
      {activeStep === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Contact Information
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language Preference *</label>
              <select
                value={details.language}
                onChange={(e) => updateDetails('language', e.target.value)}
                className="w-full px-4 py-2.5 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="hinglish">Hinglish (Mix)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
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
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 mt-6">
            <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Anniversary Card Summary
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              {details.coupleName && <div><span className="font-semibold">Couple:</span> {details.coupleName}</div>}
              {details.anniversaryType && <div><span className="font-semibold">Anniversary:</span> {details.anniversaryType}</div>}
              {details.anniversaryDate && <div><span className="font-semibold">Date:</span> {new Date(details.anniversaryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>}
              {details.anniversaryTime && <div><span className="font-semibold">Time:</span> {details.anniversaryTime}</div>}
              {details.venue && <div><span className="font-semibold">Venue:</span> {details.venue}</div>}
              {details.hostName && <div><span className="font-semibold">Host:</span> {details.hostName}</div>}
              {details.themeColorPreference && <div><span className="font-semibold">Theme:</span> {details.themeColorPreference}</div>}
              {details.contactNumber && <div><span className="font-semibold">Contact:</span> {details.contactNumber}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnniversaryCardForm;
