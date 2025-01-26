import * as dbActions from "@/lib/db-actions";
import { createClient } from "@/utils/supabase/server";

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("db-actions", () => {
  const mockSupabaseClient = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [{ id: 1, name: "Iron Man" }],
            error: null,
          })),
        })),
      })),
    })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);
  });

  it("fetches a user by ID", async () => {
    const user = await dbActions.getUserByID(1);

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Profiles");
    expect(user).toEqual([{ id: 1, name: "Iron Man" }]);
  });

  it("fetches a project by ID", async () => {
    (mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [{ id: 1, name: "Test Project" }],
            error: null,
          })),
        })),
      })),
    });

    const project = await dbActions.getProjectByID(1);

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Project");
    expect(project).toEqual([{ id: 1, name: "Test Project" }]);
  });

  it("fetches a pattern by ID", async () => {
    (mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [{ id: 1, name: "Pattern 1" }],
            error: null,
          })),
        })),
      })),
    });

    const pattern = await dbActions.getPatternByID("1");

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Patterns");
    expect(pattern).toEqual([{ id: 1, name: "Pattern 1" }]);
  });

  it("fetches comments by project ID", async () => {
    (mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [{ id: 1, content: "Great project!" }],
            error: null,
          })),
        })),
      })),
    });

    const comments = await dbActions.getCommentsByProjectID("1");

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Comments");
    expect(comments).toEqual([{ id: 1, content: "Great project!" }]);
  });

  it("fetches followers by user ID", async () => {
    (mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [{ id: 1, follower_id: "user_123" }],
            error: null,
          })),
        })),
      })),
    });

    const followers = await dbActions.getFollowersByUserID("1");

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Followers");
    expect(followers).toEqual([{ id: 1, follower_id: "user_123" }]);
  });

  it("throws an error if the query fails", async () => {
    (mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: null,
            error: new Error("Query failed"),
          })),
        })),
      })),
    });

    await expect(dbActions.getUserByID(1)).rejects.toThrow("Query failed");
  });
});