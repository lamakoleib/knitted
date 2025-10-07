/**
 * Tests for notifications server actions in src/lib/db-actions.ts
 * Covered:
 *  - unreadNotificationsCount()
 *  - markAllNotificationsRead()
 *  - fetchNotifications()
 */

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
  headers: jest.fn(() => new Headers()),
}));

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

import {
  unreadNotificationsCount,
  markAllNotificationsRead,
  fetchNotifications,
} from "@/lib/db-actions";
import { createClient } from "@/utils/supabase/server";

// a tiny helper to build a chainable supabase query mock
const chain = () => {
  const obj: any = {};
  obj.select = jest.fn(() => obj);
  obj.update = jest.fn(() => obj);
  obj.eq = jest.fn(() => obj);
  obj.or = jest.fn(() => obj);
  obj.order = jest.fn(() => obj);
  obj.limit = jest.fn(() => obj);
  obj.in = jest.fn(() => obj);
  obj.single = jest.fn(() => obj);
  // values we set in tests:
  obj.data = undefined;
  obj.error = null;
  obj.count = undefined;
  obj.then = undefined; // don't act like a promise
  return obj;
};

describe("notifications actions", () => {
  const notifQuery = chain();
  const profilesQuery = chain();

  const supabase = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn((table: string) => {
      if (table === "notifications") return notifQuery;
      if (table === "Profiles") return profilesQuery;
      throw new Error(`Unexpected table: ${table}`);
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // reset chain state
    Object.assign(notifQuery, chain());
    Object.assign(profilesQuery, chain());
    (createClient as jest.Mock).mockReturnValue(supabase);
  });

  describe("unreadNotificationsCount", () => {
    it("returns 0 when no authenticated user", async () => {
      supabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

      const n = await unreadNotificationsCount();
      expect(n).toBe(0);
      // should not touch 'notifications' table
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it("returns the exact count when user exists", async () => {
      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-123" } },
      });

      // set up count result
      notifQuery.select.mockReturnValueOnce(notifQuery);
      notifQuery.eq.mockReturnValueOnce(notifQuery);
      notifQuery.or.mockReturnValueOnce(notifQuery);
      notifQuery.count = 7;
      notifQuery.error = null;

      const n = await unreadNotificationsCount();

      expect(supabase.from).toHaveBeenCalledWith("notifications");
      expect(notifQuery.select).toHaveBeenCalledWith(
        "notification_id",
        expect.objectContaining({ count: "exact", head: true })
      );
      expect(notifQuery.eq).toHaveBeenCalledWith("user_id", "user-123");
      expect(notifQuery.or).toHaveBeenCalledWith(
        "is_read.is.false,is_read.is.null"
      );
      expect(n).toBe(7);
    });

    it("returns 0 on error", async () => {
      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-123" } },
      });

      notifQuery.select.mockReturnValueOnce(notifQuery);
      notifQuery.eq.mockReturnValueOnce(notifQuery);
      notifQuery.or.mockReturnValueOnce(notifQuery);
      notifQuery.error = { message: "boom" } as any;

      const n = await unreadNotificationsCount();
      expect(n).toBe(0);
    });
  });

  describe("markAllNotificationsRead", () => {
    it("is a no-op when no user", async () => {
      supabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } });

      await expect(markAllNotificationsRead()).resolves.toBeUndefined();
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it("updates unread rows for the user", async () => {
      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-123" } },
      });

      notifQuery.update.mockReturnValueOnce(notifQuery);
      notifQuery.eq.mockReturnValueOnce(notifQuery);
      notifQuery.or.mockReturnValueOnce(notifQuery);
      notifQuery.error = null;

      await markAllNotificationsRead();

      expect(supabase.from).toHaveBeenCalledWith("notifications");
      expect(notifQuery.update).toHaveBeenCalledWith({ is_read: true });
      expect(notifQuery.eq).toHaveBeenCalledWith("user_id", "user-123");
      expect(notifQuery.or).toHaveBeenCalledWith(
        "is_read.is.false,is_read.is.null"
      );
    });
  });

  describe("fetchNotifications", () => {
    it("returns [] when no user", async () => {
      supabase.auth.getUser.mockResolvedValueOnce({ data: { user: null } });
      const res = await fetchNotifications(50);
      expect(res).toEqual([]);
      expect(supabase.from).not.toHaveBeenCalled();
    });

    it("returns notifications with actor profiles merged", async () => {
      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-123" } },
      });

      // notifications fetch
      const rows = [
        {
          notification_id: 1,
          user_id: "user-123",
          actor_id: "actor-a",
          project_id: 10,
          type: "like",
          is_read: false,
          created_at: "2025-10-05T12:00:00Z",
        },
        {
          notification_id: 2,
          user_id: "user-123",
          actor_id: "actor-b",
          project_id: null,
          type: "follow",
          is_read: true,
          created_at: "2025-10-04T12:00:00Z",
        },
        {
          notification_id: 3,
          user_id: "user-123",
          actor_id: "actor-missing",
          project_id: null,
          type: "comment",
          is_read: true,
          created_at: "2025-10-03T12:00:00Z",
        },
      ];

      notifQuery.select.mockReturnValueOnce(notifQuery);
      notifQuery.eq.mockReturnValueOnce(notifQuery);
      notifQuery.order.mockReturnValueOnce(notifQuery);
      notifQuery.limit.mockReturnValueOnce(notifQuery);
      notifQuery.data = rows;

      // profiles fetch (for actor-a and actor-b; actor-missing not returned)
      const profiles = [
        {
          id: "actor-a",
          username: "alex",
          avatar_url: "https://example.com/a.jpg",
          full_name: "Alex Johnson",
        },
        {
          id: "actor-b",
          username: null,
          avatar_url: null,
          full_name: "Bee",
        },
      ];

      profilesQuery.select.mockReturnValueOnce(profilesQuery);
      profilesQuery.in.mockReturnValueOnce(profilesQuery);
      profilesQuery.data = profiles;

      const res = await fetchNotifications(50);

      // Check the table calls + limit/order
      expect(supabase.from).toHaveBeenNthCalledWith(1, "notifications");
      expect(notifQuery.select).toHaveBeenCalledWith(
        "notification_id, user_id, actor_id, project_id, type, is_read, created_at"
      );
      expect(notifQuery.eq).toHaveBeenCalledWith("user_id", "user-123");
      expect(notifQuery.order).toHaveBeenCalledWith("created_at", {
        ascending: false,
      });
      expect(notifQuery.limit).toHaveBeenCalledWith(50);

      // Profiles lookup
      expect(supabase.from).toHaveBeenNthCalledWith(2, "Profiles");
      expect(profilesQuery.select).toHaveBeenCalledWith(
        "id, username, avatar_url, full_name"
      );
      expect(profilesQuery.in).toHaveBeenCalledWith("id", ["actor-a", "actor-b", "actor-missing"]);

      // Merged output (actor_profile for missing actor should be null)
      expect(res).toEqual([
        {
          ...rows[0],
          actor_profile: profiles[0],
        },
        {
          ...rows[1],
          actor_profile: profiles[1],
        },
        {
          ...rows[2],
          actor_profile: null,
        },
      ]);
    });

    it("handles null notifications list from supabase", async () => {
      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: { id: "user-123" } },
      });

      notifQuery.select.mockReturnValueOnce(notifQuery);
      notifQuery.eq.mockReturnValueOnce(notifQuery);
      notifQuery.order.mockReturnValueOnce(notifQuery);
      notifQuery.limit.mockReturnValueOnce(notifQuery);
      notifQuery.data = null; // API returned null
      profilesQuery.select.mockReturnValueOnce(profilesQuery); // should be skipped
      profilesQuery.in.mockReturnValueOnce(profilesQuery);

      const res = await fetchNotifications(10);
      expect(res).toEqual([]); // no crash
    });
  });
});
