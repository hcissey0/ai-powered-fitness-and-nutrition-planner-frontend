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

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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
      handleApiError(err, "Login Failed");
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
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


/////////////////////////// old code ////////////////////

// "use client";
// import {
//   createContext,
//   useState,
//   useEffect,
//   useContext,
//   ReactNode,
// } from "react";
// import { redirect, useRouter } from "next/navigation";
// import { api, setAuthToken } from "@/lib/axios"; // custom axios setup
// import Cookies from "js-cookie";
// import { User } from "@/interfaces"; // Assuming you have a User interface defined
// import { toast } from "sonner";
// import { handleApiError } from "@/lib/error-handler";

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (username: string, password: string) => Promise<void>;
//   logout: () => void;
//   signup: (
//     first_name: string,
//     last_name: string,
//     email: string,
//     username: string,
//     password: string
//   ) => Promise<void>;
//   refreshUser: ()=>void;
// }

// export const AUTH_TOKEN_KEY = "fitness_auth_token";
// export const USER_KEY = "fitness_user";

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const savedToken =
//       localStorage.getItem(AUTH_TOKEN_KEY) ||
//       Cookies.get(AUTH_TOKEN_KEY) ||
//       null;
//     const savedUser =
//       localStorage.getItem(USER_KEY) || Cookies.get(USER_KEY) || null;
//     if (savedToken) {
//       setToken(savedToken);
//       setAuthToken(savedToken);
//       Cookies.set(AUTH_TOKEN_KEY, savedToken, { expires: 7 }); // Set cookie with 7 days expiration
//       localStorage.setItem(AUTH_TOKEN_KEY, savedToken); // Ensure localStorage is also set
//       if (savedUser) {
//         const userData = JSON.parse(savedUser);
//         setUser(userData);
//       } else {
//         api.get<User>("/users/me/").then((res) => {
//           setUser(res.data);
//           localStorage.setItem(USER_KEY, JSON.stringify(res.data));
//           Cookies.set(USER_KEY, JSON.stringify(res.data), { expires: 7 }); // Set
//           redirect("/");
//         });
//         // .catch(() => logout());
//       }
//     }
//   }, []);

//   const refreshUser = async () => {
//     try {
//       const userRes = await api.get("/users/me/");
//       if (userRes.status === 200) {
//         const user = userRes.data;
//         localStorage.setItem("fitness_user", JSON.stringify(user));
//         Cookies.set("fitness_user", JSON.stringify(user), { expires: 7 }); // Set cookie with 7 days expiration
//         setUser(user);
//         console.log("User data updated:", user);
//       } else {
//         setUser(null);
//         localStorage.removeItem("fitness_user");
//         Cookies.remove("fitness_user"); // Remove cookie if user data is not available
//       }
//     } catch (error) {
//       handleApiError(error, "Error refreshing user.")
//     }
//   };

//   const signup = async (
//     first_name: string,
//     last_name: string,
//     email: string,
//     username: string,
//     password: string
//   ) => {
//     try {
//       const res = await api.post<{ token: string; user: User }>(
//         "/auth/signup/",
//         {
//           first_name,
//           last_name,
//           email,
//           username,
//           password,
//         }
//       );
//       const tok = res.data.token;
//       localStorage.setItem(AUTH_TOKEN_KEY, tok);
//       Cookies.set(AUTH_TOKEN_KEY, tok, { expires: 7 }); // Set cookie with 7 days expiration
//       setAuthToken(tok);

//       setToken(tok);
//       setUser(res.data.user);
//       localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
//       Cookies.set(USER_KEY, JSON.stringify(res.data.user), { expires: 7 }); //
//       router.push("/");
//     } catch (err) {
//       throw err;
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       const res = await api.post<{ token: string; user: User }>(
//         "/auth/login/",
//         {
//           email,
//           password,
//         }
//       );
//       const tok = res.data.token;
//       localStorage.setItem(AUTH_TOKEN_KEY, tok);
//       Cookies.set(AUTH_TOKEN_KEY, tok, { expires: 7 }); // Set cookie with 7 days expiration
//       setAuthToken(tok);

//       setToken(tok);
//       setUser(res.data.user);
//       localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
//       Cookies.set(USER_KEY, JSON.stringify(res.data.user), { expires: 7 }); //
//       router.push("/");
//     } catch (err) {
//       throw err;
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     setAuthToken(null);
//     localStorage.removeItem(AUTH_TOKEN_KEY);
//     localStorage.removeItem(USER_KEY);
//     Cookies.remove(AUTH_TOKEN_KEY);
//     Cookies.remove(USER_KEY);
//     router.push("/auth/login");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, token, isAuthenticated: !!token, login, logout, signup, refreshUser }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };
