import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DataProvider } from "@/context/data-context";
import { TodaysDateBreadcrumb } from "@/components/todays-date-breadcrumb"; // Import the new component

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataProvider>
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
              <TodaysDateBreadcrumb /> {/* Use the new component here */}
            </div>
            <ModeToggle />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 max-w-7x max-w-[2046px] xl:mx-auto">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DataProvider>
  );
}
