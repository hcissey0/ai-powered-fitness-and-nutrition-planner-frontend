// lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

// IMPORTANT: For client-side code, Next.js requires the prefix NEXT_PUBLIC_
// Ensure this variable is set in your .env.local file
const apiUrl =
  process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withXSRFToken: true,
  // withCredentials: true,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Add a response interceptor for handling global errors, like authentication
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      // This is a global handler for unauthorized access.
      // It will clear user session and redirect to login.
      setAuthToken(null);
      Cookies.remove("fitness_auth_token"); // Assuming you store the token in a cookie named 'fitness_auth_token'

      // We use window.location to force a page reload, which is effective for re-rendering the app state
      // and leveraging Next.js routing.
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
