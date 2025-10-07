// src/__tests__/middleware.test.ts

/**
 * Test plan aligned to current middleware behavior:
 * - Unauthenticated + protected path  -> redirect /login
 * - Unauthenticated + /login|/signup -> allow next()
 * - Authenticated + protected path (profile NOT initialized) -> redirect /settings
 * - Authenticated + /login           (profile NOT initialized) -> redirect /settings
 * - Unauthenticated + unknown route  -> redirect /login
 *
 * Notes:
 * - We mock request-scope APIs (next/headers.cookies) so server code doesn't blow up.
 * - We return stable sentinels from NextResponse.next/redirect for easy assertions.
 * - We mock Supabase's createServerClient + getUser.
 * - We mock getCurrentUserProfile to control initialization branches.
 */

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
  headers: jest.fn(() => new Headers()),
}));

jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

// Stable sentinels so we don't call the mocks again inside expectations
const NEXT_SENTINEL = { __type: "NextResponse.next" };
const REDIRECT_SENTINEL = { __type: "NextResponse.redirect" };

jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn(() => NEXT_SENTINEL),
    redirect: jest.fn(() => REDIRECT_SENTINEL),
  },
}));

// Default: profile NOT initialized (we'll override per-test when needed)
jest.mock("@/lib/db-actions", () => ({
  getCurrentUserProfile: jest.fn(async () => ({
    id: "profile-1",
    user_id: "123",
    username: "",          // treat as not initialized
    is_initialized: false, // treat as not initialized
  })),
}));

// ---- Imports (after mocks) ----
import { updateSession } from "@/utils/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getCurrentUserProfile } from "@/lib/db-actions";

// Silence middleware console noise in tests (optional)
beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("updateSession middleware (aligned with current behavior)", () => {
  const mockSupabaseClient = {
    auth: { getUser: jest.fn() },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createServerClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  it("redirects to /login if no user is authenticated and the path is protected", async () => {
    const req = {
      nextUrl: {
        pathname: "/protected",
        clone: jest.fn(() => ({ pathname: "/login" })),
      },
    } as unknown as NextRequest;

    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

    const res = await updateSession(req);

    expect(req.nextUrl.clone).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" })
    );
    expect(res).toBe(REDIRECT_SENTINEL);
  });

  it("allows access to /login and /signup without authentication", async () => {
    for (const path of ["/login", "/signup"]) {
      jest.clearAllMocks();
      const req = { nextUrl: { pathname: path } } as unknown as NextRequest;

      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

      const res = await updateSession(req);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledTimes(1);
      expect(res).toBe(NEXT_SENTINEL);
    }
  });

  it("redirects authenticated but UNinitialized users on protected paths to /settings", async () => {
    const req = {
      nextUrl: {
        pathname: "/protected",
        clone: jest.fn(() => ({ pathname: "/settings" })),
      },
    } as unknown as NextRequest;

    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: "123" } } });
    // keep profile uninitialized (default mock)

    const res = await updateSession(req);

    expect(req.nextUrl.clone).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/settings" })
    );
    expect(res).toBe(REDIRECT_SENTINEL);
  });

  it("redirects authenticated but UNinitialized users away from /login to /settings", async () => {
    const req = {
      nextUrl: {
        pathname: "/login",
        clone: jest.fn(() => ({ pathname: "/settings" })),
      },
    } as unknown as NextRequest;

    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: "123" } } });
    // keep profile uninitialized (default mock)

    const res = await updateSession(req);

    expect(req.nextUrl.clone).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/settings" })
    );
    expect(res).toBe(REDIRECT_SENTINEL);
  });

  it("handles unknown routes by redirecting unauthorized users to /login", async () => {
    const req = {
      nextUrl: {
        pathname: "/unknown-route",
        clone: jest.fn(() => ({ pathname: "/login" })),
      },
    } as unknown as NextRequest;

    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

    const res = await updateSession(req);

    expect(req.nextUrl.clone).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" })
    );
    expect(res).toBe(REDIRECT_SENTINEL);
  });
});
