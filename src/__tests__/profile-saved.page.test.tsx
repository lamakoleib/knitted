/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";

// --- Safer next/image + next/link mocks (no boolean props leak)
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, fill, priority, ...rest } = props;
    return <img src={src} alt={alt} {...rest} />;
  },
}));
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: any) => (
    <a href={typeof href === "string" ? href : ""} {...rest}>
      {children}
    </a>
  ),
}));

describe("ProfileSavedPage (UI)", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.dontMock("@/lib/db-actions");
  });

  test("renders empty state when no saved projects", async () => {
    const projects: any[] = [];

    // Partial mock: override only getMySavedProjects, keep other real exports
    jest.isolateModules(async () => {
      jest.doMock("@/lib/db-actions", () => {
        const actual = jest.requireActual("@/lib/db-actions");
        return {
          ...actual,
          getMySavedProjects: jest.fn().mockResolvedValue(projects),
        };
      });

      const { default: ProfileSavedPage } = await import(
        "@/app/home/profile/[profileId]/saved/page"
      );
      const ui = await ProfileSavedPage();
      render(ui as any);

      expect(
        screen.getByRole("heading", { name: /Saved Projects/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/No saved projects yet/i)).toBeInTheDocument();
    });
  });

  test("renders grid with links + images", async () => {
    const projects = [
      {
        project_id: 101,
        title: "Cozy Cable Sweater",
        images: ["/sweater.jpg"],
        created_at: "2025-10-01T00:00:00Z",
      },
      {
        project_id: 202,
        title: null,
        images: [],
        created_at: "2025-09-20T00:00:00Z",
      },
    ];

    jest.isolateModules(async () => {
      jest.doMock("@/lib/db-actions", () => {
        const actual = jest.requireActual("@/lib/db-actions");
        return { ...actual, getMySavedProjects: jest.fn().mockResolvedValue(projects) };
      });

      const { default: ProfileSavedPage } = await import(
        "@/app/home/profile/[profileId]/saved/page"
      );
      const ui = await ProfileSavedPage();
      render(ui as any);

      // heading
      expect(
        screen.getByRole("heading", { name: /Saved Projects/i })
      ).toBeInTheDocument();

      // links
      const aTags = screen.getAllByRole("link");
      expect(aTags.map((a) => (a as HTMLAnchorElement).href)).toEqual(
        expect.arrayContaining([
          expect.stringContaining("/home/projects/101?saved=1"),
          expect.stringContaining("/home/projects/202?saved=1"),
        ])
      );

      // images
      const imgs = screen.getAllByRole("img") as HTMLImageElement[];
      expect(imgs[0].src).toContain("/sweater.jpg");
      expect(imgs[0].alt).toBe("Cozy Cable Sweater");
      expect(imgs[1].src).toContain("/placeholder.svg");
      expect(imgs[1].alt).toBe("Project 202");
    });
  });
});

