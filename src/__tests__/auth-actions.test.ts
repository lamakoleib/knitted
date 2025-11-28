/**
 * @jest-environment jsdom
 */

describe("auth-actions", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("login redirects to /home on success", async () => {
    await jest.isolateModulesAsync(async () => {
      const signInWithPassword = jest.fn().mockResolvedValue({ error: null });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { signInWithPassword },
        }),
      }));

      const revalidatePath = jest.fn();
      jest.doMock("next/cache", () => ({ revalidatePath }));

      const redirect = jest.fn((url: string) => {
        throw new Error("redirect:" + url);
      });
      jest.doMock("next/navigation", () => ({ redirect }));

      const { login } = await import("@/lib/auth-actions");

      const form = new FormData();
      form.set("email", "user@example.com");
      form.set("password", "secret");

      try {
        await login(form);
      } catch {
        // redirect throws; swallow for test
      }

      expect(signInWithPassword).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "secret",
      });
      expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
      expect(redirect).toHaveBeenCalledWith("/home");
    });
  });

  test("login redirects to /error when signInWithPassword fails", async () => {
    await jest.isolateModulesAsync(async () => {
      const signInWithPassword = jest
        .fn()
        .mockResolvedValue({ error: { message: "bad" } });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { signInWithPassword },
        }),
      }));

      const revalidatePath = jest.fn();
      jest.doMock("next/cache", () => ({ revalidatePath }));

      const redirect = jest.fn((url: string) => {
        throw new Error("redirect:" + url);
      });
      jest.doMock("next/navigation", () => ({ redirect }));

      const { login } = await import("@/lib/auth-actions");

      const form = new FormData();
      form.set("email", "user@example.com");
      form.set("password", "wrong");

      try {
        await login(form);
      } catch {
        // redirect throws
      }

      expect(signInWithPassword).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/error");
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  test("signup redirects to /home on success", async () => {
    await jest.isolateModulesAsync(async () => {
      const signUp = jest.fn().mockResolvedValue({ error: null });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { signUp },
        }),
      }));

      const revalidatePath = jest.fn();
      jest.doMock("next/cache", () => ({ revalidatePath }));

      const redirect = jest.fn((url: string) => {
        throw new Error("redirect:" + url);
      });
      jest.doMock("next/navigation", () => ({ redirect }));

      const { signup } = await import("@/lib/auth-actions");

      const form = new FormData();
      form.set("first-name", "Zeynep");
      form.set("last-name", "Sevincel");
      form.set("email", "zeynep@example.com");
      form.set("password", "secret");

      try {
        await signup(form);
      } catch {
        // redirect throws
      }

      expect(signUp).toHaveBeenCalledTimes(1);
      const payload = signUp.mock.calls[0][0];
      expect(payload.email).toBe("zeynep@example.com");
      expect(payload.password).toBe("secret");
      expect(payload.options.data.full_name).toBe("Zeynep Sevincel");
      expect(payload.options.data.email).toBe("zeynep@example.com");

      expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
      expect(redirect).toHaveBeenCalledWith("/home");
    });
  });

  test("signup redirects to /error when signUp fails", async () => {
    await jest.isolateModulesAsync(async () => {
      const signUp = jest
        .fn()
        .mockResolvedValue({ error: { message: "boom" } });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { signUp },
        }),
      }));

      const revalidatePath = jest.fn();
      jest.doMock("next/cache", () => ({ revalidatePath }));

      const redirect = jest.fn((url: string) => {
        throw new Error("redirect:" + url);
      });
      jest.doMock("next/navigation", () => ({ redirect }));

      const { signup } = await import("@/lib/auth-actions");

      const form = new FormData();
      form.set("first-name", "Zeynep");
      form.set("last-name", "Sevincel");
      form.set("email", "zeynep@example.com");
      form.set("password", "secret");

      try {
        await signup(form);
      } catch {
        // redirect throws
      }

      expect(signUp).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/error");
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });

  test("getCurrentUser returns data on success", async () => {
    await jest.isolateModulesAsync(async () => {
      const userData = { user: { id: "USER1" } };
      const getUser = jest.fn().mockResolvedValue({
        data: userData,
        error: null,
      });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { getUser },
        }),
      }));

      const redirect = jest.fn();
      jest.doMock("next/navigation", () => ({ redirect }));

      const { getCurrentUser } = await import("@/lib/auth-actions");
      const result = await getCurrentUser();

      expect(getUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(userData);
      expect(redirect).not.toHaveBeenCalled();
    });
  });

  test("getCurrentUser redirects to /error when getUser fails", async () => {
    await jest.isolateModulesAsync(async () => {
      const getUser = jest.fn().mockResolvedValue({
        data: null,
        error: { message: "fail" },
      });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { getUser },
        }),
      }));

      const redirect = jest.fn((url: string) => {
        throw new Error("redirect:" + url);
      });
      jest.doMock("next/navigation", () => ({ redirect }));

      const { getCurrentUser } = await import("@/lib/auth-actions");

      try {
        await getCurrentUser();
      } catch {
        // redirect throws
      }

      expect(getUser).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/error");
    });
  });

  test("signout redirects to /login on success", async () => {
    await jest.isolateModulesAsync(async () => {
      const signOut = jest.fn().mockResolvedValue({ error: null });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { signOut },
        }),
      }));

      const redirect = jest.fn((url: string) => {
        throw new Error("redirect:" + url);
      });
      jest.doMock("next/navigation", () => ({ redirect }));

      const { signout } = await import("@/lib/auth-actions");

      try {
        await signout();
      } catch {
        // redirect throws
      }

      expect(signOut).toHaveBeenCalledTimes(1);
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });

  test("signout redirects to /error when signOut fails", async () => {
    await jest.isolateModulesAsync(async () => {
      const signOut = jest
        .fn()
        .mockResolvedValue({ error: { message: "oops" } });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { signOut },
        }),
      }));

      const redirect = jest.fn((url: string) => {
        throw new Error("redirect:" + url);
      });
      jest.doMock("next/navigation", () => ({ redirect }));

      const { signout } = await import("@/lib/auth-actions");

      try {
        await signout();
      } catch {
        // redirect throws
      }

      expect(signOut).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/error");
    });
  });

  test("signInWithGoogle redirects to provider URL on success", async () => {
    await jest.isolateModulesAsync(async () => {
      const signInWithOAuth = jest.fn().mockResolvedValue({
        data: { url: "https://example.com/google-auth" },
        error: null,
      });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { signInWithOAuth },
        }),
      }));

      const redirect = jest.fn((url: string) => {
        throw new Error("redirect:" + url);
      });
      jest.doMock("next/navigation", () => ({ redirect }));

      const { signInWithGoogle } = await import("@/lib/auth-actions");

      try {
        await signInWithGoogle();
      } catch {
        // redirect throws
      }

      expect(signInWithOAuth).toHaveBeenCalledWith({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      expect(redirect).toHaveBeenCalledWith(
        "https://example.com/google-auth"
      );
    });
  });

  test("signInWithGoogle redirects to /error when OAuth fails", async () => {
    await jest.isolateModulesAsync(async () => {
      const signInWithOAuth = jest.fn().mockResolvedValue({
        data: { url: "" },
        error: { message: "oauth fail" },
      });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { signInWithOAuth },
        }),
      }));

      const redirect = jest.fn((url: string) => {
        throw new Error("redirect:" + url);
      });
      jest.doMock("next/navigation", () => ({ redirect }));

      const { signInWithGoogle } = await import("@/lib/auth-actions");

      try {
        await signInWithGoogle();
      } catch {
        // redirect throws
      }

      expect(signInWithOAuth).toHaveBeenCalled();
      expect(redirect).toHaveBeenCalledWith("/error");
    });
  });
});
