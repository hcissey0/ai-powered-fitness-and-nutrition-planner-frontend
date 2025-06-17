"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, setAuthToken } from "@/lib/axios"; // custom axios setup
import Cookies from "js-cookie";

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string; // optional, depending on your user model
  profile?: {
    avatar?: string;
  }
  // add more fields based on your backend response
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AUTH_TOKEN_KEY = "auth_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY) || Cookies.get(AUTH_TOKEN_KEY) || null;
    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken);
      api
        .get<User>("/users/me/")
        .then((res) => setUser(res.data))
        .catch(() => logout());
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<{ token: string }>("/auth/", {
        email,
        password,
      });
      const tok = res.data.token;
      localStorage.setItem(AUTH_TOKEN_KEY, tok);
      Cookies.set(AUTH_TOKEN_KEY, tok, { expires: 7 }); // Set cookie with 7 days expiration
      
      setToken(tok);
      setAuthToken(tok);
      const profile = await api.get<User>("/users/me/");
      setUser(profile.data);
      router.push("/");
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    Cookies.remove(AUTH_TOKEN_KEY);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
