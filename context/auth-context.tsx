// context/auth-context.tsx
"use client";
import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { api, setAuthToken } from "@/lib/axios";
import Cookies from "js-cookie";
import { User } from "@/interfaces";
import { handleApiError } from "@/lib/error-handler";
import { AUTH_TOKEN_KEY, USER_KEY } from "@/lib/constants";
import { loginWithGoogle as apiLoginWithGoogle, deleteMe } from "@/lib/api-service";
import { toast } from "sonner";
import { useGoogleLogin } from "@react-oauth/google";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
  deleteMyAccount: () => void;
  logout: () => void;
  signup: (
    formData: Omit<User, "id" | "is_active" | "date_joined" | "profile"> & {
      password?: string;
    }
  ) => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    Cookies.remove(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    router.push("/auth/login");
  }, [router]);

  const refreshUser = async () => {
    try {
      const res = await api.get<User>("/users/me/");
      setUser(res.data);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data));
      return res.data;
    } catch (error) {
      handleApiError(error, "Session expired. Please log in again.");
      logout();
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const savedToken = Cookies.get(AUTH_TOKEN_KEY);
      if (savedToken) {
        setAuthToken(savedToken);
        setToken(savedToken);
        await refreshUser();
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const persistAuth = (tok: string, usr: User) => {
    setToken(tok);
    setUser(usr);
    setAuthToken(tok);
    Cookies.set(AUTH_TOKEN_KEY, tok, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
    });
    localStorage.setItem(USER_KEY, JSON.stringify(usr));
  };

  const signup = async (
    formData: Omit<User, "id" | "is_active" | "date_joined" | "profile"> & {
      password?: string;
    }
  ) => {
    try {
      const res = await api.post<{ token: string; user: User }>(
        "/auth/signup/",
        formData
      );
      persistAuth(res.data.token, res.data.user);
      router.push("/u");
    } catch (err) {
      handleApiError(err, "Signup Failed");
      throw err;
    }
  };

  const login = async (email: string, password: string) => {

    try {
      const res = await api.post<{ token: string; user: User }>(
        "/auth/login/",
        { email, password }
      );
      persistAuth(res.data.token, res.data.user);
      router.push("/u");
    } catch (err) {
      // handleApiError(err, "Login Failed");
      throw err;
    }
  };

  const deleteMyAccount = async () => {
    try {
      await deleteMe();
      await logout();
    } catch (e) {
      handleApiError(e, "Failed to delete Account");
      throw e;
    }
  }


  const loginWithGoogle = async (accessToken: string) => {
    try {
      const res = await apiLoginWithGoogle(accessToken);
      console.log("Google Login Response:", res);
      persistAuth(res.token, res.user);
      router.push('/u');

    } catch (err) {
      handleApiError(err, "Google Login Failed")
      throw err
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        loginWithGoogle,
        deleteMyAccount,
        logout,
        signup,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
