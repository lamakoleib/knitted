import { NextResponse, type NextRequest } from "next/server"

/**
 * DEMO BUILD: middleware is a pass-through. The Supabase session-aware
 * version is gone with the database — see src/utils/supabase/middleware.ts
 * for the original.
 */
export async function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
