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
export const USER_KEY = "fitness_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem(AUTH_TOKEN_KEY) || Cookies.get(AUTH_TOKEN_KEY) || null;
    const savedUser = localStorage.getItem(USER_KEY) || Cookies.get(USER_KEY) || null;
    if (savedToken) {
      setToken(savedToken);
      setAuthToken(savedToken);
      Cookies.set(AUTH_TOKEN_KEY, savedToken, { expires: 7 }); // Set cookie with 7 days expiration
      localStorage.setItem(AUTH_TOKEN_KEY, savedToken); // Ensure localStorage is also set
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } else {
        api
          .get<User>("/users/me/")
          .then((res) => {
            setUser(res.data);
            localStorage.setItem(USER_KEY, JSON.stringify(res.data));
            Cookies.set(USER_KEY, JSON.stringify(res.data), { expires: 7 }); // Set
            redirect("/");
          })
          // .catch(() => logout());
      }
    }
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
      setAuthToken(tok);
      
      setToken(tok);
      setUser(res.data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      Cookies.set(USER_KEY, JSON.stringify(res.data.user), { expires: 7 }); //
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
      setAuthToken(tok);
      
      setToken(tok);
      setUser(res.data.user);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
      Cookies.set(USER_KEY, JSON.stringify(res.data.user), { expires: 7 }); //
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
    localStorage.removeItem(USER_KEY);
    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(USER_KEY);
    router.push("/auth/login");
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
