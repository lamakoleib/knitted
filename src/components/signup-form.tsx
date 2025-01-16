import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signup } from "@/lib/auth-actions";

export default function SignupForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {
	return (
		<form className={cn("flex flex-col gap-6", className)} {...props}>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Create a new account</h1>
			</div>
			<div className="grid gap-6">
				<div className="grid grid-cols-2 gap-2">
					<span>
						<Label htmlFor="firstname">First Name</Label>
						<Input id="firstname" type="text" required />
					</span>
					<span>
						<Label htmlFor="firstname">Last Name</Label>
						<Input id="firstname" type="text" required />
					</span>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="email@example.com"
						required
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="password">Password</Label>
					<Input id="password" type="password" required />
				</div>
				<div className="grid gap-2">
					<Label htmlFor="confirm-password">Confirm Password</Label>
					<Input id="confirm-password" type="password" required />
				</div>
				<Button type="submit" className="w-full bg-red-300" formAction={signup}>
					Signup
				</Button>
				<div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
					<span className="relative z-10 bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
				<Button variant="outline" className="w-full">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path
							d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
							fill="currentColor"
						/>
					</svg>
					Login with Google
				</Button>
				<div className="text-center text-sm">
					Already have an account?{" "}
					<Link href="/login" className="underline underline-offset-4">
						Login
					</Link>
				</div>
			</div>
		</form>
	);
}