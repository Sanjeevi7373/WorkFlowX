import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

/**
 * WorkFlowX API Service Client
 * Configured for Spring Boot REST API integration.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Attach JWT authentication token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('workflowx_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Global response and error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized error (e.g. redirect to login or clear token)
      localStorage.removeItem('workflowx_token');
    }
    return Promise.reject(error);
  }
);
export default apiClient;
