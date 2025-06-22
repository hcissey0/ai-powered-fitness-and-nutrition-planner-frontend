"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { redirect, useRouter } from "next/navigation";
import { api, setAuthToken } from "@/lib/axios"; // custom axios setup
import Cookies from "js-cookie";
import { User } from "@/interfaces"; // Assuming you have a User interface defined
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
}

export const AUTH_TOKEN_KEY = "fitness_auth_token";

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
      Cookies.set(AUTH_TOKEN_KEY, savedToken, { expires: 7 }); // Set cookie with 7 days expiration
      localStorage.setItem(AUTH_TOKEN_KEY, savedToken); // Ensure localStorage is also set
      api
        .get<User>("/users/me/")
        .then((res) => {console.log(res);setUser(res.data);redirect("/")})
        // .catch(() => logout());
    }
    console.log(user, token, savedToken)
  }, []);

  const signup = async (first_name: string, last_name: string, email: string, username: string, password: string) => {
    try {
      const res = await api.post<{ token: string, user: User }>("/auth/signup/", {
        first_name,
        last_name,
        email,
        username,
        password,
      });
      const tok = res.data.token;
      localStorage.setItem(AUTH_TOKEN_KEY, tok);
      Cookies.set(AUTH_TOKEN_KEY, tok, { expires: 7 }); // Set cookie with 7 days expiration
      
      setToken(tok);
      setAuthToken(tok);
      setUser(res.data.user);
      router.push("/");
    } catch (err) {
    
      throw err;
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<{ token: string, user: User }>("/auth/login/", {
        email,
        password,
      });
      const tok = res.data.token;
      localStorage.setItem(AUTH_TOKEN_KEY, tok);
      Cookies.set(AUTH_TOKEN_KEY, tok, { expires: 7 }); // Set cookie with 7 days expiration
      
      setToken(tok);
      setAuthToken(tok);
      setUser(res.data.user);
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
      value={{ user, token, isAuthenticated: !!token, login, logout, signup }}
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
