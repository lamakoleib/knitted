// src/__tests__/db-actions.test.ts
import * as dbActions from "@/lib/db-actions"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}))

jest.mock("@/lib/auth-actions", () => ({
  getCurrentUser: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}))
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}))

describe("db-actions", () => {
  // ----- Existing simple supabase mock, used by the existing tests -----
  const mockSupabaseClient = {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        })),
      })),
    })),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockReturnValue(mockSupabaseClient)

    // Silence console noise from db-actions logs during tests
    jest.spyOn(console, "error").mockImplementation(() => {})
    jest.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    ;(console.error as jest.Mock).mockRestore?.()
    ;(console.log as jest.Mock).mockRestore?.()
  })

  it("fetches a user by ID", async () => {
    const mockUser = {
      user_id: "1",
      first_name: "Tony",
      last_name: "Stark",
      username: "ironman",
      bio: "Genius, billionaire, hero",
      follower_count: 10,
      following_count: 5,
    }

    ;(mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockUser,
            error: null,
          }),
        })),
      })),
    })

    const user = await dbActions.getProfileByID("1")

    expect(createClient).toHaveBeenCalled()
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Profiles")
    expect(user).toEqual(mockUser)
  })

  it("fetches a project by ID", async () => {
    const mockProject = {
      project_id: 1,
      user_id: "1",
      pattern_id: null,
      created_at: "2025-01-01T12:00:00Z",
      yarn_list: null,
      yarrn_id: null,
    }

    ;(mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockProject,
            error: null,
          }),
        })),
      })),
    })

    const project = await dbActions.getProjectByID("1")

    expect(createClient).toHaveBeenCalled()
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Project")
    expect(project).toEqual(mockProject)
  })

  it("fetches a pattern by ID", async () => {
    const mockPattern = {
      pattern_id: 1,
      pattern_name: "Classic Pattern",
      author_name: "Natasha Romanoff",
      project_id: null,
      yarn_id: null,
    }

    ;(mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [mockPattern],
            error: null,
          })),
        })),
      })),
    })

    const pattern = await dbActions.getPatternByID("1")

    expect(createClient).toHaveBeenCalled()
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Patterns")
    expect(pattern).toEqual([mockPattern])
  })

  it("fetches comments by project ID", async () => {
    const mockComment = {
      comment_id: 1,
      project_id: 1,
      user_id: "user_123",
      created_at: "2025-01-01T12:00:00Z",
    }

    ;(mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [mockComment],
            error: null,
          })),
        })),
      })),
    })

    const comments = await dbActions.getCommentsByProjectID("1")

    expect(createClient).toHaveBeenCalled()
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Comments")
    expect(comments).toEqual([mockComment])
  })

  it("fetches followers by user ID", async () => {
    const mockFollower = {
      followers_id: "follower_1",
      user_id: "1",
    }

    ;(mockSupabaseClient.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          returns: jest.fn(() => ({
            data: [mockFollower],
            error: null,
          })),
        })),
      })),
    })

    const followers = await dbActions.getFollowersByUserID("1")

    expect(createClient).toHaveBeenCalled()
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("Followers")
    expect(followers).toEqual([mockFollower])
  })

  it("throws an error if the query fails", async () => {
    ;(mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: new Error("Query failed"),
          }),
        })),
      })),
    })

    await expect(dbActions.getProfileByID("1")).rejects.toThrow("Query failed")
  })

  it("handles fetching a user with no followers", async () => {
    ;(mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: { follower_count: 0 },
            error: null,
          }),
        })),
      })),
    })

    const user = await dbActions.getProfileByID("1")
    expect(user.follower_count).toBe(0)
  })

  it("throws an error when fetching a non-existent project", async () => {
    ;(mockSupabaseClient.from as jest.Mock).mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: new Error("Project not found"),
          }),
        })),
      })),
    })

    await expect(dbActions.getProjectByID("999")).rejects.toThrow("Project not found")
  })

  // ============================================
  // deleteProjectByID tests (ADDED/FIXED)
  // ============================================

  type DeleteCall = { table: string; eq: [string, unknown][] }
  type Calls = { from: string[]; deletes: DeleteCall[] }
  type DeleteResult = { data?: unknown; error: null | Error }

  // Fully thenable mock specifically for deleteProjectByID
  function makeSupabaseDeleteMock(opts: {
    fetchError?: boolean
    fetchProjectData?: { user_id: string } | null
    finalDeleteError?: boolean
    calls?: Calls
  }) {
    const calls: Calls =
      opts.calls ?? { from: [] as string[], deletes: [] as DeleteCall[] }

    let lastFromTable: string | null = null
    let lastDeleteTable: string | null = null

    // SELECT chain: .select().eq().single()
    const single = jest.fn(async () => {
      if (opts.fetchError) return { data: null, error: new Error("fetch error") }
      return { data: opts.fetchProjectData ?? null, error: null }
    })
    const whereEq_Select = jest.fn((_col: string, _val: unknown) => ({ single }))
    const select = jest.fn((_cols: string) => ({ eq: whereEq_Select }))

    // Dependent deletes chain: .delete().eq(...)
    const whereEq_Delete = jest.fn(async (col: string, val: unknown) => {
      if (lastDeleteTable) {
        calls.deletes.push({ table: lastDeleteTable, eq: [[col, val]] })
      }
      return { data: null, error: null } as DeleteResult
    })
    const _delete = jest.fn(() => ({ eq: whereEq_Delete }))

    // Final Project delete result
    const finalDelete = jest.fn(async () => {
      if (opts.finalDeleteError) {
        return { data: null, error: new Error("final delete error") }
      }
      return { data: null, error: null }
    })

    // Helper: a thenable object that allows chaining eq().eq() and resolves to finalDelete()
    const thenableFinal = () =>
      ({
        eq: (col: string, val: unknown) => {
          if (lastFromTable === "Project") {
            const last = calls.deletes[calls.deletes.length - 1]
            if (last && last.table === "Project") {
              last.eq.push([col, val])
            } else {
              calls.deletes.push({ table: "Project", eq: [[col, val]] })
            }
          }
          return thenableFinal()
        },
        then: (resolve: any, reject?: any) => finalDelete().then(resolve, reject),
      } as any)

    const from = jest.fn((table: string) => {
      calls.from.push(table)
      lastFromTable = table

      if (table === "Project") {
        // Supports both fetch and final delete paths
        return {
          select,
          delete: () =>
            ({
              eq: (col: string, val: unknown) => {
                const existing = calls.deletes.find((d) => d.table === "Project")
                if (!existing) {
                  calls.deletes.push({ table: "Project", eq: [[col, val]] })
                } else {
                  existing.eq.push([col, val])
                }
                return thenableFinal()
              },
              // If someone awaited delete() directly
              then: (resolve: any, reject?: any) => finalDelete().then(resolve, reject),
            } as any),
        }
      }

      if (["Comments", "Likes", "project_tags", "notifications"].includes(table)) {
        lastDeleteTable = table
        return { delete: _delete } as any
      }

      return {} as any
    })

    return { client: { from } as any, calls }
  }

  const { getCurrentUser } = jest.requireMock("@/lib/auth-actions") as {
    getCurrentUser: jest.Mock
  }

  it("deleteProjectByID → throws 'Not authenticated' when user is not logged in", async () => {
    getCurrentUser.mockResolvedValue({ user: null })

    const { client } = makeSupabaseDeleteMock({
      fetchProjectData: { user_id: "owner-123" },
    })
    ;(createClient as jest.Mock).mockReturnValueOnce(client)

    await expect(dbActions.deleteProjectByID(42)).rejects.toThrow("Not authenticated")
    expect(redirect).not.toHaveBeenCalled()
  })

  it("deleteProjectByID → throws 'Project not found' when fetch error occurs", async () => {
    getCurrentUser.mockResolvedValue({ user: { id: "u1" } })

    const { client } = makeSupabaseDeleteMock({
      fetchError: true,
    })
    ;(createClient as jest.Mock).mockReturnValueOnce(client)

    await expect(dbActions.deleteProjectByID(99)).rejects.toThrow("Project not found")
    expect(redirect).not.toHaveBeenCalled()
  })

  it("deleteProjectByID → throws 'Project not found' when fetch returns null", async () => {
    getCurrentUser.mockResolvedValue({ user: { id: "u1" } })

    const { client } = makeSupabaseDeleteMock({
      fetchProjectData: null,
    })
    ;(createClient as jest.Mock).mockReturnValueOnce(client)

    await expect(dbActions.deleteProjectByID(5)).rejects.toThrow("Project not found")
    expect(redirect).not.toHaveBeenCalled()
  })

  it("deleteProjectByID → throws 'Not authorized' when current user does not own the project", async () => {
    getCurrentUser.mockResolvedValue({ user: { id: "u1" } })

    const { client } = makeSupabaseDeleteMock({
      fetchProjectData: { user_id: "someone-else" },
    })
    ;(createClient as jest.Mock).mockReturnValueOnce(client)

    await expect(dbActions.deleteProjectByID(5)).rejects.toThrow("Not authorized")
    expect(redirect).not.toHaveBeenCalled()
  })

  it("deleteProjectByID → successful path: cascades deletes, deletes project, redirects to profile", async () => {
    const me = { user: { id: "owner-123" } }
    getCurrentUser.mockResolvedValue(me)

    const calls: Calls = { from: [], deletes: [] }
    const { client } = makeSupabaseDeleteMock({
      fetchProjectData: { user_id: me.user.id },
      calls,
    })
    ;(createClient as jest.Mock).mockReturnValueOnce(client)

    await dbActions.deleteProjectByID(777)

    // Verify dependent deletions received project_id filter
    for (const t of ["Comments", "Likes", "project_tags", "notifications"]) {
      const entry = calls.deletes.find((d) => d.table === t)
      expect(entry).toBeTruthy()
      expect(entry!.eq[0][0]).toBe("project_id")
      expect(entry!.eq[0][1]).toBe(777)
    }

    // Verify final Project delete has both filters
    const projectDelete = calls.deletes.find((d) => d.table === "Project")
    expect(projectDelete).toBeTruthy()

    const keys = projectDelete!.eq.map(([k]) => k).sort()
    expect(keys).toEqual(["project_id", "user_id"].sort())

    const pid = projectDelete!.eq.find(([k]) => k === "project_id")![1]
    const uid = projectDelete!.eq.find(([k]) => k === "user_id")![1]
    expect(pid).toBe(777)
    expect(uid).toBe(me.user.id)

    expect(redirect).toHaveBeenCalledTimes(1)
    expect(redirect).toHaveBeenCalledWith(`/home/profile/${me.user.id}`)
  })

  it("deleteProjectByID → throws if final delete returns an error", async () => {
    const me = { user: { id: "owner-123" } }
    getCurrentUser.mockResolvedValue(me)

    const { client } = makeSupabaseDeleteMock({
      fetchProjectData: { user_id: me.user.id },
      finalDeleteError: true,
    })
    ;(createClient as jest.Mock).mockReturnValueOnce(client)

    await expect(dbActions.deleteProjectByID(111)).rejects.toThrow("final delete error")
    expect(redirect).not.toHaveBeenCalled()
  })
  // ============================================
