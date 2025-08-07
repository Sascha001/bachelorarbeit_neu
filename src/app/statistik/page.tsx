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

function StatistikContent() {
  const searchParams = useSearchParams()
  const stock = searchParams.get('stock')

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 pt-6 max-h-[calc(100vh-4rem)] overflow-hidden">
      {stock ? (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Unsicherheits Analyse - {stock}
            </h2>
            <p className="text-muted-foreground text-lg mt-2">Detaillierte Unsicherheitsanalyse für {stock}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl violet-bloom-card">
              <p className="text-sm text-muted-foreground mb-2">Modell-Konfidenz</p>
              <p className="text-2xl font-bold text-primary">85%</p>
              <div className="w-full h-2 bg-primary/20 rounded-full mt-2">
                <div className="w-4/5 h-full bg-primary rounded-full"></div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-card via-card to-yellow-500/5 border border-yellow-500/20 rounded-xl violet-bloom-card">
              <p className="text-sm text-muted-foreground mb-2">Daten-Qualität</p>
              <p className="text-2xl font-bold text-yellow-600">72%</p>
              <div className="w-full h-2 bg-yellow-500/20 rounded-full mt-2">
                <div className="w-3/4 h-full bg-yellow-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-card via-card to-red-500/5 border border-red-500/20 rounded-xl violet-bloom-card">
              <p className="text-sm text-muted-foreground mb-2">Risiko-Score</p>
              <p className="text-2xl font-bold text-red-600">Medium</p>
              <div className="w-full h-2 bg-red-500/20 rounded-full mt-2">
                <div className="w-1/2 h-full bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 flex-1 violet-bloom-card overflow-hidden">
            <h4 className="font-medium mb-3">Unsicherheitsfaktoren für {stock}:</h4>
            <div className="space-y-2 text-sm max-h-[200px] overflow-y-auto">
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>Marktvolatilität in der Technologiebranche</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>Begrenzte historische Daten für ähnliche Marktbedingungen</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Externe Faktoren (Regulierung, Makroökonomie)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Algorithmische Unsicherheit bei Extremereignissen</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">Trading Statistik</h2>
          <p className="text-muted-foreground text-lg">Analyse und Unsicherheitsmetriken</p>
          <p className="text-sm text-muted-foreground mt-4 max-w-md">Verwende die Suchleiste, um eine Unsicherheitsanalyse für ein bestimmtes Wertpapier zu erstellen.</p>
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
        <header className="flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/50 px-4 relative">
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