import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Admin Auth API
export const adminAuth = {
  login: (credentials) => axios.post(`${API_URL}/admin/auth/login`, credentials),
  createAdmin: (data) => axios.post(`${API_URL}/admin/auth/create`, data),
};

// Admin Dashboard API
export const adminDashboard = {
  getStats: (token) => axios.get(`${API_URL}/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getRevenue: (token, days = 7) => axios.get(`${API_URL}/admin/dashboard/revenue?days=${days}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getOrdersChart: (token, days = 7) => axios.get(`${API_URL}/admin/dashboard/orders-chart?days=${days}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// Admin Orders API
export const adminOrders = {
  getAll: (token, params) => axios.get(`${API_URL}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  }),
  getById: (token, id) => axios.get(`${API_URL}/admin/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateStatus: (token, id, status) => axios.put(`${API_URL}/admin/orders/${id}/status`, 
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  ),
  getPDF: (token, id) => axios.get(`${API_URL}/admin/orders/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// Admin Designs API
export const adminDesigns = {
  getAll: (token, params) => axios.get(`${API_URL}/admin/designs`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  }),
  create: (token, data) => axios.post(`${API_URL}/admin/designs`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (token, id, data) => axios.put(`${API_URL}/admin/designs/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateStatus: (token, id, isActive) => axios.patch(`${API_URL}/admin/designs/${id}/status`, 
    { isActive },
    { headers: { Authorization: `Bearer ${token}` } }
  ),
  delete: (token, id) => axios.delete(`${API_URL}/admin/designs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// Admin Customers API
export const adminCustomers = {
  getAll: (token, params) => axios.get(`${API_URL}/admin/customers`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  }),
  getById: (token, id) => axios.get(`${API_URL}/admin/customers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  getOrders: (token, id) => axios.get(`${API_URL}/admin/customers/${id}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
};

// Admin Payments API
export const adminPayments = {
  getAll: (token, params) => axios.get(`${API_URL}/admin/payments`, {
    headers: { Authorization: `Bearer ${token}` },
    params
  }),
  markPaid: (token, id) => axios.put(`${API_URL}/admin/payments/${id}/mark-paid`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  refund: (token, id, reason) => axios.put(`${API_URL}/admin/payments/${id}/refund`, 
    { refundReason: reason },
    { headers: { Authorization: `Bearer ${token}` } }
  ),
};

// Admin Settings API
export const adminSettings = {
  getAll: (token) => axios.get(`${API_URL}/admin/settings`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  update: (token, settings) => axios.put(`${API_URL}/admin/settings`, 
    { settings },
    { headers: { Authorization: `Bearer ${token}` } }
  ),
  getByKey: (token, key) => axios.get(`${API_URL}/admin/settings/${key}`, {
    headers: { Authorization: `Bearer ${token}` }
  }),
  updateByKey: (token, key, value, type) => axios.put(`${API_URL}/admin/settings/${key}`, 
    { value, type },
    { headers: { Authorization: `Bearer ${token}` } }
  ),
};
