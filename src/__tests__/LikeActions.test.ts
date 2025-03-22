import * as dbActions from "@/lib/db-actions";
import { createClient } from "@/utils/supabase/server";

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("Like Actions", () => {
  let mockSupabaseClient: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSupabaseClient = {
      from: jest.fn(() => ({
        insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ count: 1, error: null })),
          })),
        })),
      })),
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: "123" } },
          error: null,
        }),
      },
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  it("likes a post", async () => {
    await expect(dbActions.likePost(1)).resolves.not.toThrow();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Likes");
    expect(mockSupabaseClient.from().insert).toHaveBeenCalledWith({
      project_id: 1,
      user_id: "123",
    });
  });

  it("unlikes a post", async () => {
    await expect(dbActions.unlikePost(1)).resolves.not.toThrow();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Likes");
    expect(mockSupabaseClient.from().delete).toHaveBeenCalled();
  });

  it("checks if a post is liked", async () => {
    const isLiked = await dbActions.isLiked(1);
    expect(isLiked).toBe(true);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Likes");
  });

  it("handles error when liking a post", async () => {
    mockSupabaseClient.from.mockReturnValue({
      insert: jest.fn(() => Promise.resolve({ data: null, error: new Error("Like failed") })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ count: 1, error: null })),
        })),
      })),
    });

    await expect(dbActions.likePost(1)).rejects.toThrow("Like failed");
  });

  it("handles error when unliking a post", async () => {
    mockSupabaseClient.from.mockReturnValue({
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: new Error("Unlike failed") })),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ count: 1, error: null })),
        })),
      })),
    });

    await expect(dbActions.unlikePost(1)).rejects.toThrow("Unlike failed");
  });

  it("handles error when checking if a post is liked", async () => {
    mockSupabaseClient.from.mockReturnValue({
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ count: null, error: new Error("Check failed") })),
        })),
      })),
    });

    await expect(dbActions.isLiked(1)).resolves.toBe(false);
  });
});
