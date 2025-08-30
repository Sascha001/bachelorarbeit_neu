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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Euro,
  BarChart3,
  MessageSquare,
  Star,
  Filter,
  Search
} from "lucide-react"
import { useState } from "react"
import { useCoolScrollbar } from "@/hooks/use-cool-scrollbar"

// Mock validation data
const mockValidations = [
  {
    id: "1",
    stock: "AAPL",
    purchaseDate: "2024-01-15",
    purchasePrice: 185.64,
    currentPrice: 178.32,
    amount: 2500,
    shares: 13,
    recommendation: "BUY",
    aiConfidence: 92,
    status: "pending", // pending, validated, expired
    daysRemaining: 3,
    actualReturn: -3.94,
    predictedReturn: 8.5,
    feedback: null
  },
  {
    id: "2", 
    stock: "MSFT",
    purchaseDate: "2024-01-10",
    purchasePrice: 395.21,
    currentPrice: 408.90,
    amount: 1800,
    shares: 4,
    recommendation: "HOLD",
    aiConfidence: 88,
    status: "pending",
    daysRemaining: 8,
    actualReturn: 3.46,
    predictedReturn: 6.2,
    feedback: null
  },
  {
    id: "3",
    stock: "TSLA", 
    purchaseDate: "2024-01-05",
    purchasePrice: 248.42,
    currentPrice: 242.68,
    amount: 1200,
    shares: 4,
    recommendation: "SELL",
    aiConfidence: 78,
    status: "validated",
    daysRemaining: 0,
    actualReturn: -2.31,
    predictedReturn: -2.8,
    feedback: {
      rating: 4,
      text: "Die Empfehlung war ziemlich genau, hätte aber früher verkaufen sollen."
    }
  },
  {
    id: "4",
    stock: "NVDA",
    purchaseDate: "2023-12-28",
    purchasePrice: 495.22,
    currentPrice: 459.12,
    amount: 3200,
    shares: 6,
    recommendation: "BUY",
    aiConfidence: 65,
    status: "expired",
    daysRemaining: -5,
    actualReturn: -7.29,
    predictedReturn: 12.8,
    feedback: {
      rating: 2,
      text: "Die KI war viel zu optimistisch. Marktvolatilität wurde unterschätzt."
    }
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "validated": return "bg-green-500/10 text-green-600 border-green-500/20"
    case "expired": return "bg-red-500/10 text-red-600 border-red-500/20"
    default: return "bg-gray-500/10 text-gray-600 border-gray-500/20"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending": return <Clock className="h-4 w-4" />
    case "validated": return <CheckCircle className="h-4 w-4" />
    case "expired": return <XCircle className="h-4 w-4" />
    default: return <AlertTriangle className="h-4 w-4" />
  }
}

const getReturnColor = (returnValue: number) => {
  if (returnValue > 0) return "text-green-600"
  if (returnValue < -5) return "text-red-600"
  return "text-yellow-600"
}

