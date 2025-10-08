import { searchProfiles } from "@/lib/db-actions";
import { createClient } from "@/utils/supabase/server";
jest.mock("@/utils/supabase/server", () => ({ createClient: jest.fn() }));

const chain = () => { const q:any={}; q.select=jest.fn(()=>q); q.or=jest.fn(()=>q); q.limit=jest.fn(()=>q);
  q.then=undefined; q.data=undefined; q.error=null; return q; };

describe("searchProfiles", () => {
  const profiles = chain();
  const supabase:any = { from: jest.fn(()=>profiles) };

  beforeEach(()=>{ jest.clearAllMocks(); (createClient as jest.Mock).mockResolvedValue(supabase); });

  it("returns [] when term < 2 chars", async () => {
    expect(await searchProfiles(" ")).toEqual([]);
    expect(await searchProfiles("a")).toEqual([]);
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("queries ilike on full_name|username and limits", async () => {
    profiles.select.mockReturnValue(profiles); profiles.or.mockReturnValue(profiles); profiles.limit.mockReturnValue(profiles);
    profiles.data = [{ id:"1", username:"z" }];
    const res = await searchProfiles("ze");
    expect(supabase.from).toHaveBeenCalledWith("Profiles");
    expect(profiles.or).toHaveBeenCalled();
    expect(res).toEqual([{ id:"1", username:"z" }]);
  });

  it("returns [] on error", async () => {
    profiles.select.mockReturnValue(profiles); profiles.or.mockReturnValue(profiles); profiles.limit.mockReturnValue(profiles);
    profiles.error = { message:"boom" } as any;
    const res = await searchProfiles("ze");
    expect(res).toEqual([]);
  });
});
