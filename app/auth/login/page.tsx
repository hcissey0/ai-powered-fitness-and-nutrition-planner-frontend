// app/auth/login/page.tsx
"use client";
import {
  Dumbbell,
  GalleryVerticalEnd,
  Heart,
  Loader2Icon,
  LoaderIcon,
  Zap,
} from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error-handler";
import { useAuth } from "@/context/auth-context";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Separator } from "@/components/ui/separator";


const GoogleLogo = ({className}: {className?:string}) => (
<div className={className}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
            </div>
)

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      if (!email || !password) {
        toast.error("Email and password are required");
        return;
      }
      await login(email, password);
      // Redirect or show success message
    } catch (error) {
      handleApiError(error, "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    scope: "email profile https://www.googleapis.com/auth/calendar",
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        await loginWithGoogle(tokenResponse.access_token);
      } catch (error) {
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      toast.error("Google Login Failed", {
        description: "The Google Login Process could not be completed.",
      });
    },
  });
  return (
    <div className="glass p-6 rounded-xl space-y-4">
      <div className="grid gap-6">
        {/* Email and Password Form */}
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              className="glass-card"
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || isGoogleLoading}
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="ml-auto text-sm">
                Forgot your password?
              </a>
            </div>
            <Input
              className="glass-card"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={"off"}
              disabled={isLoading || isGoogleLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="cyber-button text-foreground shadow-md w-full rounded-full font-semibold"
          >
            <Loader2Icon
              className={`h-4 w-4 mr-1 ${
                isLoading ? "animate-spin" : "hidden"
              }`}
            />
            <Zap
              className={`h-4 w-4 mr-1 ${
                isLoading ? "hidden" : "animate-ping"
              }`}
            />
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* --- OR Separator --- */}

        <Separator orientation="horizontal" decorative />

        {/* --- Google Button --- */}
        <Button
          // variant="outline"
          type="button"
          className="glass w-full rounded-full font-semibold text-foregroundround"
          disabled={isLoading || isGoogleLoading}
          onClick={() => handleGoogleLogin()}
        >
          {isGoogleLoading ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            // <FcGoogle className="mr-2 h-4 w-4" />
            <GoogleLogo />
          )}
          Login with Google
        </Button>

        {/* --- Signup Link --- */}
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
//   return (
//     <form onSubmit={handleSubmit}>

//       <div className="glass p-6 rounded-xl space-y-4">

//       <div className="grid gap-6">
//         <div className="grid gap-6">
//           <div className="grid gap-3">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               className="glass-card"
//               id="email"
//               type="email"
//               placeholder="m@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="grid gap-3">
//             <div className="flex items-center">
//               <Label htmlFor="password">Password</Label>
//               <a
//                 href="#"
//                 className="ml-auto text-sm"
//               >
//                 Forgot your password?
//               </a>
//             </div>
//             <Input
//               className="glass-card"
//               id="password"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               // placeholder="••••••••"
//               required
//               autoComplete={"off"}
//             />
//           </div>
//           <Button
//             type="submit"
//             disabled={isLoading}
//             // size={"lg"}
//             className="cyber-butto text-foreground shadow-md w-full rounded-full font-semibold"
//             onClick={handleSubmit}
//           >
//             <Loader2Icon className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : "hidden"}`} />
//             <Zap className={`h-4 w-4 mr-1 ${isLoading ? 'hidden': 'animate-ping'}`}  />
//             {isLoading ? "Logging in..." : "Login"}
//           </Button>
//         </div>
//         <div className="text-center text-sm">
//           Don&apos;t have an account?{" "}
//           <a href="/auth/signup" className="">
//             Sign up
//           </a>
//         </div>
//       </div>
//       </div>
//               </form>

//   );
// }
