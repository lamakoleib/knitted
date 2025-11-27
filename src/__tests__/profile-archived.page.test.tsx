/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock lucide-react icon used in the page
jest.mock("lucide-react", () => ({
  ArchiveRestore: (props: any) => <svg data-testid="archive-icon" {...props} />,
}));

// Mock PostCard so we don't run the real hook-heavy component
// The page imports it via: import { PostCard } from "../../../feed/components/post-card"
// but the alias path below resolves to the same file via Jest's moduleNameMapper.
jest.mock("@/app/home/feed/components/post-card", () => ({
  PostCard: ({ post }: any) => (
    <div data-testid="post-card">
      {post.title ?? `Project ${post.project_id}`}
    </div>
  ),
}));

describe("ProfileArchivedPage (UI)", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("asks user to sign in when profile is missing", async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock("@/lib/db-actions", () => ({
        getCurrentUserProfile: jest.fn().mockResolvedValue(null),
        getArchivedProjectsByUser: jest.fn(),
        unarchiveProject: jest.fn(),
      }));

      const { default: ProfileArchivedPage } = await import(
        "@/app/home/profile/[profileId]/archived/page"
      );

      const ui = await ProfileArchivedPage();
      render(ui as any);

      expect(
        screen.getByText(/Please sign in to view archived posts/i)
      ).toBeInTheDocument();
    });
  });

  test("renders empty state when there are no archived projects", async () => {
    await jest.isolateModulesAsync(async () => {
      jest.doMock("@/lib/db-actions", () => ({
        getCurrentUserProfile: jest
          .fn()
          .mockResolvedValue({ id: "USER1", username: "test" }),
        getArchivedProjectsByUser: jest.fn().mockResolvedValue([]),
        unarchiveProject: jest.fn(),
      }));

      const { default: ProfileArchivedPage } = await import(
        "@/app/home/profile/[profileId]/archived/page"
      );

      const ui = await ProfileArchivedPage();
      render(ui as any);

      // heading
      expect(
        screen.getByRole("heading", { name: /Archived Projects/i })
      ).toBeInTheDocument();

      // empty state text
      expect(
        screen.getByText(/You haven’t archived any posts yet\./i)
      ).toBeInTheDocument();
    });
  });

  test("renders grid with archived projects and unarchive buttons", async () => {
    await jest.isolateModulesAsync(async () => {
      const projects = [
        {
          project_id: 1,
          title: "Archived Project A",
          images: [],
          created_at: "2025-10-01T00:00:00Z",
        },
        {
          project_id: 2,
          title: "Archived Project B",
          images: [],
          created_at: "2025-09-01T00:00:00Z",
        },
      ];

      jest.doMock("@/lib/db-actions", () => ({
        getCurrentUserProfile: jest
          .fn()
          .mockResolvedValue({ id: "USER1", username: "test" }),
        getArchivedProjectsByUser: jest.fn().mockResolvedValue(projects),
        unarchiveProject: jest.fn(),
      }));

      const { default: ProfileArchivedPage } = await import(
        "@/app/home/profile/[profileId]/archived/page"
      );

      const ui = await ProfileArchivedPage();
      render(ui as any);

      // heading
      expect(
        screen.getByRole("heading", { name: /Archived Projects/i })
      ).toBeInTheDocument();

      // titles from mocked PostCard
      expect(screen.getByText("Archived Project A")).toBeInTheDocument();
      expect(screen.getByText("Archived Project B")).toBeInTheDocument();

      // our mocked PostCards
      const cards = screen.getAllByTestId("post-card");
      expect(cards).toHaveLength(2);

      // unarchive buttons
      const buttons = screen.getAllByRole("button", { name: /Unarchive/i });
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });
});
