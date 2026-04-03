
const ShopOpeningCardForm = ({ activeStep, details, updateDetails }) => {
  return (
    <>
      {/* Step 1: Business Info */}
      {activeStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Business Information
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business / Shop Name *</label>
              <input
                type="text"
                value={details.businessName}
                onChange={(e) => updateDetails('businessName', e.target.value)}
                className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter business or shop name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Occasion *</label>
              <select
                value={details.openingOccasion}
                onChange={(e) => updateDetails('openingOccasion', e.target.value)}
                className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="Shop Opening">Shop Opening</option>
                <option value="Office Opening">Office Opening</option>
                <option value="Inauguration">Inauguration</option>
                <option value="Grand Opening">Grand Opening</option>
                <option value="Store Launch">Store Launch</option>
                <option value="Business Opening">Business Opening</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Line *</label>
              <textarea
                value={details.invitationLine}
                onChange={(e) => updateDetails('invitationLine', e.target.value)}
                className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="3"
                placeholder="You are cordially invited..."
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
            Event Details
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={details.eventDate}
                onChange={(e) => updateDetails('eventDate', e.target.value)}
                className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input
                type="time"
                value={details.eventTime}
                onChange={(e) => updateDetails('eventTime', e.target.value)}
                className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address / Venue *</label>
              <textarea
                value={details.venue}
                onChange={(e) => updateDetails('venue', e.target.value)}
                className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows="3"
                placeholder="Complete address with landmarks"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
              <input
                type="tel"
                value={details.contactNumber}
                onChange={(e) => updateDetails('contactNumber', e.target.value)}
                className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10-digit contact number"
                maxLength="10"
                required
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200 mt-6">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Invitation Summary
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              {details.businessName && <div><span className="font-semibold">Business:</span> {details.businessName}</div>}
              {details.openingOccasion && <div><span className="font-semibold">Occasion:</span> {details.openingOccasion}</div>}
              {details.eventDate && <div><span className="font-semibold">Date:</span> {new Date(details.eventDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>}
              {details.eventTime && <div><span className="font-semibold">Time:</span> {details.eventTime}</div>}
              {details.venue && <div><span className="font-semibold">Venue:</span> {details.venue}</div>}
              {details.contactNumber && <div><span className="font-semibold">Contact:</span> {details.contactNumber}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopOpeningCardForm;
