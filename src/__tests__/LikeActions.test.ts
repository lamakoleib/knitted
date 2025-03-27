import * as dbActions from "@/lib/db-actions";
import { createClient } from "@/utils/supabase/server";

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("Like Actions", () => {
  let mockInsert: jest.Mock;
  let mockDelete: jest.Mock;
  let mockSelect: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockInsert = jest.fn().mockResolvedValue({ data: null, error: null });
    mockDelete = jest.fn().mockResolvedValue({ data: null, error: null });
    mockSelect = jest.fn().mockResolvedValue({ count: 1, error: null });

    const mockFrom = jest.fn((tableName: string) => {
      if (tableName === "Likes") {
        return {
          insert: mockInsert,
          delete: () => ({
            eq: () => ({
              eq: mockDelete,
            }),
          }),
          select: () => ({
            eq: () => ({
              eq: mockSelect,
            }),
          }),
        };
      }
      return {};
    });

    (createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "123" } },
          error: null,
        }),
      },
    });
  });

  it("likes a post", async () => {
    await dbActions.likePost(1);
    expect(mockInsert).toHaveBeenCalledWith({
      project_id: 1,
      user_id: "123",
    });
  });

  it("unlikes a post", async () => {
    await dbActions.unlikePost(1);
    expect(mockDelete).toHaveBeenCalled();
  });

  it("checks if a post is liked", async () => {
    const isLiked = await dbActions.isLiked(1);
    expect(isLiked).toBe(true);
    expect(mockSelect).toHaveBeenCalled();
  });

  it("handles error when liking a post", async () => {
    mockInsert.mockResolvedValueOnce({ data: null, error: new Error("Like failed") });
    await expect(dbActions.likePost(1)).rejects.toThrow("Like failed");
  });

  it("handles error when unliking a post", async () => {
    mockDelete.mockResolvedValueOnce({ data: null, error: new Error("Unlike failed") });
    await expect(dbActions.unlikePost(1)).rejects.toThrow("Unlike failed");
  });

  it("handles error when checking if a post is liked", async () => {
    mockSelect.mockResolvedValueOnce({ count: null, error: new Error("Check failed") });
    await expect(dbActions.isLiked(1)).resolves.toBe(false);
  });
});
