import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const ShopRegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // OTP related states
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Form data
  const [formData, setFormData] = useState({
    // Personal Info
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Shop Info
    shopName: '',
    shopType: '',
    gstNumber: '',
    panNumber: '',
    
    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    
    // Bank Details
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    
    // Terms
    agreeTerms: false
  });

  const shopTypes = [
    'Wedding Card Printing',
    'Digital Invitation Designer',
    'Custom Card Designer',
    'Gift & Stationery',
    'Event Planner',
    'Other'
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh'
  ];

  // OTP Timer
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedValue = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedValue.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedValue.length, 5);
      otpRefs[nextIndex]?.current?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    }
  };

  const validateStep1Basic = () => {
    if (!formData.ownerName || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill all required fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter valid 10-digit phone number');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter valid email address');
      return false;
    }
    return true;
  };

  // Send OTP
  const handleSendOtp = async () => {
    setError('');
    
    if (!validateStep1Basic()) return;
    
    setLoading(true);
    try {
      const response = await api.post('/sellers/send-otp', {
        ownerName: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      if (response.data.success) {
        setShowOtpInput(true);
        setOtpTimer(60);
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => otpRefs[0]?.current?.focus(), 100);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const response = await api.post('/sellers/verify-otp', {
        email: formData.email,
        otp: otpString
      });
      
      if (response.data.success) {
        setEmailVerified(true);
        setShowOtpInput(false);
        setStep(2); // Move to next step
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (otpTimer > 0) return;
    
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/sellers/resend-otp', {
        email: formData.email
      });
      
      if (response.data.success) {
        setOtpTimer(60);
        setOtp(['', '', '', '', '', '']);
        otpRefs[0]?.current?.focus();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const validateStep2 = () => {
    if (!formData.shopName || !formData.shopType) {
      setError('Please fill shop name and type');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill all address fields');
      return false;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError('Please enter valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 2) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    if (!emailVerified) {
      setError('Please verify your email first');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/sellers/register', {
        email: formData.email,
        shopName: formData.shopName,
        shopType: formData.shopType,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        accountHolderName: formData.accountHolderName
      });
      
      if (response.data.success) {
        setSuccess(response.data.message);
        
        setTimeout(() => {
          navigate('/seller/login');
        }, 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
              s === step
                ? 'bg-orange-500 text-white'
                : s < step
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {s < step ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              s
            )}
          </div>
          {s < 4 && (
            <div className={`w-12 sm:w-20 h-1 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );

  // Step 1: Personal Info with OTP
  const renderStep1 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information & Email Verification</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          disabled={showOtpInput || emailVerified}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={showOtpInput || emailVerified}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60"
          placeholder="Enter your email"
        />
        {emailVerified && (
          <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Email verified
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          disabled={showOtpInput || emailVerified}
          maxLength={10}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60"
          placeholder="10-digit mobile number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={showOtpInput || emailVerified}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60"
          placeholder="Min 6 characters"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={showOtpInput || emailVerified}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60"
          placeholder="Re-enter password"
        />
      </div>

      {/* OTP Section */}
      {showOtpInput && !emailVerified && (
        <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Enter OTP</h3>
          <p className="text-sm text-gray-600 mb-4">
            We've sent a 6-digit OTP to <span className="font-medium">{formData.email}</span>
          </p>
          
          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={otpRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleVerifyOtp}
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>

          <div className="text-center mt-3">
            {otpTimer > 0 ? (
              <p className="text-sm text-gray-500">Resend OTP in {otpTimer}s</p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-orange-600 hover:underline text-sm font-medium"
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}

      {/* Send OTP Button */}
      {!showOtpInput && !emailVerified && (
        <button
          type="button"
          onClick={handleSendOtp}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Sending OTP...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send OTP to Email
            </>
          )}
        </button>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Shop Information</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
        <input
          type="text"
          name="shopName"
          value={formData.shopName}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter your shop/business name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shop Type *</label>
        <select
          name="shopType"
          value={formData.shopType}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Select shop type</option>
          {shopTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
        <input
          type="text"
          name="gstNumber"
          value={formData.gstNumber}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="15-digit GST number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number (Optional)</label>
        <input
          type="text"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleChange}
          maxLength={10}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 uppercase"
          placeholder="Enter PAN number"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Shop Address</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Shop/Building name, Street"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Landmark, Area"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="City"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            maxLength={6}
            className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="6-digit"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Select state</option>
          {indianStates.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Bank Details (For Payments)</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter bank name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
        <input
          type="text"
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Name as per bank records"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Enter account number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
        <input
          type="text"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          maxLength={11}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 uppercase"
          placeholder="11-character IFSC"
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="w-5 h-5 mt-0.5 text-orange-500 rounded focus:ring-orange-400"
          />
          <span className="text-sm text-gray-600">
            I agree to the <Link to="/terms" className="text-orange-600 hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>. I understand that my application will be reviewed and I will be notified via email.
          </span>
        </label>
      </div>
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Submitted!</h1>
          <p className="text-gray-600 mb-6">{success}</p>
          <p className="text-sm text-gray-500">Redirecting to seller login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <span className="text-2xl font-bold text-red-600">Shadi Card</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Seller</h1>
          <p className="text-gray-600">Join our marketplace and grow your business</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {renderStepIndicator()}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            {/* Navigation Buttons */}
            {step > 1 && (
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                )}
              </div>
            )}
          </form>

          {/* Already have account */}
          <p className="text-center text-gray-600 mt-6">
            Already have a seller account?{' '}
            <Link to="/seller/login" className="text-orange-600 hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800">1000+ Customers</h3>
            <p className="text-sm text-gray-500">Access to large customer base</p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800">Easy Payments</h3>
            <p className="text-sm text-gray-500">Weekly settlements to bank</p>
          </div>

          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800">Quick Setup</h3>
            <p className="text-sm text-gray-500">Start selling in 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopRegisterPage;
