import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'https://mentor-app-4dhx.onrender.com/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Variable to hold the store instance
export const injectStore = (_store) => {
    store = _store;
};

// Variable to hold the store instance
let store;

// Request interceptor to add token to headers
api.interceptors.request.use(
    (config) => {
        // Token is sent via cookies, but we can also add it to headers if needed
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle specific error cases
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - clear token and redirect to login
                localStorage.removeItem('token');
                // Dispatch Redux action to clear user state if store is available
                if (store) {
                    store.dispatch({ type: 'user/removeUser' });
                }
            }

            // Return the error message from server
            return Promise.reject(data);
        } else if (error.request) {
            // Request was made but no response received
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        } else {
            // Something else happened
            return Promise.reject({ message: 'An unexpected error occurred.' });
        }
    }
);

export default api;
