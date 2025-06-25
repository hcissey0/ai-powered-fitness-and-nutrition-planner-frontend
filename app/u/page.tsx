"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";
import { api } from "@/lib/axios";
import { observeTimeline } from "framer-motion";
import React from "react";
import { toast } from "sonner";

export default function Page() {
  const { user } = useAuth();

  const [onbordingOpen, setOnbordingOpen] = React.useState(false);
  React.useEffect(() => {
    if (user && !user.profile) {
      setOnbordingOpen(true);
    }
  }, [user]);


  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        <Button 
        onClick={async () => {
          const plans = await api.get("/users/me/plans/");
          toast.success("Plans fetched successfully");
          toast.info("Plans", {
            description: JSON.stringify(plans.data, null, 4),
            duration: 5000,
          })
        }}
        >
          get plans
        </Button>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="bg-muted/50 aspect-square rounded-xl" />
        ))}
      </div>
      <OnboardingDialog
        open={onbordingOpen}
        onComplete={() => {
          setOnbordingOpen(false);
          // toast.success("onboarding completed");
        }}
        onClose={() => {
          setOnbordingOpen(false);
          // toast.error("onboarding closed");
        }}
      />
    </>
  );
}
