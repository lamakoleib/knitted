import { getProjectsByUserID } from "@/lib/db-actions";
import { createClient } from "@/utils/supabase/server";

jest.mock("@/utils/supabase/server", () => ({ createClient: jest.fn() }));
jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({ get: jest.fn(), set: jest.fn(), delete: jest.fn() })),
}));

const chain = () => {
  const q: any = {};
  q.select = jest.fn(() => q);
  q.eq = jest.fn(() => q);
  q.order = jest.fn(() => q);
  q.then = undefined;
  q.data = undefined;
  q.error = null;
  q.count = undefined;
  return q;
};

describe("getProjectsByUserID", () => {
  let projects: any;
  let comments1: any;
  let comments2: any;
  let supabase: any;

  beforeEach(() => {
    jest.clearAllMocks();

    projects = chain();
    comments1 = chain();
    comments2 = chain();

    supabase = {
      from: jest.fn((t: string) => {
        if (t === "Project") return projects;
        if (t === "Comments") {
          // first call -> comments1, second call -> comments2
          return (supabase.__which++ ? comments2 : comments1);
        }
        return chain();
      }),
      __which: 0,
    };

    (createClient as jest.Mock).mockResolvedValue(supabase);
  });

  it("returns [] when base query errors", async () => {
    projects.select.mockReturnValue(projects);
    projects.eq.mockReturnValue(projects);
    projects.error = { message: "base error" } as any;

    const res = await getProjectsByUserID("u1");
    expect(res).toEqual([]);
  });

  it("fills comment_count=0 when a per-project count errors", async () => {
    // base projects OK
    projects.select.mockReturnValue(projects);
    projects.eq.mockReturnValue(projects);
    projects.data = [
      { project_id: 1, title: "A", images: [] },
      { project_id: 2, title: "B", images: [] },
    ];

    // first project's count OK
    comments1.select.mockReturnValue(comments1);
    comments1.eq.mockReturnValue(comments1);
    comments1.count = 5;

    // second project's count errors
    comments2.select.mockReturnValue(comments2);
    comments2.eq.mockReturnValue(comments2);
    comments2.error = { message: "boom" } as any;

    const res = await getProjectsByUserID("u1");
    expect(res).toEqual([
      { project_id: 1, title: "A", images: [], comment_count: 5 },
      { project_id: 2, title: "B", images: [], comment_count: 0 },
    ]);
  });
});
