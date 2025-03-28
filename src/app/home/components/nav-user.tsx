"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  Inbox,
  LogOut,
  Settings,
} from "lucide-react"
import { signout } from "@/lib/auth-actions"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import Link from "next/link"
import { Tables } from "@/types/database.types"

/**
 * Renders the user avatar and dropdown menu inside the sidebar.
 *
 * Displays the user's avatar, name, and email. Clicking the avatar
 * reveals a dropdown with profile, settings, and logout options.
 *
 * @param profile - The current user's profile information.
 * @returns The sidebar user menu component.
 */

// TODO: Fix typing
// See todo in auth-actions.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function NavUser({ profile }: { profile: Tables<"Profiles"> }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* User avatar */}
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={profile.avatar_url ?? ""}
                  alt={profile.username ?? profile.full_name}
                />
                <AvatarFallback className="rounded-lg">
                  {profile.full_name
                    .split(" ")
                    .map((name: string) => name.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {/* User details */}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {profile.full_name}
                </span>
                <span className="truncate text-xs">{profile.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
          {/* Dropdown menu */}
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* User information in dropdown */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={profile.avatar_url ?? ""}
                    alt={profile.username ?? profile.full_name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {profile.full_name
                      .split(" ")
                      .map((name: string) => name.charAt(0))
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {profile.full_name}
                  </span>
                  <span className="truncate text-xs">{profile.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Navigation options */}
            <DropdownMenuGroup>
              <Link href={`/home/profile/${profile.id}`}>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            
            {/* Logout btn */}
            <DropdownMenuItem onClick={signout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
