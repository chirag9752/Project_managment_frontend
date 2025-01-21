import axios from "axios";
// import toast from "react-hot-toast";

const apiClient = axios.create({
    baseURL: "http://localhost:3000", // Base URL for your API
    headers: {
        "Content-Type": "application/json",
    }
})

// Add a request intercepter
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response intercepter
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
    //     if(error.response && error.response.status === 401){
    //         toast.error("Unauthorized please login again");
    //     } else {
    //         toast.error(error.response.data.message || 'An error occured');
    //     }
        return Promise.reject(error);
    }
);

export default apiClient;

