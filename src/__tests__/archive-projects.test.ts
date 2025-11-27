/**
 * @jest-environment jsdom
 */

describe("archive/unarchive actions", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("archiveProject updates archived_at and revalidates paths", async () => {
    await jest.isolateModulesAsync(async () => {
      const finalEq = jest.fn().mockResolvedValue({ error: null });
      const secondEq = jest.fn().mockReturnValue({ eq: finalEq });
      const update = jest.fn().mockReturnValue({ eq: secondEq });
      const from = jest.fn().mockReturnValue({ update });

      const getUser = jest.fn().mockResolvedValue({
        data: { user: { id: "USER1" } },
      });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { getUser },
          from,
        }),
      }));

      jest.doMock("next/cache", () => ({
        revalidatePath: jest.fn(),
      }));

      const { archiveProject } = await import("@/lib/db-actions");
      const cache = await import("next/cache");
      const revalidatePath = cache.revalidatePath as jest.Mock;

      await archiveProject(123);

      expect(from).toHaveBeenCalledWith("Project");
      expect(update).toHaveBeenCalledTimes(1);
      const payload = update.mock.calls[0][0];
      expect(typeof payload.archived_at).toBe("string");

      expect(secondEq).toHaveBeenCalledWith("project_id", 123);
      expect(finalEq).toHaveBeenCalledWith("user_id", "USER1");

      expect(revalidatePath).toHaveBeenCalledWith("/home");
      expect(revalidatePath).toHaveBeenCalledWith("/home/profile/USER1");
      expect(revalidatePath).toHaveBeenCalledWith(
        "/home/profile/USER1/archived"
      );
    });
  });

  test("unarchiveProject clears archived_at and revalidates paths", async () => {
    await jest.isolateModulesAsync(async () => {
      const finalEq = jest.fn().mockResolvedValue({ error: null });
      const secondEq = jest.fn().mockReturnValue({ eq: finalEq });
      const update = jest.fn().mockReturnValue({ eq: secondEq });
      const from = jest.fn().mockReturnValue({ update });

      const getUser = jest.fn().mockResolvedValue({
        data: { user: { id: "USER1" } },
      });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({
          auth: { getUser },
          from,
        }),
      }));

      jest.doMock("next/cache", () => ({
        revalidatePath: jest.fn(),
      }));

      const { unarchiveProject } = await import("@/lib/db-actions");
      const cache = await import("next/cache");
      const revalidatePath = cache.revalidatePath as jest.Mock;

      await unarchiveProject(456);

      expect(from).toHaveBeenCalledWith("Project");
      expect(update).toHaveBeenCalledTimes(1);
      const payload = update.mock.calls[0][0];
      expect(payload.archived_at).toBeNull();

      expect(secondEq).toHaveBeenCalledWith("project_id", 456);
      expect(finalEq).toHaveBeenCalledWith("user_id", "USER1");

      expect(revalidatePath).toHaveBeenCalledWith("/home");
      expect(revalidatePath).toHaveBeenCalledWith("/home/profile/USER1");
      expect(revalidatePath).toHaveBeenCalledWith(
        "/home/profile/USER1/archived"
      );
    });
  });

  test("getArchivedProjectsByUser queries only archived rows in the right range", async () => {
    await jest.isolateModulesAsync(async () => {
      const rows = [
        { project_id: 1, title: "A", archived_at: "2025-01-01T00:00:00Z" },
        { project_id: 2, title: "B", archived_at: "2025-01-02T00:00:00Z" },
      ];

      const range = jest.fn().mockResolvedValue({ data: rows, error: null });
      const order = jest.fn().mockReturnValue({ range });
      const notFn = jest.fn().mockReturnValue({ order });
      const eq = jest.fn().mockReturnValue({ not: notFn });
      const select = jest.fn().mockReturnValue({ eq });
      const from = jest.fn().mockReturnValue({ select });

      jest.doMock("@/utils/supabase/server", () => ({
        createClient: jest.fn().mockResolvedValue({ from }),
      }));

      const { getArchivedProjectsByUser } = await import("@/lib/db-actions");

      const result = await getArchivedProjectsByUser("USER1", {
        limit: 2,
        page: 1,
      });

      expect(from).toHaveBeenCalledWith("Project");
      expect(select).toHaveBeenCalledTimes(1);
      expect(eq).toHaveBeenCalledWith("user_id", "USER1");
      expect(notFn).toHaveBeenCalledWith("archived_at", "is", null);
      expect(order).toHaveBeenCalledWith("archived_at", { ascending: false });

      const expectedFrom = 1 * 2;
      const expectedTo = expectedFrom + 2 - 1;
      expect(range).toHaveBeenCalledWith(expectedFrom, expectedTo);

      expect(result).toEqual(rows);
    });
  });
});
