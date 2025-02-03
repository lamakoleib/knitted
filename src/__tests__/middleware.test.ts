import { updateSession } from "@/utils/supabase/middleware";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

jest.mock("@supabase/ssr", () => ({
  createServerClient: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    next: jest.fn(() => ({})),
    redirect: jest.fn(),
  },
}));

describe("updateSession middleware", () => {
  const mockSupabaseClient = {
    auth: {
      getUser: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createServerClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  it("redirects to /login if no user is authenticated and the path is protected", async () => {
    const mockRequest = {
      nextUrl: {
        pathname: "/protected",
        clone: jest.fn(() => ({ pathname: "/login" })),
      },
    } as unknown as NextRequest;

    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

    const response = await updateSession(mockRequest);

    expect(mockRequest.nextUrl.clone).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" })
    );
    expect(response).toBeUndefined();
  });

  it("allows access to /login and /signup without authentication", async () => {
    const unprotectedPaths = ["/login", "/signup"];

    for (const path of unprotectedPaths) {
      jest.clearAllMocks();

      const mockRequest = {
        nextUrl: {
          pathname: path,
        },
      } as unknown as NextRequest;

      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

      const response = await updateSession(mockRequest);

      expect(NextResponse.redirect).not.toHaveBeenCalled();
      expect(NextResponse.next).toHaveBeenCalledTimes(1);
      expect(response).toEqual(NextResponse.next());
    }
  });

  it("goes to the next middleware if a user is authenticated and accesses protected paths", async () => {
    const mockRequest = {
      nextUrl: {
        pathname: "/protected",
      },
    } as unknown as NextRequest;

    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: "123" } } });

    const response = await updateSession(mockRequest);

    expect(NextResponse.next).toHaveBeenCalledTimes(1);
    expect(response).toEqual(NextResponse.next());
  });

  it("redirects authenticated users from /login or /signup to /home", async () => {
    const mockRequest = {
      nextUrl: {
        pathname: "/login",
        clone: jest.fn(() => ({ pathname: "/home" })),
      },
    } as unknown as NextRequest;

    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: "123" } } });

    const response = await updateSession(mockRequest);

    expect(mockRequest.nextUrl.clone).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/home" })
    );
    expect(response).toBeUndefined();
  });

  it("prevents unauthorized access to sensitive paths", async () => {
    const protectedPaths = ["/home", "/admin", "/settings", "/protected"];

    for (const path of protectedPaths) {
      jest.clearAllMocks();

      const mockRequest = {
        nextUrl: {
          pathname: path,
          clone: jest.fn(() => ({ pathname: "/login" })),
        },
      } as unknown as NextRequest;

      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

      const response = await updateSession(mockRequest);

      expect(mockRequest.nextUrl.clone).toHaveBeenCalled();
      expect(NextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({ pathname: "/login" })
      );
      expect(response).toBeUndefined();
    }
  });

  it("handles unexpected or unknown routes by redirecting unauthorized users", async () => {
    const mockRequest = {
      nextUrl: {
        pathname: "/unknown-route",
        clone: jest.fn(() => ({ pathname: "/login" })),
      },
    } as unknown as NextRequest;

    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

    const response = await updateSession(mockRequest);

    expect(mockRequest.nextUrl.clone).toHaveBeenCalled();
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: "/login" })
    );
    expect(response).toBeUndefined();
  });
});
