"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string;
		title: string;
	}[];
}
/**
 * Renders a vertical sidebar navigation menu for the settings pages.
 *
 * Highlights the active link based on the current pathname.
 * Uses `buttonVariants` for consistent styling.
 *
 * @param items - An array of navigation items with `href` and `title`
 * @returns A styled `<nav>` element with navigation links.
 */
export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
	const pathname = usePathname();

	return (
		<nav
			className={cn(
				"flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
				className
			)}
			{...props}
		>
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						buttonVariants({ variant: "ghost" }),
						pathname === item.href
							? "bg-muted hover:bg-muted"
							: "hover:bg-transparent hover:underline",
						"justify-start"
					)}
				>
					{item.title}
				</Link>
			))}
		</nav>
	);
}
