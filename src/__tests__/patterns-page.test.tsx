/**
 * @file PatternsPage tests
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("next/image", () => {
  return (props: any) => {
    const { unoptimized, ...rest } = props;
    return <img {...rest} />;
  };
});

jest.mock("next/link", () => ({ children, href }: any) => (
  <a href={href}>{children}</a>
));

jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, ...rest }: any) => (
    <button
      className={className}
      onClick={onClick}
      data-testid="button"
      {...rest}
    >
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
  Badge: ({ children, className }: any) => (
    <span className={className}>{children}</span>
  ),
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

jest.mock("@/components/ui/search-bar", () => ({
  __esModule: true,
  default: ({
    searchTerm,
    setSearchTerm,
    handleSearch,
  }: {
    searchTerm: string;
    setSearchTerm: (s: string) => void;
    handleSearch: () => void;
  }) => (
    <div>
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search patterns"
      />
      <button onClick={handleSearch} data-testid="search-run">
        Run Search
      </button>
    </div>
  ),
}));

// Provide a minimal AbortController if the environment doesn't have one
if (!(global as any).AbortController) {
  (global as any).AbortController = class {
    signal: { aborted: boolean };
    constructor() {
      this.signal = { aborted: false };
    }
    abort() {
      this.signal.aborted = true;
    }
  };
}

import PatternsPage from "@/app/home/patterns/page";

const hasTextContent =
  (expected: RegExp) =>
  (_: string, node: Element | null) =>
    !!node && expected.test(node?.textContent ?? "");

describe("PatternsPage /home/patterns", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global as any).fetch = jest.fn();
  });

  it("renders with 12 mock patterns initially", async () => {
    render(<PatternsPage />);

    const showingEls = await screen.findAllByText(
      hasTextContent(/Showing\s+12\s+results/i)
    );
    expect(showingEls.length).toBeGreaterThan(0);

    expect(screen.getByText("Nordic Yoke")).toBeInTheDocument();
    expect(screen.getByText("Classic Beanie")).toBeInTheDocument();
  });

  it("filters by search term 'hat' and shows 2 results", async () => {
    render(<PatternsPage />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "hat" } });

    const showing = await screen.findAllByText(
      hasTextContent(/Showing\s+2\s+results/i)
    );
    expect(showing.length).toBeGreaterThan(0);

    // Result cards
    expect(screen.getByText("Classic Beanie")).toBeInTheDocument();
    expect(screen.getByText("Chunky Rib Hat")).toBeInTheDocument();

    expect(screen.queryByText("Nordic Yoke")).not.toBeInTheDocument();
  });

  it("filters by category 'Sweater' (3 results)", async () => {
    render(<PatternsPage />);

    const sweater = screen.getAllByLabelText("Sweater")[0] as HTMLInputElement;
    fireEvent.click(sweater);

    const showing = await screen.findAllByText(
      hasTextContent(/Showing\s+3\s+results/i)
    );
    expect(showing.length).toBeGreaterThan(0);

    expect(screen.getByText("Nordic Yoke")).toBeInTheDocument();
    expect(screen.getByText("Textured Pullover")).toBeInTheDocument();
    expect(screen.getByText("Stripes Jumper")).toBeInTheDocument();
  });

  it("clears category filters back to 12 results", async () => {
    render(<PatternsPage />);

    const sweater = screen.getAllByLabelText("Sweater")[0] as HTMLInputElement;
    fireEvent.click(sweater);

    await screen.findAllByText(
      hasTextContent(/Showing\s+3\s+results/i)
    );

    const clearBtn = screen.getAllByText("Clear filters")[0] as HTMLButtonElement;
    fireEvent.click(clearBtn);

    await screen.findByText("Nordic Yoke");
    const showing12 = await screen.findAllByText(
      hasTextContent(/Showing\s+12\s+results/i)
    );
    expect(showing12.length).toBeGreaterThan(0);
  });

  it("performs an API search via handleSearch and replaces results", async () => {
    // Mock fetch to return a single shawl pattern
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        results: [
          {
            id: "999",
            name: "Lace Triangle Shawl",
            image: "/shawl.png",
            designer: "Lace Designer",
            yarn_weight: { name: "Fingering" },
            pattern_categories: [{ name: "Shawl" }],
          },
        ],
      }),
    });

    render(<PatternsPage />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "shawl" } });

    const runBtn = screen.getByTestId("search-run");
    fireEvent.click(runBtn);

    expect(
      screen.getByText((content) => /Searching/i.test(content))
    ).toBeInTheDocument();

    await screen.findByText("Lace Triangle Shawl");
    expect(screen.getByText("Lace Triangle Shawl")).toBeInTheDocument();
    expect(screen.getByText("Lace Designer")).toBeInTheDocument();

    // Check that original mock-only pattern is no longer in the filtered list
    expect(screen.queryByText("Nordic Yoke")).not.toBeInTheDocument();

    const showing1 = await screen.findAllByText(
      hasTextContent(/Showing\s+1\s+result/i)
    );
    expect(showing1.length).toBeGreaterThan(0);

    // Ensure fetch was called with the expected query param
    expect((global as any).fetch).toHaveBeenCalledTimes(1);
    const callUrl = (global as any).fetch.mock.calls[0][0] as string;
    expect(callUrl).toContain("/api/patterns?");
    expect(callUrl).toContain("q=shawl");
  });

  it("shows an error banner when the API search fails and results are empty", async () => {
    // Mock fetch to return a non-OK response
    (global as any).fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    render(<PatternsPage />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "errorcase" } });

    const runBtn = screen.getByTestId("search-run");
    fireEvent.click(runBtn);

    await screen.findByText(/Search failed \(500\)/i);
    expect(screen.getByText("No patterns found")).toBeInTheDocument();

    const showing0 = await screen.findAllByText(
      hasTextContent(/Showing\s+0\s+results\s+for\s+“errorcase”/i)
    );
    expect(showing0.length).toBeGreaterThan(0);

    expect(screen.queryByText("Nordic Yoke")).not.toBeInTheDocument();
  });
});
