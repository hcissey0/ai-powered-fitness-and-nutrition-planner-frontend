"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Sparkles,
  User2Icon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { User } from "@/interfaces"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout } = useAuth()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {user ? 
          
            <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.profile?.image as string}
                  alt={user.first_name + " " + user.last_name}
                  />
                <AvatarFallback className="rounded-lg">
                  {user.first_name.charAt(0).toUpperCase() +
                    user.last_name.charAt(0).toUpperCase() ||
                    user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user?.first_name + " " + user?.last_name}
                </span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              {/* <ChevronsUpDown className="ml-auto size-4" /> */}
            </SidebarMenuButton>
                  :
        <SidebarMenuButton
            size="lg"
            className="animate-pulse data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg animate-pulse">
                <AvatarFallback className="rounded-lg"></AvatarFallback>
              </Avatar>
              </SidebarMenuButton>
                  }
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="glass-popover w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              {user &&
              
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.profile?.image as string}
                    alt={user.first_name + " " + user.last_name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.first_name.charAt(0).toUpperCase() +
                      user.last_name.charAt(0).toUpperCase() ||
                      user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user?.first_name + " " + user?.last_name}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
                  }
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}
            <DropdownMenuGroup>
              <Link href={'/u'}>
              <DropdownMenuItem>
                <LayoutDashboard />
                Dashboard
              </DropdownMenuItem>
              </Link>
              <Link href={'/u/profile'}>
              <DropdownMenuItem>
                <User2Icon />
                Profile
              </DropdownMenuItem>
              </Link>
              <Link href={'/u/plans'}>
              <DropdownMenuItem>
                <Dumbbell />
                Plans
              </DropdownMenuItem>
              </Link>
              <Link href={'/u/progress'}>
              <DropdownMenuItem>
                <BadgeCheck />
                Progress
              </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
