import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { StockSearch } from "@/components/stock-search"
import { ThemeToggle } from "@/components/theme-toggle"

export default function UeberpruefungPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="fixed-header flex h-16 shrink-0 items-center gap-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/50 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 violet-bloom-hover rounded-md p-2" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Überprüfung
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Modell</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex-1 flex justify-center">
            <StockSearch />
          </div>
          
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col justify-center items-center p-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-6">Überprüfung</h2>
            <p className="text-muted-foreground text-xl">Validierung von Modell, Daten und menschlicher Expertise</p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}