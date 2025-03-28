import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Dock } from "./components/dock"

/**
 * Main layout wrapper for the authenticated app pages.
 *
 * Includes:
 * - A sidebar (`AppSidebar`) managed by `SidebarProvider`
 * - A header with breadcrumb navigation
 * - An inset section that renders the main `children` content
 * - Optional `Dock` (currently commented out) for mobile/floating nav
 *
 * @param children - The page content to render inside the layout
 * @returns The complete app layout with sidebar and header
 */

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 bg-muted shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="bg-muted w-full h-full">
          {children}

          {/* <Dock /> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
