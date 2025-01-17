import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

export async function createClient() {
	const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies;

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				async get(name: string) {
					return await cookieStore.get(name)?.value;
				},
				async set(name: string, value: string, options: CookieOptions) {
					try {
						await cookieStore.set({ name, value, ...options });
					} catch (error) {
						// The `set` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
				async remove(name: string, options: CookieOptions) {
					try {
						await cookieStore.set({ name, value: "", ...options });
					} catch (error) {
						// The `delete` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		}
	);
}
