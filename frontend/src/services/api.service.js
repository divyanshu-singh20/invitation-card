import api from '../utils/api';

export const designService = {
  // Get all designs with filters
  getDesigns: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.featured) params.append('featured', 'true');
    
    const response = await api.get(`/designs?${params.toString()}`);
    return response.data;
  },
  
  // Get design by ID
  getDesignById: async (id) => {
    const response = await api.get(`/designs/${id}`);
    return response.data;
  },
  
  // Get categories
  getCategories: async () => {
    const response = await api.get('/designs/categories/list');
    return response.data;
  }
};

export const customizationService = {
  // Create customization
  createCustomization: async (data) => {
    const response = await api.post('/customizations', data);
    return response.data;
  },
  
  // Get customization by ID
  getCustomization: async (id) => {
    const response = await api.get(`/customizations/${id}`);
    return response.data;
  },
  
  // Update customization
  updateCustomization: async (id, data) => {
    const response = await api.put(`/customizations/${id}`, data);
    return response.data;
  }
};

export const orderService = {
  // Create order
  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  
  // Verify payment
  verifyPayment: async (data) => {
    const response = await api.post('/orders/verify-payment', data);
    return response.data;
  },
  
  // Get order by ID
  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  
  // Track order
  trackOrder: async (data) => {
    const response = await api.post('/orders/track', data);
    return response.data;
  },
  
  // Get user orders
  getUserOrders: async (userId) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  }
};

export const userService = {
  // Send OTP
  sendOTP: async (mobile) => {
    const response = await api.post('/users/send-otp', { mobile });
    return response.data;
  },
  
  // Verify OTP
  verifyOTP: async (mobile, otp) => {
    const response = await api.post('/users/verify-otp', { mobile, otp });
    return response.data;
  },
  
  // Get user profile
  getProfile: async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  },
  
  // Update profile
  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/profile/${userId}`, data);
    return response.data;
  },
  
  // Add address
  addAddress: async (userId, data) => {
    const response = await api.post(`/users/address/${userId}`, data);
    return response.data;
  }
};
