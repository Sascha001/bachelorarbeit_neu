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
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { useCoolScrollbar } from "@/hooks/use-cool-scrollbar"

// Dummy data that matches the dashboard numbers
const portfolioData = {
  total: 127432.52,
  change: 3.34,
  positions: 18,
  largestPosition: 12,
  largestPositionValue: 15297.80,
  diversification: "Gut"
}

const allocationData = [
  { name: "Einzelaktien", value: 50973, percentage: 40, color: "#3B82F6", positions: 5 },
  { name: "ETFs", value: 44601.38, percentage: 35, color: "#10B981", positions: 4 },
  { name: "Anleihen", value: 19114.88, percentage: 15, color: "#8B5CF6", positions: 3 },
  { name: "Rohstoffe", value: 8920.28, percentage: 7, color: "#F59E0B", positions: 2 },
  { name: "Cash & Geldmarkt", value: 3822.98, percentage: 3, color: "#6B7280", positions: 4 }
]

const performanceData = {
  "3M": [
    { category: "Einzelaktien", performance: 8.4, period: "3 Monate" },
    { category: "ETFs", performance: 5.2, period: "3 Monate" },
    { category: "Anleihen", performance: -1.8, period: "3 Monate" },
    { category: "Rohstoffe", performance: 12.1, period: "3 Monate" },
    { category: "Cash", performance: 0.3, period: "3 Monate" }
  ],
  "6M": [
    { category: "Einzelaktien", performance: 12.8, period: "6 Monate" },
    { category: "ETFs", performance: 8.7, period: "6 Monate" },
    { category: "Anleihen", performance: -0.5, period: "6 Monate" },
    { category: "Rohstoffe", performance: 15.3, period: "6 Monate" },
    { category: "Cash", performance: 0.8, period: "6 Monate" }
  ],
  "9M": [
    { category: "Einzelaktien", performance: 18.2, period: "9 Monate" },
    { category: "ETFs", performance: 11.4, period: "9 Monate" },
    { category: "Anleihen", performance: 1.2, period: "9 Monate" },
    { category: "Rohstoffe", performance: 22.7, period: "9 Monate" },
    { category: "Cash", performance: 1.1, period: "9 Monate" }
  ],
  "1Jahr": [
    { category: "Einzelaktien", performance: 24.5, period: "1 Jahr" },
    { category: "ETFs", performance: 16.8, period: "1 Jahr" },
    { category: "Anleihen", performance: 3.4, period: "1 Jahr" },
    { category: "Rohstoffe", performance: 28.9, period: "1 Jahr" },
    { category: "Cash", performance: 1.5, period: "1 Jahr" }
  ],
  "3Jahre": [
    { category: "Einzelaktien", performance: 42.1, period: "3 Jahre" },
    { category: "ETFs", performance: 28.6, period: "3 Jahre" },
    { category: "Anleihen", performance: 8.7, period: "3 Jahre" },
    { category: "Rohstoffe", performance: 35.2, period: "3 Jahre" },
    { category: "Cash", performance: 4.8, period: "3 Jahre" }
  ],
  "5Jahre": [
    { category: "Einzelaktien", performance: 68.9, period: "5 Jahre" },
    { category: "ETFs", performance: 45.3, period: "5 Jahre" },
    { category: "Anleihen", performance: 12.1, period: "5 Jahre" },
    { category: "Rohstoffe", performance: 48.7, period: "5 Jahre" },
    { category: "Cash", performance: 8.2, period: "5 Jahre" }
  ],
  "Gesamtzeit": [
    { category: "Einzelaktien", performance: 89.4, period: "Gesamtzeit" },
    { category: "ETFs", performance: 62.7, period: "Gesamtzeit" },
    { category: "Anleihen", performance: 18.9, period: "Gesamtzeit" },
    { category: "Rohstoffe", performance: 71.2, period: "Gesamtzeit" },
    { category: "Cash", performance: 12.4, period: "Gesamtzeit" }
  ]
}

