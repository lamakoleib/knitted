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

  it("redirects to /login if no user is authenticated and the path is not /login or /signup", async () => {
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

  it("goes to the next middleware if a user is authenticated", async () => {
    const mockRequest = {
      nextUrl: {
        pathname: "/protected",
      },
    } as unknown as NextRequest;

    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: { id: "123" } } });

    const response = await updateSession(mockRequest);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toEqual(expect.any(Object));
  });

  it("allows access to /login and /signup even without authentication", async () => {
    const mockRequest = {
      nextUrl: {
        pathname: "/login",
      },
    } as unknown as NextRequest;

    mockSupabaseClient.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

    const response = await updateSession(mockRequest);

    expect(NextResponse.redirect).not.toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalled();
    expect(response).toEqual(expect.any(Object));
  });
});
