import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: unknown; detail?: unknown }
      | string
      | undefined;
    if (typeof responseData === 'string' && responseData.trim()) return responseData;
    if (responseData && typeof responseData === 'object') {
      if (typeof responseData.message === 'string' && responseData.message.trim()) return responseData.message;
      if (typeof responseData.detail === 'string' && responseData.detail.trim()) return responseData.detail;
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      return 'We could not sign you in. Check your email and password, then try again.';
    }
  }
  return fallback;
};

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
    // Login and registration are public endpoints. A stale token from an old
    // session must not be allowed to affect these requests.
    const isAuthRequest = config.url?.startsWith('/auth/');
    if (token && config.headers && !isAuthRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (isAuthRequest) {
      delete config.headers.Authorization;
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
