"use client"
import React from "react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { Home, Plus, Cog, User, Bell } from "lucide-react"

/**
 * Renders a floating dock with navigation icons.
 *
 * Displays navigation options such as Home, Profile, Post, Notifications, and Settings.
 * The dock is fixed at the bottom center of the screen and uses the `FloatingDock` component.
 *
 * @returns The floating dock component.
 */
export function Dock() {
  const links = [
    {
      title: "Home",
      icon: (
        <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Profile",
      icon: (
        <User className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Post",
      icon: (
        <Plus className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Notifications",
      icon: (
        <Bell className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Settings",
      icon: (
        <Cog className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ]
  return (
    <div className="fixed bottom-[1rem] left-[50%] z-50 flex items-center justify-center pb-1">
      <FloatingDock mobileClassName="translate-y-20" items={links} />
    </div>
  )
}
