"use client"

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
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { useCoolScrollbar } from "@/hooks/use-cool-scrollbar"

function StatistikContent() {
  const searchParams = useSearchParams()
  const stock = searchParams.get('stock')
  const scrollbarRef = useCoolScrollbar()

  return (
    <div ref={scrollbarRef} className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-auto">
      {stock ? (
        <div className="space-y-4 h-full flex flex-col">
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
              Unsicherheits Analyse - {stock}
            </h2>
            <p className="text-muted-foreground text-base">Detaillierte Unsicherheitsanalyse für {stock}</p>
          </div>
          
          <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card flex-1 min-h-0">
            <div className="h-full flex flex-col">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-foreground">KI-Konfidenz Analyse</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Modell-Konfidenz</p>
                  <p className="text-xl font-bold text-primary">85%</p>
                  <div className="w-full h-1.5 bg-primary/20 rounded-full mt-1">
                    <div className="w-4/5 h-full bg-primary rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Daten-Qualität</p>
                  <p className="text-xl font-bold text-yellow-600">72%</p>
                  <div className="w-full h-1.5 bg-yellow-500/20 rounded-full mt-1">
                    <div className="w-3/4 h-full bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Risiko-Score</p>
                  <p className="text-xl font-bold text-red-600">Medium</p>
                  <div className="w-full h-1.5 bg-red-500/20 rounded-full mt-1">
                    <div className="w-1/2 h-full bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-3 border border-border/50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Unsicherheitsfaktoren für {stock}:</h4>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Marktvolatilität in der Technologiebranche</li>
                  <li>• Begrenzte historische Daten für ähnliche Marktbedingungen</li>
                  <li>• Externe Faktoren (Regulierung, Makroökonomie)</li>
                  <li>• Algorithmische Unsicherheit bei Extremereignissen</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center flex flex-col justify-center flex-1">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-6">Trading Statistik</h2>
          <p className="text-muted-foreground text-xl mb-4">Analyse und Unsicherheitsmetriken</p>
          <p className="text-base text-muted-foreground">Verwende die Suchleiste, um eine Unsicherheitsanalyse für ein bestimmtes Wertpapier zu erstellen.</p>
        </div>
      )}
    </div>
  )
}

export default function StatistikPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="fixed-header flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/50 px-4 relative">
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
                    Statistik
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Unsicherheits Analyse</BreadcrumbPage>
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
        <Suspense fallback={<div>Loading...</div>}>
          <StatistikContent />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}