"use client";
import * as React from "react";
import {
  Bell,
  ChartLine,
  Check,
  Globe,
  Home,
  Keyboard,
  LayoutDashboard,
  Lock,
  Menu,
  MessageCircle,
  Paintbrush,
  PencilRulerIcon,
  Plus,
  Settings,
  User2,
  Video,
} from "lucide-react";

import { Calendars } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Calendar27 from "./calendar-27";
import Calendar21 from "./calendar-21";
import { useAuth } from "@/context/auth-context";
import { User } from "@/interfaces";
import { ProgressCalendar } from "./progress-calendar";
import { usePathname } from "next/navigation";
import Link from "next/link";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
  nav: [
    { name: "Dashboard", icon: LayoutDashboard, url: "/u" },
    { name: "Plans", icon: PencilRulerIcon, url: "/u/plans" },
    { name: "Profile", icon: User2, url: "/u/profile" },
    { name: "Progress", icon: ChartLine, url: "/u/progress" },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.nav.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.endsWith(item.url)}
                  >
                  <Link className="flex" href={item.url}>
                    
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* <SidebarGroup>
          <SidebarGroupContent>
          <Calendar21 />
          <ProgressCalendar />
          </SidebarGroupContent>
          </SidebarGroup> */}
        {/* <div className="borde">

<DatePicker />
</div> */}
        {/* <SidebarSeparator className="mx-0" /> */}
        {/* <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/u">
                <Calendar27 />
                <span>Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/u/progress">
                <Calendar27 />
                <span>Progress</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
        {/* <Calendars calendars={data.calendars} /> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
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
