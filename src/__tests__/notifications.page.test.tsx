import React from "react";
import { render, screen, within } from "@testing-library/react";

// Mock next/link to a simple <a>
jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>{children}</a>
  );
});

// Spies we can control per test
const markAllNotificationsRead = jest.fn(async () => {});
const fetchNotifications = jest.fn(async (_limit?: number) => []);

// Mock db-actions with our spies
jest.mock("@/lib/db-actions", () => ({
  markAllNotificationsRead: () => markAllNotificationsRead(),
  fetchNotifications: (limit?: number) => fetchNotifications(limit),
}));

// Import AFTER mocks
import NotificationsPage from "@/app/home/notifications/page";

// Freeze time for timeAgo()
const FIXED_NOW = new Date("2025-10-06T12:00:00.000Z").getTime();
beforeAll(() => {
  jest.spyOn(Date, "now").mockReturnValue(FIXED_NOW);
});
afterAll(() => {
  (Date.now as unknown as jest.Mock | undefined)?.mockRestore?.();
});
beforeEach(() => {
  jest.clearAllMocks();
});

describe("NotificationsPage", () => {
  test("renders empty state and marks all as read", async () => {
    fetchNotifications.mockResolvedValueOnce([]); // no rows
    const ui = await NotificationsPage(); // server component returns JSX
    render(ui);

    expect(markAllNotificationsRead).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("You have no notifications yet.")).toBeInTheDocument();
  });

  test("renders list: name/verb/time/link and unread styling (profile vs project links)", async () => {
    const rows = [
      {
        notification_id: "n1",
        actor_id: "user-aaa11111",
        type: "like",                         // -> "liked your post"
        project_id: 101,                      // View -> /home/projects/101
        created_at: "2025-10-06T11:59:30.000Z", // 30s ago
        is_read: false,
        actor_profile: { full_name: "Alex Johnson", username: "alexj", avatar_url: null },
      },
      {
        notification_id: "n2",
        actor_id: "user-bbb22222",
        type: "comment",                      // -> "commented on your post"
        project_id: 202,                      // View -> /home/projects/202
        created_at: "2025-10-06T11:00:00.000Z", // 1h ago
        is_read: true,
        actor_profile: { full_name: null, username: "bee", avatar_url: null },
      },
      {
        notification_id: "n3",
        actor_id: "user-ccc33333",
        type: "follow",                       // -> "started following you"
        project_id: null,                     // View -> /home/profile/user-ccc33333
        created_at: "2025-10-05T12:00:00.000Z", // 1d ago
        is_read: true,
        actor_profile: null, // fallback to actor_id.slice(0,8)
      },
    ];
    fetchNotifications.mockResolvedValueOnce(rows as any);

    const ui = await NotificationsPage();
    render(ui);

    expect(markAllNotificationsRead).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("Notifications")).toBeInTheDocument();

    // ----- Row 1 (like) -----
    const name1 = screen.getByRole("link", { name: "Alex Johnson" });
    expect(name1).toHaveAttribute("href", "/home/profile/user-aaa11111");
    expect(screen.getByText(/liked your post/i)).toBeInTheDocument();
    expect(screen.getByText("30s ago")).toBeInTheDocument();

    // unread styling
    const row1Sentence = name1.closest("li")!.querySelector("p.text-sm")!;
    expect(row1Sentence.className).toMatch(/font-medium/);

    // "View" should link to the project, not the profile
    const row1 = name1.closest("li")!;
    const view1 = within(row1).getByRole("link", { name: "View" });
    expect(view1).toHaveAttribute("href", "/home/projects/101");

    // ----- Row 2 (comment) -----
    const name2 = screen.getByRole("link", { name: "bee" });
    expect(name2).toHaveAttribute("href", "/home/profile/user-bbb22222");
    expect(screen.getByText(/commented on your post/i)).toBeInTheDocument();
    expect(screen.getByText("1h ago")).toBeInTheDocument();

    // read item does NOT have font-medium
    const row2Sentence = name2.closest("li")!.querySelector("p.text-sm")!;
    expect(row2Sentence.className).not.toMatch(/font-medium/);

    const row2 = name2.closest("li")!;
    const view2 = within(row2).getByRole("link", { name: "View" });
    expect(view2).toHaveAttribute("href", "/home/projects/202");

    // ----- Row 3 (follow) -----
    const name3 = screen.getByRole("link", { name: "user-ccc" });
    expect(name3).toHaveAttribute("href", "/home/profile/user-ccc33333");
    expect(screen.getByText(/started following you/i)).toBeInTheDocument();
    expect(screen.getByText("1d ago")).toBeInTheDocument();

    const row3 = name3.closest("li")!;
    const view3 = within(row3).getByRole("link", { name: "View" });
    expect(view3).toHaveAttribute("href", "/home/profile/user-ccc33333");
  });
});
