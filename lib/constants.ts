// lib/constants.ts

/**
 * Key for storing the authentication token in cookies.
 * Using cookies makes the token available for both client-side and server-side (middleware) access.
 */
export const AUTH_TOKEN_KEY = "fitness_auth_token";

/**
 * Key for caching the user object in local storage.
 * Local storage is suitable for non-sensitive client-side data caching.
 */
export const USER_KEY = "fitness_user";
