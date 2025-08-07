// app/auth/layout.tsx
import { Heart, Dumbbell } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-mute flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <div className="flex flex-col items-center gap-2 self-center font-medium no-underline">
          <div className="flex -space-x-2">
            <div className=" bg-accent/50 shadow-md p-2 items-center justify-center rounded-full">
              <Heart className="size-6" />
            </div>
            <div className=" bg-primary/50 shadow-md p-2 items-center justify-center rounded-full">
              <Dumbbell className="size-6" />
            </div>
          </div>
          <h1 className="font-bold text-4xl tracking-tight">FitPal</h1>
        </div>
        {children}
        <div className="text-muted-foreground text-center text-xs text-balance ">
          By continuing, you agree to our <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
