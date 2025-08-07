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
        <div className="flex-1 flex flex-col gap-4 p-4 pt-6 max-h-[calc(100vh-4rem)] overflow-hidden">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Überprüfung</h2>
            <p className="text-muted-foreground text-lg mt-2">Validierung von Modell, Daten und menschlicher Expertise</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-br from-card via-card to-blue-500/5 border border-blue-500/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-blue-600 mb-2">Modell-Validierung</h3>
              <div className="text-2xl font-bold text-blue-600 mb-1">92%</div>
              <div className="text-sm text-blue-600">Genauigkeit</div>
              <div className="w-full h-2 bg-blue-500/20 rounded-full mt-3">
                <div className="w-11/12 h-full bg-blue-500 rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Backtesting über 5 Jahre</p>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card to-green-500/5 border border-green-500/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-green-600 mb-2">Daten-Qualität</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">87%</div>
              <div className="text-sm text-green-600">Vollständigkeit</div>
              <div className="w-full h-2 bg-green-500/20 rounded-full mt-3">
                <div className="w-5/6 h-full bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Echtzeitdaten verfügbar</p>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card to-purple-500/5 border border-purple-500/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-purple-600 mb-2">Experten-Review</h3>
              <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
              <div className="text-sm text-purple-600">Zustimmung</div>
              <div className="w-full h-2 bg-purple-500/20 rounded-full mt-3">
                <div className="w-19/20 h-full bg-purple-500 rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">5 Senior Analysten</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 flex-1 violet-bloom-card overflow-hidden">
            <h3 className="font-semibold text-foreground mb-3">Validierungsprotokoll</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Modell-Backtesting abgeschlossen</span>
                <span className="text-xs text-muted-foreground ml-auto">heute</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Datenintegrität überprüft</span>
                <span className="text-xs text-muted-foreground ml-auto">gestern</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Experten-Review in Bearbeitung</span>
                <span className="text-xs text-muted-foreground ml-auto">laufend</span>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}