// --- If you also keep db-actions tests in THIS file, unmock before importing them.
describe("db-actions (saved posts logic)", () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  // Helpers to build a Supabase mock with minimal surface we use
  function makeSupabaseMock(initialSaved: Array<number | string> = []) {
    const profileStore: Record<string, Array<number | string>> = { USER1: [...initialSaved] };
    const projectRowsRef: any[] = [];

    const single = jest.fn(async () => ({
      data: { saved_projects: [...(profileStore["USER1"] ?? [])] },
      error: null,
    }));
    const eqProfiles = jest.fn(() => ({ single }));
    const selectProfiles = jest.fn(() => ({ eq: eqProfiles }));

    const updateEq = jest.fn(async () => ({ error: null }));
    const update = jest.fn((payload: any) => {
      profileStore["USER1"] = [...(payload?.saved_projects ?? [])];
      return { eq: updateEq };
    });

    const order = jest.fn(async () => ({ data: [...projectRowsRef], error: null }));
    const isFn = jest.fn(() => ({ order }));
    const inFn = jest.fn(() => ({ is: isFn }));
    const selectProject = jest.fn(() => ({ in: inFn }));

    const from = jest.fn((table: string) => {
      if (table === "Profiles") return { select: selectProfiles, update };
      if (table === "Project") return { select: selectProject };
      throw new Error(`Unknown table ${table}`);
    });

    return {
      from,
      __state: {
        profileStore,
        projectRowsRef,
        spies: {
          single,
          eqProfiles,
          selectProfiles,
          update,
          updateEq,
          order,
          inFn,
          isFn,
          selectProject,
        },
      },
    };
  }

  test("normalizes ids + save/unsave/toggle", async () => {
    const supabase = makeSupabaseMock(["1", 2, "003", "x", 4]);

    jest.doMock("@/utils/supabase/server", () => ({
      createClient: jest.fn().mockResolvedValue(supabase),
    }));
    jest.doMock("@/lib/auth-actions", () => ({
      getCurrentUser: jest.fn().mockResolvedValue({ user: { id: "USER1" } }),
    }));

    const actions = await import("@/lib/db-actions");

    const ids = await actions.getMySavedProjectIds();
    expect(ids.sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);

    expect(await actions.isSaved(2)).toBe(true);
    expect(await actions.isSaved(5)).toBe(false);

    await actions.savePost(5);
    const afterSave = await actions.getMySavedProjectIds();
    expect(afterSave.sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);

    await actions.savePost(5); // no dup
    const again = await actions.getMySavedProjectIds();
    expect(again.filter((n) => n === 5)).toHaveLength(1);

    await actions.unsavePost(2);
    const afterUn = await actions.getMySavedProjectIds();
    expect(afterUn.sort((a, b) => a - b)).toEqual([1, 3, 4, 5]);

    const t1 = await actions.toggleSavePost(3);
    expect(t1.saved).toBe(false);
    expect(await actions.isSaved(3)).toBe(false);

    const t2 = await actions.toggleSavePost(9);
    expect(t2.saved).toBe(true);
    expect(await actions.isSaved(9)).toBe(true);
  });

  test("getMySavedProjects: [] when no ids; otherwise queries .in().order()", async () => {
    // First: no ids
    const supabaseEmpty = makeSupabaseMock([]);
    jest.doMock("@/utils/supabase/server", () => ({
      createClient: jest.fn().mockResolvedValue(supabaseEmpty),
    }));
    jest.doMock("@/lib/auth-actions", () => ({
      getCurrentUser: jest.fn().mockResolvedValue({ user: { id: "USER1" } }),
    }));

    let actions = await import("@/lib/db-actions");
    let rows = await actions.getMySavedProjects();
    expect(rows).toEqual([]);

    // Second: with ids
    jest.resetModules();

    const supabase = makeSupabaseMock([10, 20, 30]);
    supabase.__state.projectRowsRef.push(
      { project_id: 30, title: "C", created_at: "2025-10-10T00:00:00Z" },
      { project_id: 20, title: "B", created_at: "2025-10-09T00:00:00Z" },
      { project_id: 10, title: "A", created_at: "2025-10-08T00:00:00Z" },
    );

    jest.doMock("@/utils/supabase/server", () => ({
      createClient: jest.fn().mockResolvedValue(supabase),
    }));
    jest.doMock("@/lib/auth-actions", () => ({
      getCurrentUser: jest.fn().mockResolvedValue({ user: { id: "USER1" } }),
    }));

    actions = await import("@/lib/db-actions");
    rows = await actions.getMySavedProjects();

    expect(rows.map((r: any) => r.project_id)).toEqual([30, 20, 10]);

    const { spies } = supabase.__state;
    expect(spies.selectProject).toHaveBeenCalledTimes(1);
    expect(spies.inFn).toHaveBeenCalledWith("project_id", [10, 20, 30]);
    expect(spies.order).toHaveBeenCalledWith("created_at", { ascending: false });
  });

  test("save/unsave return { success:false } when user missing", async () => {
    const supabase = makeSupabaseMock([1, 2]);
    jest.doMock("@/utils/supabase/server", () => ({
      createClient: jest.fn().mockResolvedValue(supabase),
    }));
    jest.doMock("@/lib/auth-actions", () => ({
      getCurrentUser: jest.fn().mockResolvedValue({ user: null }),
    }));

    const actions = await import("@/lib/db-actions");
    await expect(actions.savePost(3)).resolves.toEqual({
      success: false,
      error: "User not found",
    });
    await expect(actions.unsavePost(1)).resolves.toEqual({
      success: false,
      error: "User not found",
    });
  });
});