const detailedPositions = {
  "Einzelaktien": [
    { name: "Apple Inc.", symbol: "AAPL", value: 12450.80, percentage: 9.8 },
    { name: "Microsoft Corp.", symbol: "MSFT", value: 11200.45, percentage: 8.8 },
    { name: "NVIDIA Corp.", symbol: "NVDA", value: 9850.30, percentage: 7.7 },
    { name: "Amazon.com Inc.", symbol: "AMZN", value: 8920.15, percentage: 7.0 },
    { name: "Tesla Inc.", symbol: "TSLA", value: 8551.30, percentage: 6.7 }
  ],
  "ETFs": [
    { name: "SPDR S&P 500 ETF", symbol: "SPY", value: 15200.45, percentage: 11.9 },
    { name: "iShares MSCI World", symbol: "IWDA", value: 12400.80, percentage: 9.7 },
    { name: "Vanguard FTSE All-World", symbol: "VWCE", value: 10800.65, percentage: 8.5 },
    { name: "iShares Core MSCI EM IMI", symbol: "EIMI", value: 6199.48, percentage: 4.9 }
  ],
  "Anleihen": [
    { name: "iShares Core Global Aggregate Bond", symbol: "AGGU", value: 8450.30, percentage: 6.6 },
    { name: "Vanguard Global Bond Index", symbol: "VGBL", value: 6200.80, percentage: 4.9 },
    { name: "iShares Euro Government Bond", symbol: "IBGS", value: 4463.78, percentage: 3.5 }
  ],
  "Rohstoffe": [
    { name: "SPDR Gold Shares", symbol: "GLD", value: 5420.15, percentage: 4.3 },
    { name: "iShares Silver Trust", symbol: "SLV", value: 3500.13, percentage: 2.7 }
  ],
  "Cash & Geldmarkt": [
    { name: "Tagesgeld Deutsche Bank", symbol: "CASH-DB", value: 1500.00, percentage: 1.2 },
    { name: "Festgeld Commerzbank", symbol: "FG-COM", value: 1200.00, percentage: 0.9 },
    { name: "Geldmarktfonds", symbol: "MMF-1", value: 622.98, percentage: 0.5 },
    { name: "Girokonto Liquidität", symbol: "CASH", value: 500.00, percentage: 0.4 }
  ]
}

