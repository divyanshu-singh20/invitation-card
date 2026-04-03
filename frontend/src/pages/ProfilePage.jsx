import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { getProfile, setProfile } from '../utils/userStorage';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null');
    if (userData) {
      setUser(userData);
      // Load profile from user-specific storage
      const savedProfile = getProfile();
      setFormData({
        name: savedProfile.fullName || userData.name || '',
        email: savedProfile.email || userData.email || '',
        mobile: savedProfile.mobile || userData.mobile || '',
        address: {
          addressLine1: savedProfile.address || userData.address?.addressLine1 || '',
          addressLine2: userData.address?.addressLine2 || '',
          city: savedProfile.city || userData.address?.city || '',
          state: savedProfile.state || userData.address?.state || '',
          pincode: savedProfile.pincode || userData.address?.pincode || ''
        }
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Save to user-specific profile storage
      setProfile({
        fullName: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        address: formData.address.addressLine1,
        city: formData.address.city,
        state: formData.address.state,
        pincode: formData.address.pincode
      });
      
      setUser(updatedUser);
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (error) {
      showToast('Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Please Login</h2>
            <p className="text-gray-500 mb-6">Login to view your profile</p>
            <Link
              to="/login"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Login Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-xl p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-red-500 text-3xl font-bold">
                {formData.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{formData.name || 'User'}</h1>
                <p className="opacity-90">{formData.mobile || 'Add mobile number'}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="bg-white rounded-b-xl shadow-sm">
            {/* Quick Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b">
              <Link to="/my-orders" className="p-4 text-center hover:bg-gray-50 transition-colors border-r">
                <div className="text-2xl mb-1">📦</div>
                <div className="text-sm font-medium text-gray-700">My Orders</div>
              </Link>
              <Link to="/wishlist" className="p-4 text-center hover:bg-gray-50 transition-colors border-r">
                <div className="text-2xl mb-1">❤️</div>
                <div className="text-sm font-medium text-gray-700">Wishlist</div>
              </Link>
              <Link to="/cart" className="p-4 text-center hover:bg-gray-50 transition-colors border-r">
                <div className="text-2xl mb-1">🛒</div>
                <div className="text-sm font-medium text-gray-700">Cart</div>
              </Link>
              <Link to="/track-order" className="p-4 text-center hover:bg-gray-50 transition-colors">
                <div className="text-2xl mb-1">🚚</div>
                <div className="text-sm font-medium text-gray-700">Track Order</div>
              </Link>
            </div>

            {/* Profile Form */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-red-500 hover:text-red-600 font-medium text-sm"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-500 hover:text-gray-600 font-medium text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="text-green-500 hover:text-green-600 font-medium text-sm"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter mobile number"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Address Section */}
              <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-4">Delivery Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    name="address.addressLine1"
                    value={formData.address.addressLine1}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="House no, Building name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    name="address.addressLine2"
                    value={formData.address.addressLine2}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Street, Area, Landmark"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Pincode</label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Pincode"
                  />
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
