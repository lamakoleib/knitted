import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
	const cookieStore = await cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},

				setAll(cookiesToSet: any) {
					try {
						//eslint-disable-next-line @typescript-eslint/no-explicit-any
						cookiesToSet.forEach(({ name, value, options }: any) => {
							cookieStore.set(name, value, options);
						});
					} catch (error) {}
				},
			},
		}
	);
};
