
const BirthdayCardForm = ({ activeStep, details, updateDetails }) => {
  return (
    <>
      {/* Step 1: Basic Info */}
      {activeStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Birthday Party Information
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Child's Name *</label>
              <input
                type="text"
                value={details.childName}
                onChange={(e) => updateDetails('childName', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter child's name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input
                type="number"
                value={details.age}
                onChange={(e) => updateDetails('age', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Child's age"
                min="1"
                max="100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birthday Number *</label>
              <select
                value={details.birthdayNumber}
                onChange={(e) => updateDetails('birthdayNumber', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                required
              >
                <option value="">Select Birthday</option>
                <option value="1st">1st Birthday</option>
                <option value="2nd">2nd Birthday</option>
                <option value="3rd">3rd Birthday</option>
                <option value="5th">5th Birthday</option>
                <option value="10th">10th Birthday</option>
                <option value="16th">16th Birthday (Sweet Sixteen)</option>
                <option value="18th">18th Birthday</option>
                <option value="21st">21st Birthday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parents Name *</label>
              <input
                type="text"
                value={details.parentsName}
                onChange={(e) => updateDetails('parentsName', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="From: Mommy & Daddy"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Party Details */}
      {activeStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🎈</span> Party Details
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birthday Date *</label>
              <input
                type="date"
                value={details.birthdayDate}
                onChange={(e) => updateDetails('birthdayDate', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Party Time *</label>
              <input
                type="time"
                value={details.birthdayTime}
                onChange={(e) => updateDetails('birthdayTime', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
              <input
                type="text"
                value={details.venue}
                onChange={(e) => updateDetails('venue', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Party venue or home"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address *</label>
              <textarea
                value={details.venueAddress}
                onChange={(e) => updateDetails('venueAddress', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
                rows="2"
                placeholder="Complete address"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Theme & Photo */}
      {activeStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🎨</span> Theme & Photo
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Party Theme *</label>
              <select
                value={details.theme}
                onChange={(e) => updateDetails('theme', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                required
              >
                <option value="">Select Theme</option>
                <option value="Cartoon">Cartoon Characters</option>
                <option value="Superhero">Superhero Theme</option>
                <option value="Princess">Princess Theme</option>
                <option value="Cars">Cars & Racing</option>
                <option value="Jungle">Jungle Safari</option>
                <option value="Space">Space & Rockets</option>
                <option value="Unicorn">Unicorn & Rainbows</option>
                <option value="Frozen">Frozen Theme</option>
                <option value="Barbie">Barbie Theme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Message</label>
              <textarea
                value={details.invitationMessage}
                onChange={(e) => updateDetails('invitationMessage', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
                rows="3"
                placeholder="Join us for a fun-filled birthday celebration..."
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
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
            <span className="text-2xl">📞</span> Contact Information
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language Preference *</label>
              <select
                value={details.language}
                onChange={(e) => updateDetails('language', e.target.value)}
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
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
                className="w-full px-4 py-2.5 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="10-digit mobile number"
                maxLength="10"
                required
              />
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200 mt-6">
            <h4 className="font-semibold text-pink-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Birthday Card Summary
            </h4>
            <div className="space-y-2 text-sm text-gray-700">
              {details.childName && <div><span className="font-semibold">Child:</span> {details.childName}</div>}
              {details.age && <div><span className="font-semibold">Age:</span> {details.age} years</div>}
              {details.birthdayNumber && <div><span className="font-semibold">Birthday:</span> {details.birthdayNumber}</div>}
              {details.birthdayDate && <div><span className="font-semibold">Date:</span> {new Date(details.birthdayDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>}
              {details.birthdayTime && <div><span className="font-semibold">Time:</span> {details.birthdayTime}</div>}
              {details.venue && <div><span className="font-semibold">Venue:</span> {details.venue}</div>}
              {details.theme && <div><span className="font-semibold">Theme:</span> {details.theme}</div>}
              {details.parentsName && <div><span className="font-semibold">From:</span> {details.parentsName}</div>}
              {details.contactNumber && <div><span className="font-semibold">Contact:</span> {details.contactNumber}</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BirthdayCardForm;
