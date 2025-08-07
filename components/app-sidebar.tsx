// components/app-sidebar.tsx
"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartLine,
  LayoutDashboard,
  PencilRulerIcon,
  Plus,
  User2,
  UserCog2,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useData } from "@/context/data-context";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/u" },
  { name: "Plans", icon: PencilRulerIcon, href: "/u/plans" },
  { name: "Progress", icon: ChartLine, href: "/u/progress" },
  { name: "Profile & Settings", icon: UserCog2, href: "/u/profile" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setGeneratePlanOpen } = useData();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                // Use exact match for dashboard, and startsWith for nested routes if any in future.
                // For this structure, exact match is safer.
                isActive={pathname === item.href}
              >
                <Link className="flex" href={item.href}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setGeneratePlanOpen(true)}>
              <Plus />
              <span>New Plan</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
