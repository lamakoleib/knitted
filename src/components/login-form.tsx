"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Demo login form. There is no real auth in this build — clicking the button
 * just drops you into the home feed.
 */
export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Welcome to the Knitted demo</h1>
				<p className="text-balance text-sm text-muted-foreground">
					This is a static, read-only build of the app. There&apos;s no real
					account &mdash; jump straight in.
				</p>
			</div>
			<div className="grid gap-3">
				<Button asChild className="w-full bg-red-300 hover:bg-red-300/90">
					<Link href="/home">Enter the demo</Link>
				</Button>
				<p className="text-xs text-muted-foreground text-center">
					Posts, likes, comments, follows, uploads &mdash; all disabled or
					stubbed. The data you see is sample content used for demonstration.
				</p>
			</div>
			<div className="text-center text-sm">
				Curious what would normally be here?{" "}
				<Link href="/signup" className="underline underline-offset-4">
					Read about signup
				</Link>
			</div>
		</div>
	);
}
