import React from "react";
import { render, screen } from "@testing-library/react";


jest.mock("next/link", () => {
  return ({ href, children, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
});


const markAllNotificationsRead = jest.fn(async () => {});
const fetchNotifications = jest.fn(async (_limit?: number) => []);

jest.mock("@/lib/db-actions", () => ({
  // no args
  markAllNotificationsRead: () => markAllNotificationsRead(),

  // one optional arg
  fetchNotifications: (limit?: number) => fetchNotifications(limit),
}));


// Import after mocks
import NotificationsPage from "@/app/home/notifications/page";

// Keep time stable for timeAgo()
const FIXED_NOW = new Date("2025-10-06T12:00:00.000Z").getTime();
beforeAll(() => {
  jest.spyOn(Date, "now").mockReturnValue(FIXED_NOW);
});

afterAll(() => {
  (Date.now as jest.Mock).mockRestore?.();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("NotificationsPage", () => {
  test("renders empty state and marks all as read", async () => {
    fetchNotifications.mockResolvedValueOnce([]); // no notifications

    // This page is an async server component that returns JSX.
    const ui = await NotificationsPage();
    render(ui);

    // Assert markAllNotificationsRead is called
    expect(markAllNotificationsRead).toHaveBeenCalledTimes(1);

    // Renders empty state
    expect(await screen.findByText("Notifications")).toBeInTheDocument();
    expect(
      screen.getByText("You have no notifications yet.")
    ).toBeInTheDocument();
  });

  test("renders notifications list (name, verb, time, link) and unread styling", async () => {
    const rows = [
      {
        notification_id: "n1",
        actor_id: "user-aaa11111",
        type: "like", // -> "liked your post"
        created_at: "2025-10-06T11:59:30.000Z", // 30s ago from FIXED_NOW
        is_read: false,
        actor_profile: {
          full_name: "Alex Johnson",
          username: "alexj",
          avatar_url: "https://example.com/a.jpg",
        },
      },
      {
        notification_id: "n2",
        actor_id: "user-bbb22222",
        type: "comment", // -> "commented on your post"
        created_at: "2025-10-06T11:00:00.000Z", // 1h ago
        is_read: true,
        actor_profile: {
          full_name: null,
          username: "bee",
          avatar_url: null,
        },
      },
      {
        notification_id: "n3",
        actor_id: "user-ccc33333",
        type: "follow", // -> "started following you"
        created_at: "2025-10-05T12:00:00.000Z", // 1d ago
        is_read: true,
        actor_profile: null, // should fallback to actor_id slice
      },
    ];

    fetchNotifications.mockResolvedValueOnce(rows as any);

    const ui = await NotificationsPage();
    render(ui);

    // Mark-as-read was called
    expect(markAllNotificationsRead).toHaveBeenCalledTimes(1);

    // Page title
    expect(await screen.findByText("Notifications")).toBeInTheDocument();

    // --- Row 1 assertions ---
    // Name should be full_name if available
    const name1 = screen.getByRole("link", { name: "Alex Johnson" });
    expect(name1).toBeInTheDocument();
    expect(name1).toHaveAttribute("href", "/home/profile/user-aaa11111");

    // Verb for 'like'
    expect(screen.getByText(/liked your post/i)).toBeInTheDocument();

    // Time ago (30s -> "30s ago")
    expect(screen.getByText("30s ago")).toBeInTheDocument();

    // Unread styling adds "font-medium" on the text <p>
    // We can look for the combined sentence containing the name and verb
    const row1Sentence = name1.parentElement?.parentElement?.querySelector("p.text-sm");
    expect(row1Sentence?.className).toMatch(/font-medium/);

    // "View" button link
    const view1 = screen.getAllByRole("link", { name: "View" })[0];
    expect(view1).toHaveAttribute("href", "/home/profile/user-aaa11111");

    // --- Row 2 assertions ---
    // Name should be username if no full_name
    const name2 = screen.getByRole("link", { name: "bee" });
    expect(name2).toBeInTheDocument();
    expect(name2).toHaveAttribute("href", "/home/profile/user-bbb22222");

    // Verb for 'comment'
    expect(screen.getByText(/commented on your post/i)).toBeInTheDocument();

    // Time ago ~ 1h -> "1h ago"
    expect(screen.getByText("1h ago")).toBeInTheDocument();

    // Read item should NOT have font-medium
    const row2Sentence = name2.parentElement?.parentElement?.querySelector("p.text-sm");
    expect(row2Sentence?.className).not.toMatch(/font-medium/);

    // --- Row 3 assertions ---
    // When no profile, fallback name is actor_id.slice(0, 8)
    // user-ccc33333 -> "user-ccc"
    const name3 = screen.getByRole("link", { name: "user-ccc" });
    expect(name3).toBeInTheDocument();
    expect(name3).toHaveAttribute("href", "/home/profile/user-ccc33333");

    // Verb for 'follow'
    expect(screen.getByText(/started following you/i)).toBeInTheDocument();

    // ~1 day -> "1d ago"
    expect(screen.getByText("1d ago")).toBeInTheDocument();
  });
});
