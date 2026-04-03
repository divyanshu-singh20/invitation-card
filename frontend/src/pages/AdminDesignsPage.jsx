import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { adminDesigns } from '../services/admin.service';

const AdminDesignsPage = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'hindu',
    price: '',
    images: [''],
    paperTypes: ['Standard'],
    tags: []
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchDesigns(token);
  }, [navigate]);

  const fetchDesigns = async (token) => {
    try {
      const response = await adminDesigns.getAll(token);
      setDesigns(response.data.designs);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem('adminToken');
    try {
      await adminDesigns.updateStatus(token, id, !currentStatus);
      fetchDesigns(token);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleEdit = (design) => {
    setEditingDesign(design);
    setFormData({
      name: design.name,
      description: design.description,
      category: design.category,
      price: design.price,
      images: design.images,
      paperTypes: design.paperTypes || ['Standard'],
      tags: design.tags || []
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      if (editingDesign) {
        await adminDesigns.update(token, editingDesign._id, formData);
      } else {
        await adminDesigns.create(token, formData);
      }
      
      setShowModal(false);
      setEditingDesign(null);
      fetchDesigns(token);
      resetForm();
    } catch (err) {
      alert('Failed to save design');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'hindu',
      price: '',
      images: [''],
      paperTypes: ['Standard'],
      tags: []
    });
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Designs</h2>
        <button
          onClick={() => {
            setEditingDesign(null);
            resetForm();
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
        >
          + Add New Design
        </button>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-12">Loading designs...</div>
        ) : designs.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">No designs found</div>
        ) : (
          designs.map((design) => (
            <div key={design._id} className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={design.images[0]}
                alt={design.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{design.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    design.isActive 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {design.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2 capitalize">{design.category}</p>
                <p className="text-lg font-bold text-gray-800 mb-4">₹{design.price}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(design)}
                    className="flex-1 bg-indigo-50 text-indigo-600 px-3 py-2 rounded text-sm font-semibold hover:bg-indigo-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(design._id, design.isActive)}
                    className={`flex-1 px-3 py-2 rounded text-sm font-semibold ${
                      design.isActive
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {design.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {editingDesign ? 'Edit Design' : 'Add New Design'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="hindu">Hindu</option>
                      <option value="muslim">Muslim</option>
                      <option value="christian">Christian</option>
                      <option value="modern">Modern</option>
                      <option value="traditional">Traditional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Price (₹)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.images[0]}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    required
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700"
                  >
                    {editingDesign ? 'Update Design' : 'Add Design'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingDesign(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDesignsPage;
