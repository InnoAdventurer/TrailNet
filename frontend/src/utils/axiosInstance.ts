// frontend/src/utils/axiosInstance.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from 'axios';

// Create an Axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.VITE_BACKEND_URL, // Base URL for the backend API
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('authToken'); // Get token from localStorage

    if (token) {
      // Ensure headers are initialized as AxiosHeaders
      config.headers = new AxiosHeaders(config.headers);

      // Set the Authorization header
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error) // Handle request errors
);

export default axiosInstance;