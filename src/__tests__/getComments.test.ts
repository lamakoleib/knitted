import { getComments } from "@/lib/db-actions";
import { createClient } from "@/utils/supabase/server";
jest.mock("@/utils/supabase/server", () => ({ createClient: jest.fn() }));

const chain = () => { const q:any={}; q.select=jest.fn(()=>q); q.eq=jest.fn(()=>q); q.order=jest.fn(()=>q);
  q.then=undefined; q.data=undefined; q.error=null; return q; };

describe("getComments", () => {
  const comments = chain();
  const supabase:any = { from: jest.fn(()=>comments) };

  beforeEach(()=>{ jest.clearAllMocks(); (createClient as jest.Mock).mockResolvedValue(supabase); });

  it("maps rows and falls back to 'Unknown User' when profile missing", async () => {
    comments.select.mockReturnValue(comments); comments.eq.mockReturnValue(comments); comments.order.mockReturnValue(comments);
    comments.data = [
      { comment_id: 1, created_at: "2025-01-01", comment: "hi", user_id: "u1", Profiles: { username:"z", avatar_url:"x" } },
      { comment_id: 2, created_at: "2025-01-02", comment: "hey", user_id: "u2", Profiles: null },
    ];
    const res = await getComments(99);
    expect(res).toEqual([
      { id:1, created_at:"2025-01-01", comment:"hi", user_id:"u1", username:"z", avatar_url:"x" },
      { id:2, created_at:"2025-01-02", comment:"hey", user_id:"u2", username:"Unknown User", avatar_url:undefined },
    ]);
  });

  it("throws on error", async () => {
    comments.error = { message:"bad" } as any;
    await expect(getComments(1)).rejects.toBeDefined();
  });
});
