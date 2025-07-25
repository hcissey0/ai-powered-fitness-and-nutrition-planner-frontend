'use client';
import { Dumbbell, GalleryVerticalEnd, Heart, Loader2Icon, LoaderIcon, Zap } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { handleApiError } from "@/lib/error-handler";
import { useAuth } from "@/context/auth-context";
import React from "react";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // alert('button clicked')
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
  return (
    // <form onSubmit={handleSubmit}></form>
      <div className="glass p-6 rounded-xl space-y-4">

      
      <div className="grid gap-6">
        <div className="grid gap-6">
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
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto text-sm"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              className="glass-card"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // placeholder="••••••••"
              required
              autoComplete={"off"}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            // size={"lg"}
            className="cyber-butto text-white shadow-md w-full rounded-full font-semibold"
            onClick={handleSubmit}
          >
            <Loader2Icon className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : "hidden"}`} />
            <Zap className={`h-4 w-4 mr-1 ${isLoading ? 'hidden': 'animate-ping'}`}  />
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
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
