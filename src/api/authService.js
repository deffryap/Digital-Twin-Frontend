import axios from 'axios';

const API_URL = 'YOUR_API_URL'; // Ganti dengan URL API yang sebenarnya

export const login = async (credentials) => {
  try {
    // Untuk testing, gunakan mock response
    // Dalam produksi, gunakan kode di bawah ini:
    // const response = await axios.post(`${API_URL}/login`, credentials);
    
    // Mock response untuk testing
    const mockResponse = {
      data: {
        token: 'dummy-token',
        user: {
          name: 'Test User',
          email: credentials.email
        }
      }
    };
    
    return mockResponse;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    // Untuk testing, gunakan mock response
    // Dalam produksi, gunakan kode di bawah ini:
    // const response = await axios.post(`${API_URL}/register`, userData);
    
    // Mock response untuk testing
    const mockResponse = {
      data: {
        message: 'Registration successful'
      }
    };
    
    return mockResponse;
  } catch (error) {
    throw error;
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};
