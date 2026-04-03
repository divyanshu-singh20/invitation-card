
const CondolenceShraddForm = ({ details, updateDetails }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        Condolence / Shraddh Card Details
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name of Deceased *</label>
          <input
            type="text"
            value={details.deceasedName}
            onChange={(e) => updateDetails('deceasedName', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            placeholder="Enter the name of the departed soul"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
          <select
            value={details.eventType}
            onChange={(e) => updateDetails('eventType', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            required
          >
            <option value="">Select Event Type</option>
            <option value="condolence">Condolence Card</option>
            <option value="shraddh">Shraddh Ceremony</option>
            <option value="13th-day">13th Day Ceremony (Terahvi)</option>
            <option value="annual">Annual Ceremony (Barsi)</option>
            <option value="prayer-meet">Prayer Meeting</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            value={details.date}
            onChange={(e) => updateDetails('date', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
          <input
            type="time"
            value={details.time}
            onChange={(e) => updateDetails('time', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
          <input
            type="text"
            value={details.venueName}
            onChange={(e) => updateDetails('venueName', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            placeholder="e.g., Residence, Temple, Community Hall"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
          <textarea
            value={details.address}
            onChange={(e) => updateDetails('address', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none"
            rows="3"
            placeholder="Complete venue address with landmark"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Family Name *</label>
          <input
            type="text"
            value={details.familyName}
            onChange={(e) => updateDetails('familyName', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            placeholder="Name of the grieving family"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
          <select
            value={details.language}
            onChange={(e) => updateDetails('language', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            required
          >
            <option value="hindi">Hindi</option>
            <option value="english">English</option>
            <option value="sanskrit">Sanskrit</option>
            <option value="bilingual">Bilingual (Hindi-English)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
          <input
            type="tel"
            value={details.contactNumber}
            onChange={(e) => updateDetails('contactNumber', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            placeholder="10-digit mobile number"
            maxLength="10"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message (Optional)</label>
          <textarea
            value={details.additionalMessage}
            onChange={(e) => updateDetails('additionalMessage', e.target.value)}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-none"
            rows="2"
            placeholder="Any special message or prayer details"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-4 rounded-lg border border-slate-200 mt-6">
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          Card Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {details.deceasedName && <div><span className="font-semibold">In Memory of:</span> {details.deceasedName}</div>}
          {details.eventType && <div><span className="font-semibold">Event:</span> {details.eventType}</div>}
          {details.date && <div><span className="font-semibold">Date:</span> {new Date(details.date).toLocaleDateString('en-IN')}</div>}
          {details.time && <div><span className="font-semibold">Time:</span> {details.time}</div>}
          {details.familyName && <div><span className="font-semibold">Family:</span> {details.familyName}</div>}
        </div>
      </div>
    </div>
  );
};

export default CondolenceShraddForm;
