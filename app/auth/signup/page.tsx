// app/auth/signup/page.tsx
"use client";
import {
  Dumbbell,
  GalleryVerticalEnd,
  Heart,
  Loader2Icon,
  Zap,
} from "lucide-react";

import { LoginForm } from "@/components/login-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { handleApiError } from "@/lib/error-handler";
import { useAuth } from "@/context/auth-context";
import React from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const { signup } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate registration logic

      if (
        !firstName ||
        !lastName ||
        !username ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        toast.error("All fields are required.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      // Simulate a successful registration
      await signup({
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
      });
      toast.success("Registration successful! Logging in...");
      // Redirect or show success message here
    } catch (error) {
      handleApiError(error, "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleRegister} className="space-y-4 glass p-6 rounded-xl ">
      <div className="space-y-2">
        <Label htmlFor="firstName" className="text-foreground">
          First Name
        </Label>
        <Input
          id="firstName"
          type="text"
          placeholder="Kwame"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="glass-card"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName" className="text-foreground">
          Last Name
        </Label>
        <Input
          id="lastName"
          type="text"
          placeholder="Asante"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="glass-card"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username" className="text-foreground">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="kwame_asante"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="glass-card"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="glass-card"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          // placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="glass-card"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          // placeholder="••••••••"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="glass-card"
        />
      </div>
      <Button
        type="submit"
        className="w-full cyber-button text-foreground font-semibold rounded-full"
        disabled={isLoading}
      >
        <Loader2Icon
          className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : "hidden"}`}
        />
        <Zap
          className={`h-4 w-4 mr-1 ${isLoading ? "hidden" : "animate-ping"}`}
        />
        {isLoading ? "Creating account..." : "Create Account"}
      </Button>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/auth/login" className="">
          Login
        </a>
      </div>
    </form>
  );
}
