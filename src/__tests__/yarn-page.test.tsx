/**
 * @file YarnPage tests
 */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// ---- Mocks for Next & UI bits ----
jest.mock("next/image", () => (props: any) => <img {...props} />);
jest.mock("next/link", () => ({ children, href }: any) => <a href={href}>{children}</a>);

// Minimal shadcn/ui mocks
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className }: any) => (
    <button className={className} onClick={onClick} data-testid="button">
      {children}
    </button>
  ),
}));
jest.mock("@/components/ui/checkbox", () => ({
  Checkbox: ({ checked, onCheckedChange, ...rest }: any) => (
    <input
      type="checkbox"
      aria-checked={!!checked}
      checked={!!checked}
      onChange={() => onCheckedChange?.(!checked)}
      {...rest}
    />
  ),
}));
jest.mock("@/components/ui/badge", () => ({
  Badge: ({ children, className }: any) => <span className={className}>{children}</span>,
}));
jest.mock("@/components/ui/separator", () => ({ Separator: () => <hr /> }));
jest.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: any) => <div>{children}</div>,
  SheetContent: ({ children }: any) => <div>{children}</div>,
  SheetTrigger: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children }: any) => <div>{children}</div>,
}));

// Mock SearchBar to directly call handleSearch
jest.mock("@/components/ui/search-bar", () => ({
  __esModule: true,
  default: ({ handleSearch }: { handleSearch: () => void }) => (
    <div>
      <button onClick={handleSearch} data-testid="search-run">Run Search</button>
    </div>
  ),
}));

// Page under test
import YarnPage from "@/app/home/yarn/page";

const mockFetch = (impl: any) => {
  // @ts-ignore
  global.fetch = jest.fn(impl);
};

// Helper matcher that checks full textContent (handles split nodes)
const hasTextContent =
  (expected: RegExp) =>
  (_: string, node: Element | null) =>
    !!node && expected.test(node?.textContent ?? "");

describe("YarnPage (client) /home/yarn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("runs initial search and falls back to MOCK_YARNS when API returns empty", async () => {
    mockFetch(async () =>
      Promise.resolve({ ok: true, json: async () => ({ results: [] }) })
    );

    render(<YarnPage />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/api/yarns?page_size=24")
    );

    // "Showing 6 results" may appear multiple times; use findAll + assert
    const showing = await screen.findAllByText(hasTextContent(/Showing\s+6\s+results/i));
    expect(showing.length).toBeGreaterThan(0);
  });

  it("shows API results when provided", async () => {
    mockFetch(async () =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          results: [
            {
              id: 101,
              name: "API Yarn One",
              yarn_company_name: "API Brand",
              yarn_weight: { name: "Worsted" },
              yarn_fibers: [{ fiber_type_name: "Wool" }],
              first_photo: { small_url: "/img1.png" },
            },
            {
              id: 202,
              name: "API Yarn Two",
              yarn_company_name: "API Brand2",
              yarn_weight: { name: "Sport" },
              yarn_fibers: [{ fiber_type_name: "Cotton" }],
              first_photo: { medium_url: "/img2.png" },
            },
          ],
        }),
      })
    );

    render(<YarnPage />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/api/yarns?page_size=24")
    );

    const showing = await screen.findAllByText(hasTextContent(/Showing\s+2\s+results/i));
    expect(showing.length).toBeGreaterThan(0);

    expect(screen.getByText("API Yarn One")).toBeInTheDocument();
    expect(screen.getByText("API Yarn Two")).toBeInTheDocument();
  });

  it("shows error UI when API returns non-ok", async () => {
    mockFetch(async () => Promise.resolve({ ok: false, status: 500 }));

    render(<YarnPage />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/api/yarns?page_size=24")
    );

    await screen.findByText(/Search failed \(500\)/i);
  });

  it("sends single weight filter as `weight=worsted` to API", async () => {
    mockFetch(async () =>
      Promise.resolve({ ok: true, json: async () => ({ results: [] }) })
    );

    render(<YarnPage />);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith("/api/yarns?page_size=24")
    );

    // Two "Worsted" checkboxes exist (mobile + desktop). Click the first.
    const worsteds = screen.getAllByLabelText("Worsted") as HTMLInputElement[];
    fireEvent.click(worsteds[0]);

    fireEvent.click(screen.getByTestId("search-run"));

    await waitFor(() =>
      expect(global.fetch).toHaveBeenLastCalledWith(
        "/api/yarns?weight=worsted&page_size=24"
      )
    );
  });
});
