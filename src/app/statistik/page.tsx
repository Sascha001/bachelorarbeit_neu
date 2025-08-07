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
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      {stock ? (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">
              Unsicherheits Analyse - {stock}
            </h2>
            <p className="text-muted-foreground text-lg">Detaillierte Unsicherheitsanalyse für {stock}</p>
          </div>
          
          <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-6 violet-bloom-card">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">KI-Konfidenz Analyse</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Modell-Konfidenz</p>
                  <p className="text-2xl font-bold text-primary">85%</p>
                  <div className="w-full h-2 bg-primary/20 rounded-full mt-2">
                    <div className="w-4/5 h-full bg-primary rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Daten-Qualität</p>
                  <p className="text-2xl font-bold text-yellow-600">72%</p>
                  <div className="w-full h-2 bg-yellow-500/20 rounded-full mt-2">
                    <div className="w-3/4 h-full bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Risiko-Score</p>
                  <p className="text-2xl font-bold text-red-600">Medium</p>
                  <div className="w-full h-2 bg-red-500/20 rounded-full mt-2">
                    <div className="w-1/2 h-full bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 border border-border/50 rounded-lg">
                <h4 className="font-medium mb-2">Unsicherheitsfaktoren für {stock}:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
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
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-4">Trading Statistik</h2>
          <p className="text-muted-foreground text-lg">Analyse und Unsicherheitsmetriken</p>
          <p className="text-sm text-muted-foreground mt-4">Verwende die Suchleiste, um eine Unsicherheitsanalyse für ein bestimmtes Wertpapier zu erstellen.</p>
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
          
          <div className="flex-1 flex justify-center">
            <StockSearch />
          </div>
          
          <div className="flex items-center">
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