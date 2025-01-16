import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				//eslint-disable-next-line @typescript-eslint/no-explicit-any
				setAll(cookiesToSet: any) {
					cookiesToSet.forEach(({ name, value, options }: any) =>
						request.cookies.set(name, value)
					);
					supabaseResponse = NextResponse.next({
						request,
					});
					//eslint-disable-next-line @typescript-eslint/no-explicit-any
					cookiesToSet.forEach(({ name, value, options }: any) =>
						supabaseResponse.cookies.set(name, value, options)
					);
				},
			},
		}
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (
		!user &&
		!request.nextUrl.pathname.startsWith("/login") &&
		!request.nextUrl.pathname.startsWith("/signup") &&
		false
	) {
		// no user, potentially respond by redirecting the user to the login page
		const url = request.nextUrl.clone();
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
