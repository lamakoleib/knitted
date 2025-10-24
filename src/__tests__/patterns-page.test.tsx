/**
 * @file PatternsPage tests
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// ---- Mocks for Next & UI bits ----
jest.mock("next/image", () => (props: any) => <img {...props} />);
jest.mock("next/link", () => ({ children, href }: any) => <a href={href}>{children}</a>);

// Minimal shadcn/ui mocks
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, className, ...rest }: any) => (
    <button className={className} onClick={onClick} data-testid="button" {...rest}>
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

// Mock SearchBar to provide an input (updates searchTerm) + a button to call handleSearch (no-op)
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

// Page under test
import PatternsPage from "@/app/home/patterns/page";

// Helper matcher for split text like: "Showing <span>12</span> results"
const hasTextContent =
  (expected: RegExp) =>
  (_: string, node: Element | null) =>
    !!node && expected.test(node?.textContent ?? "");

describe("PatternsPage /home/patterns", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with 12 mock patterns initially", async () => {
    render(<PatternsPage />);

    const showingEls = await screen.findAllByText(hasTextContent(/Showing\s+12\s+results/i));
    expect(showingEls.length).toBeGreaterThan(0);

    // spot-check a couple of mock cards
    expect(screen.getByText("Nordic Yoke")).toBeInTheDocument();
    expect(screen.getByText("Classic Beanie")).toBeInTheDocument();
  });

  it("filters by search term 'hat' and shows 2 results with weight counts updated", async () => {
    render(<PatternsPage />);

    const input = screen.getByTestId("search-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "hat" } });

    const showing = await screen.findAllByText(hasTextContent(/Showing\s+2\s+results/i));
    expect(showing.length).toBeGreaterThan(0);

    // Result cards
    expect(screen.getByText("Classic Beanie")).toBeInTheDocument();
    expect(screen.getByText("Chunky Rib Hat")).toBeInTheDocument();

    // Weight counts reflect search-only base (DK:1, Bulky:1)
    const dkCounts = screen.getAllByText(hasTextContent(/\bDK\s*\(1\)/));
    const bulkyCounts = screen.getAllByText(hasTextContent(/\bBulky\s*\(1\)/));
    expect(dkCounts.length).toBeGreaterThan(0);
    expect(bulkyCounts.length).toBeGreaterThan(0);
  });

  it("filters by category 'Sweater' (3 results)", async () => {
    render(<PatternsPage />);

    // Two panels (mobile/desktop). Click the first 'Sweater'.
    const sweater = screen.getAllByLabelText("Sweater")[0] as HTMLInputElement;
    fireEvent.click(sweater);

    const showing = await screen.findAllByText(hasTextContent(/Showing\s+3\s+results/i));
    expect(showing.length).toBeGreaterThan(0);

    expect(screen.getByText("Nordic Yoke")).toBeInTheDocument();
    expect(screen.getByText("Textured Pullover")).toBeInTheDocument();
    expect(screen.getByText("Stripes Jumper")).toBeInTheDocument();
  });

  it("filters by weight 'DK' (2 results), then clears filters back to 12", async () => {
    render(<PatternsPage />);

    // First panel's DK checkbox; label text is like "DK (2)", so use regex.
    const dk = screen.getAllByLabelText(/DK\b/i)[0] as HTMLInputElement;
    fireEvent.click(dk);

    // Wait for the two DK results to be visible
    await screen.findByText("Classic Beanie");
    await screen.findByText("Baby Cardi");
    // And ensure a non-DK item is not present while filtered
    expect(screen.queryByText("Nordic Yoke")).not.toBeInTheDocument();

    // Clear filters (desktop button)
    const clearBtn = screen.getAllByText("Clear filters")[0] as HTMLButtonElement;
    fireEvent.click(clearBtn);

    // Wait for list to restore; then check the count is back to 12
    await screen.findByText("Nordic Yoke");
    const showing12 = await screen.findAllByText(hasTextContent(/Showing\s+12\s+results/i));
    expect(showing12.length).toBeGreaterThan(0);
  });
});
