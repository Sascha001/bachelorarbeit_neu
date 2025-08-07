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

export default function DepotPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/50 px-4">
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
                    Depot
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Übersicht & Performance</BreadcrumbPage>
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
        <div className="flex-1 flex flex-col gap-4 p-4 pt-6 max-h-[calc(100vh-4rem)] overflow-hidden">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Depot Übersicht</h2>
            <p className="text-muted-foreground text-lg mt-2">Portfolio Performance und Positionen</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-foreground mb-3">Top Holdings</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="font-mono text-sm">AAPL</span>
                  <span className="text-sm font-medium">€45,230</span>
                  <span className="text-xs text-green-600">+2.1%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="font-mono text-sm">MSFT</span>
                  <span className="text-sm font-medium">€32,120</span>
                  <span className="text-xs text-red-600">-0.8%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="font-mono text-sm">NVDA</span>
                  <span className="text-sm font-medium">€28,890</span>
                  <span className="text-xs text-green-600">+1.5%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-foreground mb-3">Performance Metriken</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gesamtwert</span>
                  <span className="font-semibold">€127,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tagesgewinn</span>
                  <span className="font-semibold text-green-600">+€2,940</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Diversifikation</span>
                  <span className="font-semibold">8 Sektoren</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                  <span className="font-semibold">1.24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}