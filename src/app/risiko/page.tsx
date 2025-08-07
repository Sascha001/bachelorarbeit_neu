import { AppSidebar } from "@/components/app-sidebar"
import { StockSearch } from "@/components/stock-search"
import { ThemeToggle } from "@/components/theme-toggle"
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

export default function RisikoPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 relative border-b border-border/50">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Risiko Management
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Übersicht</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <StockSearch />
          </div>
          
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
              Risiko Management
            </h2>
            <p className="text-muted-foreground text-lg">Überwachung und Kontrolle von Handelsrisiken</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-card via-card to-red-500/5 border border-red-500/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-red-600 mb-2">Aktuelles Risiko</h3>
              <div className="text-2xl font-bold text-red-600 mb-1">Hoch</div>
              <div className="w-full h-2 bg-red-500/20 rounded-full">
                <div className="w-4/5 h-full bg-red-500 rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Portfolio-Volatilität: 23%</p>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card to-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-yellow-600 mb-2">Value at Risk</h3>
              <div className="text-2xl font-bold text-yellow-600 mb-1">€12,450</div>
              <div className="w-full h-2 bg-yellow-500/20 rounded-full">
                <div className="w-3/5 h-full bg-yellow-500 rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">95% Konfidenz, 1 Tag</p>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card to-green-500/5 border border-green-500/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-green-600 mb-2">Diversifikation</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">Gut</div>
              <div className="w-full h-2 bg-green-500/20 rounded-full">
                <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">8 Sektoren, 23 Positionen</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
            <h3 className="font-semibold text-foreground mb-3">Risiko-Alerts</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-red-500/10 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">TSLA Position überschreitet 15% Portfolio-Limit</span>
                <span className="text-xs text-muted-foreground ml-auto">vor 2h</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-yellow-500/10 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Korrelation zwischen Tech-Aktien steigt</span>
                <span className="text-xs text-muted-foreground ml-auto">vor 4h</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}