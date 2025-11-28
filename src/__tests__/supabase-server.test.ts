/**
 * @jest-environment jsdom
 */

describe("createClient (Supabase server util)", () => {
  const origEnv = { ...process.env };

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    Object.assign(process.env, origEnv);
  });

  test("wires cookies.get/set/remove to the cookieStore and passes env vars", async () => {
    await jest.isolateModulesAsync(async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

      const cookieStore = {
        get: jest.fn(() => ({ value: "cookie-value" })),
        set: jest.fn(),
      };

      const cookiesMock = jest.fn().mockResolvedValue(cookieStore);

      jest.doMock("next/headers", () => ({
        cookies: cookiesMock,
      }));

      const createServerClient = jest.fn(() => ({ client: true }));
      jest.doMock("@supabase/ssr", () => ({
        createServerClient,
      }));

      const { createClient } = await import("@/utils/supabase/server");

      const client = await createClient();
      expect(client).toEqual({ client: true });

      expect(createServerClient).toHaveBeenCalledWith(
        "https://example.supabase.co",
        "anon-key",
        expect.any(Object)
      );

      // ---- FIXED PART ----
      const calls = (createServerClient as jest.Mock).mock.calls;
      expect(calls.length).toBeGreaterThan(0);

      const options = calls[0][2] as any;
      const cookies = options.cookies;
      // --------------------

      // get
      const v = await cookies.get("sb:token");
      expect(cookieStore.get).toHaveBeenCalledWith("sb:token");
      expect(v).toBe("cookie-value");

      // set
      await cookies.set("sb:token", "new-value", { path: "/" } as any);
      expect(cookieStore.set).toHaveBeenCalledWith({
        name: "sb:token",
        value: "new-value",
        path: "/",
      });

      // remove
      await cookies.remove("sb:token", { path: "/" } as any);
      expect(cookieStore.set).toHaveBeenCalledWith({
        name: "sb:token",
        value: "",
        path: "/",
      });
    });
  });

  test("set/remove swallow errors from cookieStore.set", async () => {
    await jest.isolateModulesAsync(async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

      const cookieStore = {
        get: jest.fn(),
        set: jest.fn(() => {
          throw new Error("boom");
        }),
      };

      const cookiesMock = jest.fn().mockResolvedValue(cookieStore);

      jest.doMock("next/headers", () => ({
        cookies: cookiesMock,
      }));

      const createServerClient = jest.fn(() => ({ client: true }));
      jest.doMock("@supabase/ssr", () => ({
        createServerClient,
      }));

      const { createClient } = await import("@/utils/supabase/server");
      await createClient();

      const calls = (createServerClient as jest.Mock).mock.calls;
      expect(calls.length).toBeGreaterThan(0);

      const options = calls[0][2] as any;
      const cookies = options.cookies;
      // --------------------

      await expect(
        cookies.set("name", "value", { path: "/" } as any)
      ).resolves.toBeUndefined();

      await expect(
        cookies.remove("name", { path: "/" } as any)
      ).resolves.toBeUndefined();
    });
  });
});
