// Get the backend API URL based on environment
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:8000';
  }
  
  // Production fallback - replace with your deployed backend URL
  return 'https://your-backend-url.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
    QR: {
        GENERATE: '/api/qr/generate',
        CHECK_STATUS: '/api/qr/session'
    },
    ATTENDANCE: {
        SUBMIT: '/api/attendance/submit'
    }
};




