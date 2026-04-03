
const DigitalInvitationsForm = ({ details, updateDetails }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        Digital Invitation Details
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Type *</label>
          <select
            value={details.eventType}
            onChange={(e) => updateDetails('eventType', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            required
          >
            <option value="">Select Event Type</option>
            <option value="wedding">Wedding</option>
            <option value="engagement">Engagement</option>
            <option value="birthday">Birthday Party</option>
            <option value="anniversary">Anniversary</option>
            <option value="baby-shower">Baby Shower</option>
            <option value="housewarming">Housewarming</option>
            <option value="religious">Religious Ceremony</option>
            <option value="corporate">Corporate Event</option>
            <option value="party">Party</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Format *</label>
          <select
            value={details.cardFormat}
            onChange={(e) => updateDetails('cardFormat', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            required
          >
            <option value="">Select Format</option>
            <option value="video">Video Invitation</option>
            <option value="animated">Animated Card</option>
            <option value="static">Static Image Card</option>
            <option value="qr-code">QR Code Card</option>
            <option value="whatsapp">WhatsApp Invitation</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Host Names / Couple Names *</label>
          <input
            type="text"
            value={details.names}
            onChange={(e) => updateDetails('names', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            placeholder="e.g., Rahul & Priya, Sharma Family"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Date *</label>
          <input
            type="date"
            value={details.eventDate}
            onChange={(e) => updateDetails('eventDate', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Time *</label>
          <input
            type="time"
            value={details.eventTime}
            onChange={(e) => updateDetails('eventTime', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
          <input
            type="text"
            value={details.venueName}
            onChange={(e) => updateDetails('venueName', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            placeholder="Enter venue name"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Address *</label>
          <textarea
            value={details.address}
            onChange={(e) => updateDetails('address', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
            rows="3"
            placeholder="Complete venue address with landmark"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link (Optional)</label>
          <input
            type="url"
            value={details.googleMapsLink}
            onChange={(e) => updateDetails('googleMapsLink', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            placeholder="Paste Google Maps location link"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
          <input
            type="tel"
            value={details.contactNumber}
            onChange={(e) => updateDetails('contactNumber', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            placeholder="10-digit mobile number"
            maxLength="10"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Message / Quote (Optional)</label>
          <textarea
            value={details.invitationMessage}
            onChange={(e) => updateDetails('invitationMessage', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
            rows="3"
            placeholder="Enter custom invitation message"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Theme / Color Preference *</label>
          <select
            value={details.theme}
            onChange={(e) => updateDetails('theme', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            required
          >
            <option value="">Select Theme</option>
            <option value="traditional">Traditional</option>
            <option value="modern">Modern</option>
            <option value="elegant">Elegant</option>
            <option value="colorful">Colorful</option>
            <option value="floral">Floral</option>
            <option value="minimalist">Minimalist</option>
            <option value="royal">Royal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Music / Background Audio</label>
          <select
            value={details.backgroundMusic}
            onChange={(e) => updateDetails('backgroundMusic', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="">No Music</option>
            <option value="traditional">Traditional Music</option>
            <option value="romantic">Romantic Music</option>
            <option value="upbeat">Upbeat Music</option>
            <option value="custom">Custom Music (Upload)</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photos (Optional)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files);
              const previews = [];
              files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  previews.push(reader.result);
                  if (previews.length === files.length) {
                    updateDetails('photoPreviews', previews);
                  }
                };
                reader.readAsDataURL(file);
              });
            }}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
          {details.photoPreviews && details.photoPreviews.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {details.photoPreviews.map((preview, index) => (
                <img 
                  key={index}
                  src={preview} 
                  alt={`Preview ${index + 1}`} 
                  className="w-20 h-20 object-cover rounded-lg border-2 border-violet-300"
                />
              ))}
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Special Requirements (Optional)</label>
          <textarea
            value={details.specialRequirements}
            onChange={(e) => updateDetails('specialRequirements', e.target.value)}
            className="w-full px-4 py-2.5 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none"
            rows="2"
            placeholder="Any specific requirements or design preferences"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-4 rounded-lg border border-violet-200 mt-6">
        <h4 className="font-semibold text-violet-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Digital Invitation Preview
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {details.eventType && <div><span className="font-semibold">Event:</span> {details.eventType}</div>}
          {details.names && <div><span className="font-semibold">Hosts:</span> {details.names}</div>}
          {details.eventDate && <div><span className="font-semibold">Date:</span> {new Date(details.eventDate).toLocaleDateString('en-IN')}</div>}
          {details.eventTime && <div><span className="font-semibold">Time:</span> {details.eventTime}</div>}
          {details.venueName && <div><span className="font-semibold">Venue:</span> {details.venueName}</div>}
          {details.cardFormat && <div><span className="font-semibold">Format:</span> {details.cardFormat}</div>}
          {details.theme && <div><span className="font-semibold">Theme:</span> {details.theme}</div>}
        </div>
      </div>
    </div>
  );
};

export default DigitalInvitationsForm;