export default function DepotPage() {
  const scrollbarRef = useCoolScrollbar()
  const [selectedPeriod, setSelectedPeriod] = useState("3M")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null)

  const periods = ["3M", "6M", "9M", "1Jahr", "3Jahre", "5Jahre", "Gesamtzeit"]

  // Calculate pie chart path for each slice
  const createPieSlice = (startAngle: number, endAngle: number, radius: number = 80, innerRadius: number = 35) => {
    const start = polarToCartesian(0, 0, radius, endAngle)
    const end = polarToCartesian(0, 0, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"
    
    const innerStart = polarToCartesian(0, 0, innerRadius, endAngle)
    const innerEnd = polarToCartesian(0, 0, innerRadius, startAngle)
    
    const d = [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", innerEnd.x, innerEnd.y,
      "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      "Z"
    ].join(" ")
    
    return d
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    }
  }

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
          
          <div className="flex items-center gap-2">
            <NotificationButton />
            <ThemeToggle />
          </div>
        </header>
        <div ref={scrollbarRef} className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-auto violet-bloom-scrollbar">
          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Gesamtes Portfolio */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gesamtes Portfolio</p>
                <p className="text-2xl font-bold text-foreground" suppressHydrationWarning>€{portfolioData.total.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                    ↗ +{portfolioData.change}% heute
                  </span>
                </div>
                <p className="text-xs text-muted-foreground" suppressHydrationWarning>+€{((portfolioData.total * portfolioData.change) / 100).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} heute</p>
              </div>
            </div>

            {/* Anzahl Positionen */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Anzahl Positionen</p>
                <p className="text-2xl font-bold text-foreground">{portfolioData.positions}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">5 Kategorien</span>
                </div>
                <p className="text-xs text-muted-foreground">Diversifiziert angelegt</p>
              </div>
            </div>

            {/* Größte Position */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Größte Position</p>
                <p className="text-2xl font-bold text-foreground">{portfolioData.largestPosition}%</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded-full">
                    €{portfolioData.largestPositionValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground" suppressHydrationWarning>AAPL (€{portfolioData.largestPositionValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</p>
              </div>
            </div>

            {/* Diversifikation */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Diversifikation</p>
                <p className="text-2xl font-bold text-foreground">{portfolioData.diversification}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">✓ Ausgewogen</span>
                </div>
                <p className="text-xs text-muted-foreground">Ausgewogene Allokation</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
            {/* Vermögensallokation */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Vermögensallokation</h3>
                  <p className="text-xs text-muted-foreground">Verteilung nach Anlageklassen</p>
                </div>
                
                <div className="flex justify-center">
                  <svg width="180" height="180" viewBox="-90 -90 180 180">
                    {(() => {
                      let currentAngle = 0
                      return allocationData.map((item) => {
                        const sliceAngle = (item.percentage / 100) * 360
                        const path = createPieSlice(currentAngle, currentAngle + sliceAngle)
                        const slice = (
                          <path
                            key={item.name}
                            d={path}
                            fill={item.color}
                            stroke="white"
                            strokeWidth="2"
                            className="transition-all duration-300 cursor-pointer"
                            style={{
                              opacity: hoveredSlice === null || hoveredSlice === item.name ? 1 : 0.6,
                              transform: hoveredSlice === item.name ? 'scale(1.05)' : 'scale(1)',
                              transformOrigin: '0 0'
                            }}
                            onMouseEnter={() => setHoveredSlice(item.name)}
                            onMouseLeave={() => setHoveredSlice(null)}
                          />
                        )
                        currentAngle += sliceAngle
                        return slice
                      })
                    })()}
                  </svg>
                </div>

                {/* Legend */}
                <div className="space-y-1">
                  {allocationData.map((item) => (
                    <div
                      key={item.name}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        hoveredSlice === item.name ? 'bg-primary/10' : 'hover:bg-muted/50'
                      }`}
                      onMouseEnter={() => setHoveredSlice(item.name)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-xs font-medium flex-1">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kategorien Details */}
            <div className="lg:col-span-2 bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card min-h-0">
              <div className="space-y-3 h-full flex flex-col">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-1">Kategorien Details</h3>
                  <p className="text-xs text-muted-foreground">Aufschlüsselung nach Anlageklassen</p>
                </div>
                
                <div className="flex-1 overflow-auto space-y-2">
                  {allocationData.map((category) => (
                    <div key={category.name} className="border border-border/50 rounded-lg">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <span className="font-medium">{category.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {category.positions} Positionen anzeigen
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold" suppressHydrationWarning>€{category.value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                          {expandedCategory === category.name ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>
                      
                      {expandedCategory === category.name && (
                        <div className="px-3 pb-3">
                          <div className="space-y-1 pl-6 border-l-2 border-primary/20">
                            {detailedPositions[category.name as keyof typeof detailedPositions]?.map((position) => (
                              <div key={position.symbol} className="flex items-center justify-between py-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{position.name}</span>
                                  <span className="text-xs text-muted-foreground">({position.symbol})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-mono" suppressHydrationWarning>€{position.value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                  <span className="text-xs text-muted-foreground">{position.percentage}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-4 violet-bloom-card">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">Performance Übersicht</h3>
                <p className="text-xs text-muted-foreground">Entwicklung der einzelnen Kategorien über verschiedene Zeiträume</p>
              </div>

              {/* Time Period Selector */}
              <div className="flex gap-2 overflow-x-auto">
                {periods.map((period) => (
                  <Button
                    key={period}
                    variant={selectedPeriod === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPeriod(period)}
                    className={selectedPeriod === period ? "violet-bloom-button" : ""}
                  >
                    {period}
                  </Button>
                ))}
              </div>

              {/* Performance Data */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {performanceData[selectedPeriod as keyof typeof performanceData].map((item) => (
                  <div key={item.category} className="text-center">
                    <p className="text-sm font-medium mb-1">{item.category}</p>
                    <p className={`text-xl font-bold ${
                      item.performance >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.performance >= 0 ? '+' : ''}{item.performance}%
                    </p>
                    <p className="text-xs text-muted-foreground">{item.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}