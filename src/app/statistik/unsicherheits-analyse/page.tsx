"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { StockSearch } from "@/components/stock-search"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationButton } from "@/components/notification-button"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { useCoolScrollbar } from "@/hooks/use-cool-scrollbar"
import { useState } from "react"
import { UncertaintyOverview } from "@/components/uncertainty-overview"
import { TechnicalAnalysisTab } from "@/components/technical-analysis-tab"
import { SimplifiedAnalysisTab } from "@/components/simplified-analysis-tab"
import { PurchaseRecommendation } from "@/components/purchase-recommendation"

export default function UnsicherheitsAnalysePage() {
  const scrollbarRef = useCoolScrollbar()
  const [selectedStock, setSelectedStock] = useState<string | null>("AAPL")

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/statistik">
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
            <StockSearch onStockSelect={setSelectedStock} />
          </div>
          
          <div className="flex items-center gap-2">
            <NotificationButton />
            <ThemeToggle />
          </div>
        </header>
        <div ref={scrollbarRef} className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-auto">
          {!selectedStock ? (
            <div className="flex flex-1 items-center justify-center">
              <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <AlertTriangle className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Wertpapier auswählen</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Verwenden Sie die Suchleiste oben, um ein Wertpapier für die Unsicherheitsanalyse auszuwählen.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Uncertainty Overview Cards */}
              <UncertaintyOverview selectedStock={selectedStock} />
              
              {/* Analysis Tabs */}
              <Card className="violet-bloom-card">
                <CardHeader>
                  <CardTitle>Detaillierte Unsicherheitsanalyse</CardTitle>
                  <CardDescription>
                    Verstehen Sie die Quellen der Unsicherheit in der KI-Empfehlung für {selectedStock}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="technical" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="technical">Technische Analyse</TabsTrigger>
                      <TabsTrigger value="simplified">Vereinfachte Ansicht</TabsTrigger>
                    </TabsList>
                    <TabsContent value="technical" className="space-y-4">
                      <TechnicalAnalysisTab selectedStock={selectedStock} />
                    </TabsContent>
                    <TabsContent value="simplified" className="space-y-4">
                      <SimplifiedAnalysisTab selectedStock={selectedStock} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Purchase Recommendation */}
              <PurchaseRecommendation selectedStock={selectedStock} />
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}