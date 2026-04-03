
const CertificatesAwardsForm = ({ details, updateDetails }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        Certificates & Awards Details
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Organization / Event Name *</label>
          <input
            type="text"
            value={details.organizationName}
            onChange={(e) => updateDetails('organizationName', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Enter organization or event name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name *</label>
          <input
            type="text"
            value={details.recipientName}
            onChange={(e) => updateDetails('recipientName', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Name of the recipient"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Award / Certificate Title *</label>
          <input
            type="text"
            value={details.awardTitle}
            onChange={(e) => updateDetails('awardTitle', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="e.g., Certificate of Excellence, Best Employee Award"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
          <input
            type="date"
            value={details.date}
            onChange={(e) => updateDetails('date', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Authorized Signatory Name *</label>
          <input
            type="text"
            value={details.signatoryName}
            onChange={(e) => updateDetails('signatoryName', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="Name of person signing the certificate"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Signatory Designation *</label>
          <input
            type="text"
            value={details.signatoryDesignation}
            onChange={(e) => updateDetails('signatoryDesignation', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="e.g., Director, Principal, Manager"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Description (Optional)</label>
          <textarea
            value={details.description}
            onChange={(e) => updateDetails('description', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none"
            rows="3"
            placeholder="Brief description or achievement details"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Type *</label>
          <select
            value={details.certificateType}
            onChange={(e) => updateDetails('certificateType', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          >
            <option value="">Select Type</option>
            <option value="achievement">Achievement Certificate</option>
            <option value="participation">Participation Certificate</option>
            <option value="appreciation">Appreciation Certificate</option>
            <option value="completion">Course Completion</option>
            <option value="award">Award Certificate</option>
            <option value="excellence">Excellence Certificate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paper Quality *</label>
          <select
            value={details.paperQuality}
            onChange={(e) => updateDetails('paperQuality', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            required
          >
            <option value="">Select Quality</option>
            <option value="standard">Standard</option>
            <option value="premium">Premium</option>
            <option value="glossy">Glossy</option>
            <option value="textured">Textured</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
          <input
            type="tel"
            value={details.contactNumber}
            onChange={(e) => updateDetails('contactNumber', e.target.value)}
            className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="10-digit mobile number"
            maxLength="10"
            required
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200 mt-6">
        <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Certificate Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {details.organizationName && <div><span className="font-semibold">Organization:</span> {details.organizationName}</div>}
          {details.recipientName && <div><span className="font-semibold">Recipient:</span> {details.recipientName}</div>}
          {details.awardTitle && <div><span className="font-semibold">Title:</span> {details.awardTitle}</div>}
          {details.date && <div><span className="font-semibold">Date:</span> {new Date(details.date).toLocaleDateString('en-IN')}</div>}
          {details.signatoryName && <div><span className="font-semibold">Signatory:</span> {details.signatoryName} ({details.signatoryDesignation})</div>}
        </div>
      </div>
    </div>
  );
};

export default CertificatesAwardsForm;
