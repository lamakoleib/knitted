import * as React from "react"
import {
	AudioWaveform,
	Frame,
	Map,
	Search,
	Volleyball,
	Rss,
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
} from "@/components/ui/sidebar"
import { getCurrentUser } from "@/lib/auth-actions"

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "https://github.com/shadcn.png",
	},
	options: [
		{
			name: "Feed",
			url: "#",
			icon: Rss,
		},
		{
			name: "Explore",
			url: "#",
			icon: Map,
		},
		{
			name: "Search",
			url: "#",
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
	],
}

export async function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const user = await getCurrentUser()
	return (
		<Sidebar collapsible="icon" {...props}>
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
			<SidebarContent>
				<SidebarGroup className="group-data-[collapsible=icon]:hidden">
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarMenu>
						{data.options.map((item) => (
							<SidebarMenuItem key={item.name}>
								<SidebarMenuButton size="lg" asChild>
									<a href={item.url}>
										<item.icon />
										<span>{item.name}</span>
									</a>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={user.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
