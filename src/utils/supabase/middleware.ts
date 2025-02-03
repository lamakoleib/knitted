import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// TODO: Fix typing for cookies causing eslint to complain

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
					//eslint-disable-next-line @typescript-eslint/no-explicit-any
					cookiesToSet.forEach(({ name, value }: any) =>
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

//If no user is authenticated and the path is protected, redirect to /login
if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  //If the user is authenticated and tries to access /login or /signup, redirect them to /home
  if (user && (request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }
	return supabaseResponse;
}
