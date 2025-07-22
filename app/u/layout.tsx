import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { OnboardingDialog } from "@/components/onboarding-dialog";
import { ModeToggle } from "@/components/theme-provider";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset, SidebarTrigger,  } from "@/components/ui/sidebar";
import { DataProvider } from "@/context/data-context";

import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <SidebarProvider>
      <AppSidebar className="glass-sidebar" />
      <SidebarInset className="bg-transparent">
        <header className="glass-header sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 px-4 z-50">
          
          <div className="flex gap-2 items-center">
<SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>October 2024</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </div>
          {/* <div className="flex gap-2 items-center">
            <NavUser />
            </div> */}
          
          
        </header>
        <div className=" flex flex-1 flex-col gap-4 p-4 max-w-7xl xl:mx-auto">
            <DataProvider>
            {children}
            </DataProvider>
        </div>
        
      </SidebarInset>
    </SidebarProvider>
  );
}