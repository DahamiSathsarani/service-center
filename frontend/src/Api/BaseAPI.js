import axios from "axios";
import { getAuthToken, removeAuthToken } from "../Helpers/LocalStorage";
import { setGlobalLoading } from "../Helpers/LoadingState";

const Base_Url = process.env.REACT_APP_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL: Base_Url,
  withCredentials: true,
});

// Request interceptor: Add token to headers and show loader
axiosInstance.interceptors.request.use(
  (config) => {
    setGlobalLoading(true); // Show loader globally
    const token = getAuthToken();
    const isLoginPage = window.location.pathname === "/login";

    // Prevent API calls if user is on the login page
    if (!token && !isLoginPage) {
      console.warn("No token found, redirecting to login...");
      window.location.href = "/login";
      return Promise.reject({ message: "No auth token" });
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    setGlobalLoading(false);
    return Promise.reject(error);
  }
);

// Response interceptor: Hide loader and handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    setGlobalLoading(false);
    return response;
  },
  (error) => {
    setGlobalLoading(false);

    if (error.response && error.response.status === 401) {
      console.warn("Token expired or user unauthorized. Logging out...");
      removeAuthToken();

      // Redirect to login only if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
