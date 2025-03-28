import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies, type UnsafeUnwrappedCookies } from "next/headers"

/**
 * Creates a Supabase server client instance for use in Server Components or server actions.
 *
 * This function adapts Supabase's cookie-based session handling to Next.js's
 * `next/headers` API and supports session persistence using cookies.
 *
 * It provides `get`, `set`, and `remove` cookie operations, with graceful error handling
 * when invoked from Server Components.
 *
 * @returns A configured Supabase client for server-side operations.
 */
export async function createClient() {
  const cookieStore = (await cookies()) as unknown as UnsafeUnwrappedCookies

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
