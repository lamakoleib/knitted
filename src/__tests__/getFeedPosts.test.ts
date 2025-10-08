import { getFeedPosts } from "@/lib/db-actions";
import { createClient } from "@/utils/supabase/server";

jest.mock("@/utils/supabase/server", () => ({ createClient: jest.fn() }));
jest.mock("@/lib/auth-actions", () => ({
  getCurrentUser: jest.fn(async () => ({ user: { id: "u1" } })),
}));

const chain = () => {
  const q: any = {};
  q.select = jest.fn(() => q);
  q.eq = jest.fn(() => q);
  q.in = jest.fn(() => q);
  q.order = jest.fn(() => q);
  q.single = jest.fn(() => q);
  q.then = undefined;
  q.data = undefined;
  q.error = null;
  return q;
};

describe("getFeedPosts", () => {
  let followers: any;
  let project: any;
  let supabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    followers = chain();
    project = chain();
    supabase = {
      from: jest.fn((t: string) => (t === "Followers" ? followers : project)),
    };
    (createClient as jest.Mock).mockResolvedValue(supabase);
  });

  it("returns [] when Followers error or empty", async () => {
    followers.select.mockReturnValue(followers);
    followers.eq.mockReturnValue(followers);
    followers.error = { message: "fail" } as any;
    expect(await getFeedPosts()).toEqual([]);

    // reset and test empty followers
    followers.error = null;
    followers.data = [];
    expect(await getFeedPosts()).toEqual([]);
  });

  it("returns [] when Project query errors", async () => {
    followers.select.mockReturnValue(followers);
    followers.eq.mockReturnValue(followers);
    followers.data = [{ followers_id: "a" }];

    project.select.mockReturnValue(project);
    project.in.mockReturnValue(project);
    project.order.mockReturnValue(project);
    project.error = { message: "bad" } as any;

    expect(await getFeedPosts()).toEqual([]);
  });

  it("returns posts when ok", async () => {
    followers.select.mockReturnValue(followers);
    followers.eq.mockReturnValue(followers);
    followers.data = [{ followers_id: "a" }, { followers_id: "b" }];

    project.select.mockReturnValue(project);
    project.in.mockReturnValue(project);
    project.order.mockReturnValue(project);
    project.data = [{ project_id: 1, user_id: "a" }];

    expect(await getFeedPosts()).toEqual([{ project_id: 1, user_id: "a" }]);
  });
});
