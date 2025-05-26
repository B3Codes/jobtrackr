import axios from 'axios';

// create instance with baseURL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to attach token with each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if(token){
    config.headers.Authorization = `Bearer ${token}` ;
  }
  return config;
})

// RESPONSE INTERCEPTOR – Detect expired JWT
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');

      // reload page to clear state
      window.location.href="/login";
    }

    return Promise.reject(error);
  }
)

export default API;