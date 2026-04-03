
const SchoolCollegePrintingForm = ({ details, updateDetails }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        School / College Printing Details
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
          <input
            type="text"
            value={details.institutionName}
            onChange={(e) => updateDetails('institutionName', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter school or college name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Document Type *</label>
          <select
            value={details.documentType}
            onChange={(e) => updateDetails('documentType', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Document Type</option>
            <option value="id-card">ID Card</option>
            <option value="admit-card">Admit Card</option>
            <option value="certificate">Certificate</option>
            <option value="marksheet">Marksheet</option>
            <option value="notice">Notice / Circular</option>
            <option value="question-paper">Question Paper</option>
            <option value="answer-sheet">Answer Sheet</option>
            <option value="prospectus">Prospectus</option>
            <option value="handbook">Student Handbook</option>
            <option value="result">Result Sheet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
          <input
            type="number"
            value={details.quantity}
            onChange={(e) => updateDetails('quantity', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Number of copies"
            min="1"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content / Text *</label>
          <textarea
            value={details.contentText}
            onChange={(e) => updateDetails('contentText', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="4"
            placeholder="Enter the content or text to be printed"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paper Size *</label>
          <select
            value={details.paperSize}
            onChange={(e) => updateDetails('paperSize', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Size</option>
            <option value="A4">A4</option>
            <option value="A5">A5</option>
            <option value="Legal">Legal</option>
            <option value="ID-Card">ID Card Size</option>
            <option value="custom">Custom Size</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color *</label>
          <select
            value={details.colorOption}
            onChange={(e) => updateDetails('colorOption', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Color</option>
            <option value="black-white">Black & White</option>
            <option value="color">Full Color</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Printing Side *</label>
          <select
            value={details.printingSide}
            onChange={(e) => updateDetails('printingSide', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Option</option>
            <option value="single">Single Side</option>
            <option value="double">Double Side</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Binding (if applicable)</label>
          <select
            value={details.binding}
            onChange={(e) => updateDetails('binding', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">No Binding</option>
            <option value="staple">Staple</option>
            <option value="spiral">Spiral Binding</option>
            <option value="glue">Glue Binding</option>
            <option value="hard">Hard Binding</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name *</label>
          <input
            type="text"
            value={details.contactPersonName}
            onChange={(e) => updateDetails('contactPersonName', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your name"
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
            placeholder="10-digit mobile number"
            maxLength="10"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date Required *</label>
          <input
            type="date"
            value={details.deliveryDate}
            onChange={(e) => updateDetails('deliveryDate', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions (Optional)</label>
          <textarea
            value={details.specialInstructions}
            onChange={(e) => updateDetails('specialInstructions', e.target.value)}
            className="w-full px-4 py-2.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows="2"
            placeholder="Any specific requirements or instructions"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mt-6">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Order Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {details.institutionName && <div><span className="font-semibold">Institution:</span> {details.institutionName}</div>}
          {details.documentType && <div><span className="font-semibold">Document Type:</span> {details.documentType}</div>}
          {details.quantity && <div><span className="font-semibold">Quantity:</span> {details.quantity} copies</div>}
          {details.paperSize && <div><span className="font-semibold">Size:</span> {details.paperSize}</div>}
          {details.colorOption && <div><span className="font-semibold">Color:</span> {details.colorOption}</div>}
          {details.deliveryDate && <div><span className="font-semibold">Delivery:</span> {new Date(details.deliveryDate).toLocaleDateString('en-IN')}</div>}
        </div>
      </div>
    </div>
  );
};

export default SchoolCollegePrintingForm;
