import axios from "axios";
import Cookies from "js-cookie";

// IMPORTANT: For client-side code, Next.js requires the prefix NEXT_PUBLIC_
// Ensure this variable is set in your .env.local file
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/";

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withXSRFToken: true,
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

////////////////////////// Old Code /////////////////////////////

// import axios, { AxiosResponse } from 'axios';
// import Cookies from 'js-cookie';

// const apiUrl = process.env.API_URL || 'http://localhost:8000/api/';

// export const api = axios.create({
//     baseURL: apiUrl,
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     withXSRFToken: true, // Enable CSRF protection if your backend supports it
//     // withCredentials: true, // Include cookies in requests
// });

// const plainAxios = axios.create({
//     baseURL: apiUrl,
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     withXSRFToken: true, // Enable CSRF protection if your backend supports it
//     // withCredentials: true, // Include cookies in requests
// });

// export const setAuthToken = (token: string | null) => {
//     if (token) {
//         api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//         plainAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//         delete api.defaults.headers.common['Authorization'];
//         delete plainAxios.defaults.headers.common['Authorization'];
//     }
// }

// api.interceptors.response.use(
//     async (response: AxiosResponse) => {
//         try {
//             console.log('Response received:', response);
//             const userRes = await plainAxios.get('/users/me/');
//             if (userRes.status === 200) {
//                 const user = userRes.data;
//                 localStorage.setItem('fitness_user', JSON.stringify(user));
//                 Cookies.set('fitness)user', JSON.stringify(user), { expires: 7 }); // Set cookie with 7 days expiration
//                 console.log('User data updated:', user);
//             } else {
//                 localStorage.removeItem('fitness_user');
//                 Cookies.remove('fitness_user'); // Remove cookie if user data is not available
//             }
//         } catch (error) {
//             // console.error('Error fetching user data:', error);
//         }
//         return response;
//     },
//     async (error) => {
//         try {
//             const userRes = await plainAxios.get('/users/me/');
//             if (userRes.status === 200) {
//                 const user = userRes.data;
//                 localStorage.setItem('fitness_user', JSON.stringify(user));
//                 Cookies.set('fitness_user', JSON.stringify(user), { expires: 7 }); // Set cookie with 7 days expiration
//                 console.log('User data updated:', user);
//             } else {
//                 localStorage.removeItem('fitness_user');
//                 Cookies.remove('fitness_user'); // Remove cookie if user data is not available
//             }
//         } catch (error) {
//             // console.error('Error fetching user data:', error);
//         }
//         return Promise.reject(error);
//         }

// )
