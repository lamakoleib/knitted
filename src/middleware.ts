import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/**
 * Middleware that updates the Supabase session for authenticated requests.
 * Redirects users to appropriate pages based on auth and profile status.
 *
 * @param request - The incoming Next.js request object.
 * @returns A NextResponse with updated cookies or redirection if necessary.
 */
export async function middleware(request: NextRequest) {
	return await updateSession(request);
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
};
