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
            data: [],
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
    const mockUser = {
      user_id: "1",
      first_name: "Tony",
      last_name: "Stark",
      username: "ironman",
      bio: "Genius, billionaire, hero",
      follower_count: 10,
      following_count: 5,
    };

    (mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [mockUser],
            error: null,
          })),
        })),
      })),
    });

    const user = await dbActions.getUserByID(1);

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Profiles");
    expect(user).toEqual([mockUser]);
  });

  it("fetches a project by ID", async () => {
    const mockProject = {
      project_id: 1,
      user_id: "1",
      pattern_id: null,
      created_at: "2025-01-01T12:00:00Z",
      yarn_list: null,
      yarrn_id: null,
    };

    (mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [mockProject],
            error: null,
          })),
        })),
      })),
    });

    const project = await dbActions.getProjectByID(1);

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Project");
    expect(project).toEqual([mockProject]);
  });

  it("fetches a pattern by ID", async () => {
    const mockPattern = {
      pattern_id: 1,
      pattern_name: "Classic Pattern",
      author_name: "Natasha Romanoff",
      project_id: null,
      yarn_id: null,
    };

    (mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [mockPattern],
            error: null,
          })),
        })),
      })),
    });

    const pattern = await dbActions.getPatternByID("1");

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Patterns");
    expect(pattern).toEqual([mockPattern]);
  });

  it("fetches comments by project ID", async () => {
    const mockComment = {
      comment_id: 1,
      project_id: 1,
      user_id: "user_123",
      created_at: "2025-01-01T12:00:00Z",
    };

    (mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [mockComment],
            error: null,
          })),
        })),
      })),
    });

    const comments = await dbActions.getCommentsByProjectID("1");

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Comments");
    expect(comments).toEqual([mockComment]);
  });

  it("fetches followers by user ID", async () => {
    const mockFollower = {
      followers_id: "follower_1",
      user_id: "1",
    };

    (mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [mockFollower],
            error: null,
          })),
        })),
      })),
    });

    const followers = await dbActions.getFollowersByUserID("1");

    expect(createClient).toHaveBeenCalled();
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Followers");
    expect(followers).toEqual([mockFollower]);
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
