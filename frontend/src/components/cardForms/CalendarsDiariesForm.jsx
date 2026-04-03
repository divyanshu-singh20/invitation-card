
const CalendarsDiariesForm = ({ details, updateDetails }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        Calendars & Diaries Details
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Type *</label>
          <select
            value={details.type}
            onChange={(e) => updateDetails('type', e.target.value)}
            className="w-full px-4 py-2.5 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          >
            <option value="">Select Type</option>
            <option value="wall-calendar">Wall Calendar</option>
            <option value="table-calendar">Table Calendar</option>
            <option value="diary">Diary</option>
            <option value="planner">Planner</option>
            <option value="notebook">Notebook</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
          <select
            value={details.year}
            onChange={(e) => updateDetails('year', e.target.value)}
            className="w-full px-4 py-2.5 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          >
            <option value="">Select Year</option>
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear + 1}>{currentYear + 1}</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Business / Person Name *</label>
          <input
            type="text"
            value={details.businessPersonName}
            onChange={(e) => updateDetails('businessPersonName', e.target.value)}
            className="w-full px-4 py-2.5 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Enter business or person name to be printed"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
          <input
            type="tel"
            value={details.contactNumber}
            onChange={(e) => updateDetails('contactNumber', e.target.value)}
            className="w-full px-4 py-2.5 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="10-digit mobile number"
            maxLength="10"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email ID (Optional)</label>
          <input
            type="email"
            value={details.emailId}
            onChange={(e) => updateDetails('emailId', e.target.value)}
            className="w-full px-4 py-2.5 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="email@example.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
          <textarea
            value={details.address}
            onChange={(e) => updateDetails('address', e.target.value)}
            className="w-full px-4 py-2.5 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
            rows="2"
            placeholder="Business address to be printed on calendar/diary"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo / Photo Upload (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  updateDetails('logoPreview', reader.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="w-full px-4 py-2.5 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {details.logoPreview && (
            <div className="mt-3">
              <img 
                src={details.logoPreview} 
                alt="Logo Preview" 
                className="w-24 h-24 object-contain rounded-lg border-2 border-sky-300"
              />
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements (Optional)</label>
          <textarea
            value={details.specialRequirements}
            onChange={(e) => updateDetails('specialRequirements', e.target.value)}
            className="w-full px-4 py-2.5 border border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 resize-none"
            rows="2"
            placeholder="Any special design or printing requirements"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-sky-50 to-blue-50 p-4 rounded-lg border border-sky-200 mt-6">
        <h4 className="font-semibold text-sky-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Order Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {details.type && <div><span className="font-semibold">Type:</span> {details.type}</div>}
          {details.year && <div><span className="font-semibold">Year:</span> {details.year}</div>}
          {details.businessPersonName && <div><span className="font-semibold">Name:</span> {details.businessPersonName}</div>}
          {details.contactNumber && <div><span className="font-semibold">Contact:</span> {details.contactNumber}</div>}
          {details.emailId && <div><span className="font-semibold">Email:</span> {details.emailId}</div>}
        </div>
      </div>
    </div>
  );
};

export default CalendarsDiariesForm;
