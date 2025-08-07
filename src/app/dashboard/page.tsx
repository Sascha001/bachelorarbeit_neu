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

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4 relative">
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
                    Dashboard
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
        <div className="flex-1 flex flex-col gap-4 p-4 pt-6 max-h-[calc(100vh-4rem)] overflow-hidden">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Dashboard Übersicht
            </h2>
            <p className="text-muted-foreground text-lg mt-2">Zentrale Kontrolle Ihrer Trading-Aktivitäten</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-primary mb-2">Portfolio Wert</h3>
              <div className="text-2xl font-bold text-foreground mb-1">€127,450</div>
              <div className="text-sm text-green-600">+2.3% heute</div>
              <div className="w-full h-2 bg-primary/20 rounded-full mt-3">
                <div className="w-3/4 h-full bg-primary rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card to-green-500/5 border border-green-500/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-green-600 mb-2">Gewinn/Verlust</h3>
              <div className="text-2xl font-bold text-green-600 mb-1">+€8,240</div>
              <div className="text-sm text-green-600">+6.9% diesen Monat</div>
              <div className="w-full h-2 bg-green-500/20 rounded-full mt-3">
                <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-card via-card to-blue-500/5 border border-blue-500/20 rounded-xl p-4 violet-bloom-card">
              <h3 className="font-semibold text-blue-600 mb-2">Aktive Positionen</h3>
              <div className="text-2xl font-bold text-blue-600 mb-1">23</div>
              <div className="text-sm text-blue-600">8 Sektoren</div>
              <div className="w-full h-2 bg-blue-500/20 rounded-full mt-3">
                <div className="w-3/5 h-full bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 flex-1 violet-bloom-card overflow-hidden">
            <h3 className="font-semibold text-foreground mb-3">Schnellzugriff</h3>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              <a href="/depot" className="p-3 bg-primary/10 rounded-lg text-center hover:bg-primary/20 transition-colors">
                <div className="text-sm font-medium">Depot</div>
              </a>
              <a href="/statistik" className="p-3 bg-primary/10 rounded-lg text-center hover:bg-primary/20 transition-colors">
                <div className="text-sm font-medium">Statistik</div>
              </a>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
