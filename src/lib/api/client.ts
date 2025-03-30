import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to automatically include the auth token
apiClient.interceptors.request.use(
  async (config) => {
    // For client-side requests, get the session to retrieve the token
    if (typeof window !== 'undefined') {
      const session = await getSession();
      
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // You could add token refresh logic here if needed
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Token refresh logic could go here
      
      // For now, just log the error
      console.error('Authentication error:', error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;