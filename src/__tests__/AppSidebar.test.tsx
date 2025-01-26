import { render, screen } from "@testing-library/react";
import { AppSidebar } from "../../src/app/home/(components)/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

jest.mock("../../src/app/home/(components)/nav-user", () => ({
    NavUser: () => <div data-testid="nav-user">Mocked NavUser</div>,
}));

jest.mock("lucide-react", () => ({
  AudioWaveform: () => <div data-testid="icon-audio-waveform" />,
  Frame: () => <div data-testid="icon-frame" />,
  Map: () => <div data-testid="icon-map" />,
  Search: () => <div data-testid="icon-search" />,
  Volleyball: () => <div data-testid="icon-volleyball" />,
  Rss: () => <div data-testid="icon-rss" />,
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

describe("AppSidebar", () => {
  it("renders sidebar footer with user data", () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    );

    expect(screen.getByTestId("nav-user")).toBeInTheDocument();
    expect(screen.getByText("Knitted")).toBeInTheDocument();

    expect(screen.getByText("Feed")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Yarn")).toBeInTheDocument();
    expect(screen.getByText("Patterns")).toBeInTheDocument();
  });

  it("renders the sidebar header and footer", () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    );

    expect(screen.getByText("Knitted")).toBeInTheDocument();
    expect(screen.getByTestId("nav-user")).toBeInTheDocument();
  });

  it("renders all menu items correctly", () => {
    render(
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    );

    const menuItems = ["Feed", "Explore", "Search", "Yarn", "Patterns"];

    menuItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});