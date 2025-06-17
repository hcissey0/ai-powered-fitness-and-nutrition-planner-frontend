import axios from 'axios';

const apiUrl = process.env.API_URL || 'http://localhost:8000/api/';

export const api = axios.create({
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
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
}

