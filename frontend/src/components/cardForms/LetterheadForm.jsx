
const LetterheadForm = ({ details, updateDetails }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        Letterhead Information
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Business / Company Name *</label>
          <input
            type="text"
            value={details.businessName}
            onChange={(e) => updateDetails('businessName', e.target.value)}
            className="w-full px-4 py-2.5 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter business or company name"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <textarea
            value={details.address}
            onChange={(e) => updateDetails('address', e.target.value)}
            className="w-full px-4 py-2.5 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            rows="3"
            placeholder="Complete business address"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile / Contact Number *</label>
          <input
            type="tel"
            value={details.contactNumber}
            onChange={(e) => updateDetails('contactNumber', e.target.value)}
            className="w-full px-4 py-2.5 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="10-digit contact number"
            maxLength="10"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email ID *</label>
          <input
            type="email"
            value={details.emailId}
            onChange={(e) => updateDetails('emailId', e.target.value)}
            className="w-full px-4 py-2.5 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="email@example.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (if applicable)</label>
          <input
            type="text"
            value={details.gstNumber}
            onChange={(e) => updateDetails('gstNumber', e.target.value)}
            className="w-full px-4 py-2.5 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="15-digit GST number"
            maxLength="15"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200 mt-6">
        <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Letterhead Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {details.businessName && <div><span className="font-semibold">Company:</span> {details.businessName}</div>}
          {details.address && <div><span className="font-semibold">Address:</span> {details.address}</div>}
          {details.contactNumber && <div><span className="font-semibold">Phone:</span> {details.contactNumber}</div>}
          {details.emailId && <div><span className="font-semibold">Email:</span> {details.emailId}</div>}
          {details.gstNumber && <div><span className="font-semibold">GST:</span> {details.gstNumber}</div>}
        </div>
      </div>
    </div>
  );
};

export default LetterheadForm;