export default function ValidierungPage() {
  const scrollbarRef = useCoolScrollbar()
  const [filter, setFilter] = useState("all") // all, pending, validated, expired
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedValidation, setSelectedValidation] = useState<string | null>(null)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")

  const filteredValidations = mockValidations.filter(validation => {
    const matchesFilter = filter === "all" || validation.status === filter
    const matchesSearch = validation.stock.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const submitFeedback = (validationId: string) => {
    console.log("Feedback submitted for:", validationId, { rating: feedbackRating, text: feedbackText })
    setSelectedValidation(null)
    setFeedbackRating(0)
    setFeedbackText("")
  }

  const stats = {
    total: mockValidations.length,
    pending: mockValidations.filter(v => v.status === "pending").length,
    validated: mockValidations.filter(v => v.status === "validated").length,
    expired: mockValidations.filter(v => v.status === "expired").length,
    avgAccuracy: 73.2,
    totalValue: mockValidations.reduce((sum, v) => sum + v.amount, 0)
  }

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
                  <BreadcrumbPage>Validierung</BreadcrumbPage>
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
        
        <div ref={scrollbarRef} className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-0 overflow-auto">
          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="violet-bloom-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Gesamt Trades</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                  </div>
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="violet-bloom-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ausstehend</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
                  </div>
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="violet-bloom-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">KI-Genauigkeit</p>
                    <p className="text-2xl font-bold text-green-600">{stats.avgAccuracy}%</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="violet-bloom-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Gesamtwert</p>
                    <p className="text-2xl font-bold">€{stats.totalValue.toLocaleString()}</p>
                  </div>
                  <Euro className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter and Search */}
          <Card className="violet-bloom-card">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Label>Filter:</Label>
                  <div className="flex gap-2">
                    {[
                      { key: "all", label: "Alle" },
                      { key: "pending", label: "Ausstehend" },
                      { key: "validated", label: "Validiert" },
                      { key: "expired", label: "Abgelaufen" }
                    ].map((filterOption) => (
                      <Button
                        key={filterOption.key}
                        variant={filter === filterOption.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(filterOption.key)}
                      >
                        {filterOption.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Nach Wertpapier suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation List */}
          <div className="space-y-4">
            {filteredValidations.map((validation) => (
              <Card key={validation.id} className="violet-bloom-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-bold">{validation.stock}</div>
                      <Badge className={getStatusColor(validation.status)} variant="outline">
                        {getStatusIcon(validation.status)}
                        <span className="ml-1">
                          {validation.status === "pending" && "Ausstehend"}
                          {validation.status === "validated" && "Validiert"}
                          {validation.status === "expired" && "Abgelaufen"}
                        </span>
                      </Badge>
                      {validation.status === "pending" && (
                        <Badge variant="secondary">
                          <Calendar className="h-3 w-3 mr-1" />
                          {validation.daysRemaining} Tage verbleibend
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">KI-Konfidenz</div>
                      <div className="font-bold">{validation.aiConfidence}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Kaufdatum</Label>
                      <div className="font-medium">{validation.purchaseDate}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Kaufpreis</Label>
                      <div className="font-medium">€{validation.purchasePrice}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Aktueller Preis</Label>
                      <div className="font-medium">€{validation.currentPrice}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Investition</Label>
                      <div className="font-medium">€{validation.amount} ({validation.shares} Aktien)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tatsächliche Rendite:</span>
                        <span className={`font-semibold ${getReturnColor(validation.actualReturn)}`}>
                          {validation.actualReturn > 0 ? '+' : ''}{validation.actualReturn.toFixed(2)}%
                          {validation.actualReturn > 0 ? (
                            <TrendingUp className="h-3 w-3 inline ml-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 inline ml-1" />
                          )}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(Math.abs(validation.actualReturn) * 5, 100)} 
                        className="h-2" 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>KI-Prognose:</span>
                        <span className={`font-semibold ${getReturnColor(validation.predictedReturn)}`}>
                          {validation.predictedReturn > 0 ? '+' : ''}{validation.predictedReturn.toFixed(2)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(Math.abs(validation.predictedReturn) * 5, 100)} 
                        className="h-2" 
                      />
                    </div>
                  </div>

                  {/* Accuracy Indicator */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Prognose-Genauigkeit:</span>
                      <span className="font-semibold">
                        {Math.max(0, 100 - Math.abs(validation.actualReturn - validation.predictedReturn) * 10).toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.max(0, 100 - Math.abs(validation.actualReturn - validation.predictedReturn) * 10)} 
                      className="h-2" 
                    />
                  </div>

                  {/* Feedback Section */}
                  {validation.status === "pending" && validation.daysRemaining <= 7 && (
                    <div className="border border-blue-500/20 bg-blue-500/5 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-600 mb-2">
                        Validierung bald verfügbar - Bereiten Sie Ihr Feedback vor
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => setSelectedValidation(validation.id)}
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Feedback vorbereiten
                      </Button>
                    </div>
                  )}

                  {validation.status === "validated" && !validation.feedback && (
                    <div className="border border-green-500/20 bg-green-500/5 p-3 rounded-lg">
                      <p className="text-sm font-medium text-green-600 mb-2">
                        Validierung abgeschlossen - Bitte bewerten Sie diese Empfehlung
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => setSelectedValidation(validation.id)}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Jetzt bewerten
                      </Button>
                    </div>
                  )}

                  {validation.feedback && (
                    <div className="border border-muted bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Ihr Feedback:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`h-3 w-3 ${star <= validation.feedback!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{validation.feedback.text}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feedback Modal Simulation */}
          {selectedValidation && (
            <Card className="fixed inset-4 z-50 bg-background border shadow-lg overflow-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Bewertung für {mockValidations.find(v => v.id === selectedValidation)?.stock}
                </CardTitle>
                <CardDescription>
                  Helfen Sie uns, unsere KI-Empfehlungen zu verbessern
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Wie bewerten Sie diese Empfehlung?</Label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className="p-1"
                      >
                        <Star 
                          className={`h-6 w-6 ${star <= feedbackRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="feedback-text">Zusätzliche Kommentare</Label>
                  <Textarea
                    id="feedback-text"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Was war hilfreich? Was könnte verbessert werden?"
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setSelectedValidation(null)}>
                    Abbrechen
                  </Button>
                  <Button 
                    onClick={() => submitFeedback(selectedValidation)}
                    disabled={feedbackRating === 0}
                  >
                    Feedback senden
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}