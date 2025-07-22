import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.API_URL || 'http://localhost:8000/api/';

export const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withXSRFToken: true, // Enable CSRF protection if your backend supports it
    // withCredentials: true, // Include cookies in requests
});

const plainAxios = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withXSRFToken: true, // Enable CSRF protection if your backend supports it
    // withCredentials: true, // Include cookies in requests
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        plainAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
        delete plainAxios.defaults.headers.common['Authorization'];
    }
}


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