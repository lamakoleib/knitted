import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase browser client instance.
 *
 * This client is configured using environment variables and is intended
 * for use on the client-side to interact with the Supabase API.
 *
 * @returns A Supabase client instance for browser usage.
 */
export function createClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);
}