// Tagging Users Feature Tests
// ============================================
describe("Tagging Users Feature", () => {
  const mockSupabaseClient: any = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockResolvedValue(mockSupabaseClient);
  });

  // ------------------------------
  // tagUsersOnProject
  // ------------------------------
  it("tagUsersOnProject → returns success true if no taggedUserIds provided", async () => {
    const res = await dbActions.tagUsersOnProject(1, []);
    expect(res).toEqual({ success: true });
  });

  it("tagUsersOnProject → returns not authenticated when user missing", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } });
    const res = await dbActions.tagUsersOnProject(1, ["u1", "u2"]);
    expect(res.success).toBe(false);
    expect(res.error).toBe("Not authenticated");
  });

  it("tagUsersOnProject → upserts rows and succeeds", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "me" } },
    });

    const upsert = jest.fn().mockResolvedValue({ error: null });
    mockSupabaseClient.from.mockReturnValue({ upsert });

    const result = await dbActions.tagUsersOnProject(77, ["a", "b"]);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith("project_tags");
    expect(upsert).toHaveBeenCalledWith(
      [
        { project_id: 77, tagged_user: "a", tagged_by: "me" },
        { project_id: 77, tagged_user: "b", tagged_by: "me" },
      ],
      { onConflict: "project_id,tagged_user", ignoreDuplicates: true }
    );
    expect(result).toEqual({ success: true, error: null });
  });

  it("tagUsersOnProject → handles upsert error", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "me" } },
    });

    const upsert = jest.fn().mockResolvedValue({ error: new Error("fail") });
    mockSupabaseClient.from.mockReturnValue({ upsert });

    const res = await dbActions.tagUsersOnProject(5, ["x"]);
    expect(res.success).toBe(false);
    expect(res.error).toBeInstanceOf(Error);
  });

  // ------------------------------
  // getTaggedProjectsByUserID
  // ------------------------------
  it("getTaggedProjectsByUserID → returns [] if error or no projects", async () => {
    const select = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({ data: null, error: new Error("fail") }),
      }),
    });
    mockSupabaseClient.from.mockReturnValue({ select });

    const result = await dbActions.getTaggedProjectsByUserID("u1");
    expect(result).toEqual([]);
  });

  it("getTaggedProjectsByUserID → returns projects with comment counts", async () => {
    const projects = [
      { project_id: 1, title: "A" },
      { project_id: 2, title: "B" },
    ];

    // Mock the first .from('Project')
    const order = jest.fn().mockResolvedValue({ data: projects, error: null });
    const eq = jest.fn().mockReturnValue({ order });
    const select = jest.fn().mockReturnValue({ eq });

    // Mock Comments count query
    const selectComments = jest
      .fn()
      .mockReturnValue({
        eq: jest.fn().mockResolvedValue({ count: 5 }),
      });

    mockSupabaseClient.from.mockImplementation((table: string) => {
      if (table === "Project") return { select };
      if (table === "Comments") return { select: selectComments };
      return {};
    });

    const result = await dbActions.getTaggedProjectsByUserID("u1");
    expect(result).toEqual([
      { project_id: 1, title: "A", comment_count: 5 },
      { project_id: 2, title: "B", comment_count: 5 },
    ]);
  });

  // ------------------------------
  // updateProjectTagsByUsernames
  // ------------------------------
  it("updateProjectTagsByUsernames → throws if not authenticated", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } });
    await expect(
      dbActions.updateProjectTagsByUsernames(1, "user1")
    ).rejects.toThrow("Not authenticated");
  });

  it("updateProjectTagsByUsernames → deletes all tags if empty CSV", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "me" } },
    });
    const del = jest.fn().mockResolvedValue({ error: null });
    mockSupabaseClient.from.mockReturnValue({ delete: () => ({ eq: del }) });

    await dbActions.updateProjectTagsByUsernames(1, "   ");
    expect(del).toHaveBeenCalledWith("project_id", 1);
  });

  it("updateProjectTagsByUsernames → looks up profiles and inserts new tags", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "me" } },
    });

    const profiles = [
      { id: "u1", username: "alice" },
      { id: "u2", username: "bob" },
    ];

    const insert = jest.fn().mockResolvedValue({ error: null });
    const deleteMock = jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: null }) });
    const selectProfiles = jest.fn().mockReturnValue({
      in: jest.fn().mockResolvedValue({ data: profiles, error: null }),
    });

    mockSupabaseClient.from.mockImplementation((table: string) => {
      if (table === "Profiles") return { select: selectProfiles };
      if (table === "project_tags") return { delete: deleteMock, insert };
      return {};
    });

    await dbActions.updateProjectTagsByUsernames(11, "alice, bob");

    expect(selectProfiles).toHaveBeenCalled();
    expect(insert).toHaveBeenCalledWith([
      { project_id: 11, tagged_user: "u1", tagged_by: "me" },
      { project_id: 11, tagged_user: "u2", tagged_by: "me" },
    ]);
  });

  it("updateProjectTagsByUsernames → throws if lookup fails", async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: { id: "me" } },
    });

    const selectProfiles = jest.fn().mockReturnValue({
      in: jest.fn().mockResolvedValue({ data: null, error: new Error("lookup fail") }),
    });
    mockSupabaseClient.from.mockReturnValue({ select: selectProfiles });

    await expect(
      dbActions.updateProjectTagsByUsernames(11, "alice")
    ).rejects.toThrow("lookup fail");
  });

  // ------------------------------
  // getTaggedUsersForProject
  // ------------------------------
  it("getTaggedUsersForProject → returns list of profiles", async () => {
    const data = [
      {
        Profiles: { id: "u1", username: "alice", full_name: "Alice", avatar_url: "img" },
      },
      { Profiles: { id: "u2", username: "bob", full_name: "Bob", avatar_url: "img2" } },
    ];
    const eq = jest.fn().mockResolvedValue({ data, error: null });
    const select = jest.fn(() => ({ eq }));
    mockSupabaseClient.from.mockReturnValue({ select });

    const result = await dbActions.getTaggedUsersForProject(1);

    expect(mockSupabaseClient.from).toHaveBeenCalledWith("project_tags");
    expect(result).toEqual([
      { id: "u1", username: "alice", full_name: "Alice", avatar_url: "img" },
      { id: "u2", username: "bob", full_name: "Bob", avatar_url: "img2" },
    ]);
  });

  it("getTaggedUsersForProject → throws if supabase returns error", async () => {
    const eq = jest.fn().mockResolvedValue({ data: null, error: new Error("fail") });
    const select = jest.fn(() => ({ eq }));
    mockSupabaseClient.from.mockReturnValue({ select });

    await expect(dbActions.getTaggedUsersForProject(1)).rejects.toThrow("fail");
  });
});
})
  // ============================================
  // updateAccountSettings
  // ============================================
  describe("updateAccountSettings", () => {
    it("returns auth error when supabase.auth.getUser has error", async () => {
      const supabase: any = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: "auth fail" },
          }),
        },
        from: jest.fn(),
      }

      ;(createClient as jest.Mock).mockResolvedValueOnce(supabase)

      const res = await dbActions.updateAccountSettings({
        name: "Zey",
        birthday: "2005-03-15",
      })

      expect(res).toEqual({ success: false, message: "auth fail" })
      expect(supabase.from).not.toHaveBeenCalled()
    })

    it("returns Not authenticated when there is no current user", async () => {
      const supabase: any = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
        from: jest.fn(),
      }

      ;(createClient as jest.Mock).mockResolvedValueOnce(supabase)

      const res = await dbActions.updateAccountSettings({ name: "Z" })

      expect(res).toEqual({ success: false, message: "Not authenticated" })
      expect(supabase.from).not.toHaveBeenCalled()
    })

    it("updates profile and revalidates paths on success", async () => {
      const eq = jest.fn().mockResolvedValue({ error: null })
      const update = jest.fn(() => ({ eq }))
      const from = jest.fn().mockReturnValue({ update })

      const supabase: any = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: "u1" } },
            error: null,
          }),
        },
        from,
      }

      ;(createClient as jest.Mock).mockResolvedValueOnce(supabase)

      const res = await dbActions.updateAccountSettings({
        name: "Zeynep",
        birthday: "2005-03-15",
      })

      expect(res).toEqual({ success: true })
      expect(from).toHaveBeenCalledWith("Profiles")
      expect(update).toHaveBeenCalledWith({
        full_name: "Zeynep",
        birthday: "2005-03-15",
      })
      expect(eq).toHaveBeenCalledWith("id", "u1")
      expect(revalidatePath).toHaveBeenCalledWith("/home")
      expect(revalidatePath).toHaveBeenCalledWith("/home/profile/u1")
    })

    it("returns failure when supabase update returns an error", async () => {
      const eq = jest.fn().mockResolvedValue({
        error: { message: "db error" },
      })
      const update = jest.fn(() => ({ eq }))
      const from = jest.fn().mockReturnValue({ update })

      const supabase: any = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: "u1" } },
            error: null,
          }),
        },
        from,
      }

      ;(createClient as jest.Mock).mockResolvedValueOnce(supabase)

      const res = await dbActions.updateAccountSettings({ name: "Z" })

      expect(res.success).toBe(false)
      expect(res.message).toBe("db error")
    })

    it("handles unexpected errors via catch block", async () => {
      ;(createClient as jest.Mock).mockRejectedValueOnce(
        new Error("boom error"),
      )

      const res = await dbActions.updateAccountSettings({ name: "Z" })

      expect(res.success).toBe(false)
      expect(res.message).toBe("boom error")
    })
  })
  // ============================================
  // updateAppearanceSettings
  // ============================================
  describe("updateAppearanceSettings", () => {
    const cookiesMock = cookies as unknown as jest.Mock

    beforeEach(() => {
      cookiesMock.mockReset()
    })

    it("returns Not authenticated when there is no user", async () => {
      const supabase: any = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
        from: jest.fn(),
      }

      ;(createClient as jest.Mock).mockResolvedValueOnce(supabase)

      const res = await dbActions.updateAppearanceSettings({
        theme: "dark",
        font: "inter",
      })

      expect(res).toEqual({ success: false, message: "Not authenticated" })
      expect(supabase.from).not.toHaveBeenCalled()
      expect(cookiesMock).not.toHaveBeenCalled()
    })

    it("returns auth error when getUser has error", async () => {
      const supabase: any = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: "auth fail" },
          }),
        },
        from: jest.fn(),
      }

      ;(createClient as jest.Mock).mockResolvedValueOnce(supabase)

      const res = await dbActions.updateAppearanceSettings({
        theme: "light",
        font: "system",
      })

      expect(res.success).toBe(false)
      expect(res.message).toBe("auth fail")
    })

    it("updates profile, sets cookies and returns success", async () => {
      const eq = jest.fn().mockResolvedValue({ error: null })
      const update = jest.fn(() => ({ eq }))
      const from = jest.fn().mockReturnValue({ update })

      const supabase: any = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: "u1" } },
            error: null,
          }),
        },
        from,
      }

      const set = jest.fn()
      cookiesMock.mockResolvedValue({ set })

      ;(createClient as jest.Mock).mockResolvedValueOnce(supabase)

      const res = await dbActions.updateAppearanceSettings({
        theme: "dark",
        font: "manrope",
      })

      expect(res).toEqual({ success: true })
      expect(from).toHaveBeenCalledWith("Profiles")
      expect(update).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: "dark",
          font: "manrope",
        }),
      )
      expect(eq).toHaveBeenCalledWith("id", "u1")

      // cookies set for theme + font
      expect(set).toHaveBeenCalledTimes(2)
      expect(set.mock.calls[0][0]).toBe("theme")
      expect(set.mock.calls[0][1]).toBe("dark")
      expect(set.mock.calls[1][0]).toBe("font")
      expect(set.mock.calls[1][1]).toBe("manrope")
    })

    it("handles unexpected errors (e.g. createClient rejects)", async () => {
      ;(createClient as jest.Mock).mockRejectedValueOnce(
        new Error("unexpected"),
      )

      const res = await dbActions.updateAppearanceSettings({
        theme: "light",
        font: "inter",
      })

      expect(res.success).toBe(false)
      expect(res.message).toBe("unexpected")
    })
  })

