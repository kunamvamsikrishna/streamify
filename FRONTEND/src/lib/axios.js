import axios from "axios";

// IMPORTANT: VITE_API_URL must end with /api (e.g., https://your-backend.onrender.com/api)
// This is because the backend routes are mounted at /api/auth, /api/users, etc.
let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Ensure the URL ends with /api (safeguard against misconfiguration)
if (!baseURL.endsWith('/api')) {
  console.warn(`⚠️ VITE_API_URL should end with /api. Current value: ${baseURL}`);
  console.warn(`⚠️ Auto-correcting to: ${baseURL}/api`);
  baseURL = `${baseURL}/api`;
}

// Always log the API URL (helps with debugging deployment issues)
console.log("🌐 API Base URL:", baseURL);

const axiosinstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 10000, // 10 second timeout
})

// Add request interceptor for debugging
axiosinstance.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosinstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error("API Request Timeout:", error.config.url);
    } else if (error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("API Network Error - No response received:", error.request);
    } else {
      console.error("API Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosinstance;