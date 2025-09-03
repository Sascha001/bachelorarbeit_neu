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
import { Search } from "lucide-react"
import { useCoolScrollbar } from "@/hooks/use-cool-scrollbar"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { UncertaintyOverview } from "@/components/uncertainty-overview"
import { TechnicalAnalysisTab } from "@/components/technical-analysis-tab"
import { SimplifiedAnalysisTab } from "@/components/simplified-analysis-tab"
import { PurchaseRecommendation } from "@/components/purchase-recommendation"

// Inner component that uses search params
function UnsicherheitsAnalyseContent() {
  const scrollbarRef = useCoolScrollbar()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedStock, setSelectedStock] = useState<string | null>(null)
  
  // Initialize from URL parameter
  useEffect(() => {
    const stockParam = searchParams.get('stock')
    setSelectedStock(stockParam)
  }, [searchParams])
  
  // Handle stock selection from search
  const handleStockSelect = (stock: string) => {
    setSelectedStock(stock)
    // Update URL with stock parameter
    const newUrl = `/statistik/unsicherheits-analyse?stock=${encodeURIComponent(stock)}`
    router.push(newUrl)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="fixed-header flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
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
            {selectedStock && (
              <StockSearch onStockSelect={handleStockSelect} />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <NotificationButton />
            <ThemeToggle />
          </div>
        </header>
        <div ref={scrollbarRef} className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-auto violet-bloom-scrollbar">
          {!selectedStock ? (
            <div className="flex flex-1 items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-2xl px-4">
                {/* Icon and Title */}
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 rounded-full blur-xl"></div>
                    <Search className="relative h-16 w-16 text-primary mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">Unsicherheitsanalyse</h1>
                    <p className="text-lg text-muted-foreground">
                      Wählen Sie ein Wertpapier für eine detaillierte KI-Unsicherheitsanalyse
                    </p>
                  </div>
                </div>
                
                {/* Centered Search Bar */}
                <div className="w-full max-w-lg">
                  <StockSearch onStockSelect={handleStockSelect} />
                </div>
                
                {/* Additional Info */}
                <div className="text-center space-y-3 max-w-md">
                  <p className="text-sm text-muted-foreground">
                    Analysieren Sie Daten-, Modell- und menschliche Unsicherheitsfaktoren
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      Datenunsicherheit
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                      Modellunsicherheit
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      Menschliche Faktoren
                    </span>
                  </div>
                </div>
              </div>
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

// Main page component with Suspense boundary
export default function UnsicherheitsAnalysePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Lade Unsicherheitsanalyse...</p>
        </div>
      </div>
    }>
      <UnsicherheitsAnalyseContent />
    </Suspense>
  )
}