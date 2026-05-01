import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * Demo signup form. Mirrors the login form: there's no real account, the
 * button just drops you into the demo.
 */
export default function SignupForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Knitted is in demo mode</h1>
				<p className="text-balance text-sm text-muted-foreground">
					Signup is disabled in this static build. The full app supports
					email/password and Google OAuth via Supabase.
				</p>
			</div>
			<div className="grid gap-3">
				<Button asChild className="w-full bg-red-300 hover:bg-red-300/90">
					<Link href="/home">Browse the demo</Link>
				</Button>
			</div>
			<div className="text-center text-sm">
				<Link href="/login" className="underline underline-offset-4">
					Back
				</Link>
			</div>
		</div>
	)
}
