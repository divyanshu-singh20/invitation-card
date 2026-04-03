
const ReligiousEventCardForm = ({ activeStep, details, updateDetails }) => {
  return (
    <>
      {/* Step 1: Event Info */}
      {activeStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Religious Event Information
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name *</label>
              <select
                value={details.eventName}
                onChange={(e) => updateDetails('eventName', e.target.value)}
                className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="">Select Event</option>
                <option value="Grih Pravesh">Grih Pravesh</option>
                <option value="Satyanarayan Katha">Satyanarayan Katha</option>
                <option value="Puja">Puja</option>
                <option value="Havan">Havan</option>
                <option value="Mundan">Mundan</option>
                <option value="Annaprashan">Annaprashan</option>
                <option value="Other">Other Religious Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host Name / Family Name *</label>
              <input
                type="text"
                value={details.hostName}
                onChange={(e) => updateDetails('hostName', e.target.value)}
                className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Sharma Family"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Line *</label>
              <textarea
                value={details.invitationLine}
                onChange={(e) => updateDetails('invitationLine', e.target.value)}
                className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows="3"
                placeholder="You are cordially invited to attend..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
              <select
                value={details.language}
                onChange={(e) => updateDetails('language', e.target.value)}
                className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                <option value="hindi">Hindi</option>
                <option value="english">English</option>
                <option value="sanskrit">Sanskrit</option>
                <option value="bilingual">Bilingual (Hindi & English)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Venue Details */}
      {activeStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🏛️</span> Venue Details
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
              <input
                type="date"
                value={details.eventDate}
                onChange={(e) => updateDetails('eventDate', e.target.value)}
                className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Time *</label>
              <input
                type="time"
                value={details.eventTime}
                onChange={(e) => updateDetails('eventTime', e.target.value)}
                className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
              <input
                type="text"
                value={details.venue}
                onChange={(e) => updateDetails('venue', e.target.value)}
                className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Temple / Home / Community Hall"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address *</label>
              <textarea
                value={details.venueAddress}
                onChange={(e) => updateDetails('venueAddress', e.target.value)}
                className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                rows="3"
                placeholder="Complete address with landmarks"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Contact */}
      {activeStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">📞</span> Contact Information
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
              <input
                type="tel"
                value={details.contactNumber}
                onChange={(e) => updateDetails('contactNumber', e.target.value)}
                className="w-full px-4 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="10-digit mobile number"
                maxLength="10"
                required
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200 mt-6">
            <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Religious Event Summary
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              {details.eventName && <div><span className="font-semibold">Event:</span> {details.eventName}</div>}
              {details.hostName && <div><span className="font-semibold">Host:</span> {details.hostName}</div>}
              {details.eventDate && <div><span className="font-semibold">Date:</span> {new Date(details.eventDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>}
              {details.eventTime && <div><span className="font-semibold">Time:</span> {details.eventTime}</div>}
              {details.venue && <div><span className="font-semibold">Venue:</span> {details.venue}</div>}
              {details.venueAddress && <div><span className="font-semibold">Address:</span> {details.venueAddress}</div>}
              {details.language && <div><span className="font-semibold">Language:</span> {details.language}</div>}
              {details.contactNumber && <div><span className="font-semibold">Contact:</span> {details.contactNumber}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReligiousEventCardForm;
