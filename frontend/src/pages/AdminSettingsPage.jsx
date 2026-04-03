import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { adminSettings } from '../services/admin.service';

const AdminSettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    deliveryDays: { value: '7', type: 'number' },
    whatsappNumber: { value: '+919876543210', type: 'text' },
    termsAndConditions: { value: '', type: 'text' },
    privacyPolicy: { value: '', type: 'text' },
    refundPolicy: { value: '', type: 'text' },
    minOrderQuantity: { value: '100', type: 'number' },
    shippingCharges: { value: '0', type: 'number' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchSettings(token);
  }, [navigate]);

  const fetchSettings = async (token) => {
    try {
      const response = await adminSettings.getAll(token);
      if (response.data.success) {
        setSettings(response.data.settings);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings({
      ...settings,
      [key]: {
        ...settings[key],
        value
      }
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
    setSaving(true);

    try {
      await adminSettings.update(token, settings);
      alert('Settings updated successfully');
    } catch (err) {
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Website Settings</h2>

          <div className="space-y-6">
            {/* Delivery Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Delivery Days (Default Timeline)
                  </label>
                  <input
                    type="number"
                    value={settings.deliveryDays?.value || '7'}
                    onChange={(e) => handleChange('deliveryDays', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Number of days for standard delivery</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Minimum Order Quantity
                  </label>
                  <input
                    type="number"
                    value={settings.minOrderQuantity?.value || '100'}
                    onChange={(e) => handleChange('minOrderQuantity', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Minimum cards per order</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Shipping Charges (₹)
                  </label>
                  <input
                    type="number"
                    value={settings.shippingCharges?.value || '0'}
                    onChange={(e) => handleChange('shippingCharges', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Additional shipping charges</p>
                </div>
              </div>
            </div>

            <hr />

            {/* Contact Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Settings</h3>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  WhatsApp Business Number
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber?.value || ''}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="+919876543210"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-sm text-gray-500 mt-1">Include country code (e.g., +91)</p>
              </div>
            </div>

            <hr />

            {/* Policies */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Policies</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={settings.termsAndConditions?.value || ''}
                    onChange={(e) => handleChange('termsAndConditions', e.target.value)}
                    rows="4"
                    placeholder="Enter your terms and conditions..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Privacy Policy
                  </label>
                  <textarea
                    value={settings.privacyPolicy?.value || ''}
                    onChange={(e) => handleChange('privacyPolicy', e.target.value)}
                    rows="4"
                    placeholder="Enter your privacy policy..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Refund Policy
                  </label>
                  <textarea
                    value={settings.refundPolicy?.value || ''}
                    onChange={(e) => handleChange('refundPolicy', e.target.value)}
                    rows="4"
                    placeholder="Enter your refund policy..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              onClick={() => fetchSettings(localStorage.getItem('adminToken'))}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            <strong>Note:</strong> Changes to settings will be reflected immediately on the public website.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
