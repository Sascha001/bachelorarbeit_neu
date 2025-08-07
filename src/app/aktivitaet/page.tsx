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

export default function AktivitaetPage() {
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
                    Aktivitäts Feed
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Trading Feed</BreadcrumbPage>
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
              Aktivitäts Feed
            </h2>
            <p className="text-muted-foreground text-lg">Übersicht aller Trading-Aktivitäten und Ereignisse</p>
          </div>
          
          <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border-l-4 border-green-500">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">K</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Kauf ausgeführt</span>
                    <span className="text-xs bg-green-500/20 text-green-700 px-2 py-1 rounded-full">+50 AAPL</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Apple Inc. @ $178.32 - Portfolio-Anteil: +2.3%</p>
                  <span className="text-xs text-muted-foreground">vor 15 Minuten</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border-l-4 border-red-500">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">V</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Verkauf ausgeführt</span>
                    <span className="text-xs bg-red-500/20 text-red-700 px-2 py-1 rounded-full">-25 MSFT</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Microsoft Corp. @ $415.26 - Gewinn: €1,240</p>
                  <span className="text-xs text-muted-foreground">vor 1 Stunde</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg border-l-4 border-yellow-500">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">!</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Risiko-Alert</span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-700 px-2 py-1 rounded-full">HOCH</span>
                  </div>
                  <p className="text-sm text-muted-foreground">TSLA Position überschreitet 15% Portfolio-Limit</p>
                  <span className="text-xs text-muted-foreground">vor 2 Stunden</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border-l-4 border-blue-500">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">AI</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">KI-Empfehlung</span>
                    <span className="text-xs bg-blue-500/20 text-blue-700 px-2 py-1 rounded-full">KAUFEN</span>
                  </div>
                  <p className="text-sm text-muted-foreground">NVDA - Starke Quartalszahlen erwartet, Konfidenz: 87%</p>
                  <span className="text-xs text-muted-foreground">vor 3 Stunden</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border-l-4 border-purple-500">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">📊</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Markt-Update</span>
                    <span className="text-xs bg-purple-500/20 text-purple-700 px-2 py-1 rounded-full">INFO</span>
                  </div>
                  <p className="text-sm text-muted-foreground">S&P 500 erreicht neues Allzeithoch (+0.8%)</p>
                  <span className="text-xs text-muted-foreground">vor 4 Stunden</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}