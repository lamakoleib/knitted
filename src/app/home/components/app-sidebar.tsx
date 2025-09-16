import * as React from "react"

import {
  AudioWaveform,
  Frame,
  Map,
  Search,
  Volleyball,
  Rss,
  MessageCircle,
  Bell,
  PlusCircle,
} from "lucide-react"

import { NavUser } from "./nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuBadge,
} from "@/components/ui/sidebar"

import { getCurrentUser } from "@/lib/auth-actions"
import { getCurrentUserProfile, unreadNotificationsCount } from "@/lib/db-actions"

/**
 * Sidebar navigation component for the Knitted app.
 *
 * Displays the app logo, navigation links, and user profile.
 * Menu options include sections like Feed, Search, Patterns, etc.
 * The sidebar is collapsible and adapts to icon-only mode.
 *
 * @param props - Props passed to the Sidebar component.
 * @returns The application sidebar layout.
 */

//Mock data for user profile and sidebar menu options
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://github.com/shadcn.png",
  },
  options: [
    { 
      name: "Feed", 
      url: "/home/feed", 
      icon: Rss,
    },
    /*{
      name: "Explore",
      url: "#",
      icon: Map,
    },*/
    {
      name: "Search",
      url: "/home/search",
      icon: Search,
    },
    {
      name: "Yarn",
      url: "#",
      icon: AudioWaveform,
    },
    {
      name: "Patterns",
      url: "#",
      icon: Frame,
    },
    {
      name: "Messages",
      url: "#",
      icon: MessageCircle,
    },    
    { 
      name: "Notifications", 
      url: "/home/notifications", 
      icon: Bell,
    },
    { 
      name: "Create Project", 
      url: "/home/upload", 
      icon: PlusCircle, 
    },
  ],
}
//Sidebar component for the application
export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await getCurrentUser()
  const profile = await getCurrentUserProfile()
  const unreadCount = await unreadNotificationsCount().catch(() => 0)

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Sidebar header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-rose-300 text-sidebar-primary-foreground">
                  <Volleyball className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Knitted</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar content */}
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {data.options.map((item) => {
              const isNotifications = item.name === "Notifications"
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton size="lg" asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                      {isNotifications && unreadCount > 0 && (
                        <SidebarMenuBadge className="bg-red-300 text-black">
                          {unreadCount}
                        </SidebarMenuBadge>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar footer */}
      <SidebarFooter>
        <NavUser profile={profile} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
