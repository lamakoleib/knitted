"use client"
import React from "react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { Home, Plus, Cog, User, Bell } from "lucide-react"

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
