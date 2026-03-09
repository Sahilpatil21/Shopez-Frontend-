import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend-url.onrender.com/api' // Replace with your backend URL after deployment
  : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token for all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (credentials) => {
    console.log('Login API call:', credentials);
    return api.post('/users/login', credentials);
  },
  register: (userData) => {
    console.log('Register API call:', userData);
    return api.post('/users/register', userData);
  },
  getProfile: () => api.get('/users/profile'),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Product APIs
export const productAPI = {
  getProducts: () => api.get('/products'),
  getProductById: (id) => api.get(`/products/${id}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
};

// Cart APIs
export const cartAPI = {
  getCart: (userId) => api.get(`/cart/${userId}`),
  addToCart: (cartData) => api.post('/cart/add', cartData),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  updateCart: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
};

// Order APIs
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders/create', orderData),
  getOrders: (userId) => api.get(`/orders/${userId}`),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

// Admin APIs
export const adminAPI = {
  // Product Management
  getProducts: () => api.get('/admin/products'),
  addProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Order Management
  getOrders: () => api.get('/admin/orders'),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
  
  // User Management
  getUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Analytics
  getStats: () => api.get('/admin/stats'),
  getSalesReport: (startDate, endDate) => api.get(`/admin/sales?start=${startDate}&end=${endDate}`),
};

export default api;
