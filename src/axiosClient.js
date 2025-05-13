import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ACCESS_TOKEN");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        
        // Handle authentication errors
        if (response && response.status === 401) {
            localStorage.removeItem("ACCESS_TOKEN");
            localStorage.removeItem("role");
            
            // If there's a "unauthenticated" message, redirect to login
            if (response.data.message === 'Unauthenticated.') {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosClient;