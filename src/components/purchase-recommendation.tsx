"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Euro,
  Calculator,
  CheckCircle,
  MessageSquare,
  Star,
  ThumbsUp
} from "lucide-react"
import { useState } from "react"

interface PurchaseRecommendationProps {
  selectedStock: string
}

// Mock purchase data
interface PurchaseData {
  currentPrice: number;
  recommendation: string;
  recommendedAmount: number;
  minAmount: number;
  maxAmount: number;
  expectedReturn: number;
  timeHorizon: string;
  riskScore: number;
  portfolioImpact: {
    diversification: number;
    riskReduction: number;
    expectedContribution: number;
  };
}

const getPurchaseData = (stock: string): PurchaseData => {
  const mockData: Record<string, PurchaseData> = {
    AAPL: {
      currentPrice: 178.32,
      recommendation: "BUY",
      recommendedAmount: 2500,
      minAmount: 500,
      maxAmount: 10000,
      expectedReturn: 8.5,
      timeHorizon: "3-6 Monate",
      riskScore: 27,
      portfolioImpact: {
        diversification: 92,
        riskReduction: 15,
        expectedContribution: 12
      }
    },
    MSFT: {
      currentPrice: 408.90,
      recommendation: "HOLD", 
      recommendedAmount: 1800,
      minAmount: 400,
      maxAmount: 8000,
      expectedReturn: 6.2,
      timeHorizon: "6-12 Monate",
      riskScore: 55,
      portfolioImpact: {
        diversification: 88,
        riskReduction: 8,
        expectedContribution: 18
      }
    },
    TSLA: {
      currentPrice: 242.68,
      recommendation: "SELL",
      recommendedAmount: 0,
      minAmount: 200,
      maxAmount: 5000,
      expectedReturn: -2.8,
      timeHorizon: "1-3 Monate",
      riskScore: 89,
      portfolioImpact: {
        diversification: 65,
        riskReduction: -12,
        expectedContribution: -5
      }
    }
  }
  
  return mockData[stock] || mockData.AAPL
}

const getRecommendationColor = (rec: string) => {
  switch (rec) {
    case "BUY": return "bg-green-500/10 text-green-600 border-green-500/20"
    case "HOLD": return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "SELL": return "bg-red-500/10 text-red-600 border-red-500/20"
    default: return "bg-gray-500/10 text-gray-600 border-gray-500/20"
  }
}

export function PurchaseRecommendation({ selectedStock }: PurchaseRecommendationProps) {
  const data = getPurchaseData(selectedStock)
  const [purchaseAmount, setPurchaseAmount] = useState(data.recommendedAmount)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")
  const [transactionCompleted, setTransactionCompleted] = useState(false)
  const [transactionType, setTransactionType] = useState<'BUY' | 'SELL'>('BUY')
  const [scheduleForValidation, setScheduleForValidation] = useState(false)

  const calculateShares = () => {
    return Math.floor(purchaseAmount / data.currentPrice)
  }

  const handlePurchase = () => {
    setTransactionCompleted(true)
    setIsTransactionModalOpen(false)
    setTimeout(() => {
      setIsFeedbackModalOpen(true)
    }, 1000)
  }

  const submitFeedback = () => {
    console.log("Feedback submitted:", { 
      rating: feedbackRating, 
      text: feedbackText, 
      stock: selectedStock,
      scheduleForValidation: scheduleForValidation,
      transactionType: transactionType
    })
    
    if (scheduleForValidation) {
      console.log(`📅 Trade ${selectedStock} ${transactionType} scheduled for validation in 2 weeks`)
      // In real app: Create notification/reminder in backend
    }
    
    setIsFeedbackModalOpen(false)
    setFeedbackRating(0)
    setFeedbackText("")
    setScheduleForValidation(false)
  }

  return (
    <div className="space-y-6">
      {/* Purchase Recommendation Card */}
      <Card className="violet-bloom-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Kauf-Empfehlung für {selectedStock}
          </CardTitle>
          <CardDescription>
            Unabhängig von der Unsicherheit - unsere Empfehlung basierend auf aktueller Marktlage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Recommendation */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={getRecommendationColor(data.recommendation)} variant="outline">
                    {data.recommendation}
                  </Badge>
                  <span className="font-medium">Aktueller Kurs: €{data.currentPrice}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Erwartete Rendite: {data.expectedReturn > 0 ? '+' : ''}{data.expectedReturn}% in {data.timeHorizon}
                </p>
              </div>
              {data.expectedReturn > 0 ? (
                <TrendingUp className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-600" />
              )}
            </div>

            {/* Amount Recommendation */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Empfohlener Investitionsbetrag
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Minimum</div>
                    <div className="text-lg font-bold">€{data.minAmount}</div>
                  </div>
                  <div className="p-3 border-2 border-primary rounded-lg bg-primary/5">
                    <div className="text-sm text-primary font-medium">Empfohlen</div>
                    <div className="text-2xl font-bold text-primary">€{data.recommendedAmount}</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm text-muted-foreground">Maximum</div>
                    <div className="text-lg font-bold">€{data.maxAmount}</div>
                  </div>
                </div>
              </div>

              {/* Custom Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="purchase-amount">Ihr gewünschter Betrag</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="purchase-amount"
                    type="number"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(Number(e.target.value))}
                    min={data.minAmount}
                    max={data.maxAmount}
                    className="flex-1"
                  />
                  <div className="text-sm text-muted-foreground whitespace-nowrap">
                    ≈ {calculateShares()} Aktien
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Impact */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Portfolio-Auswirkung
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Diversifikation</span>
                    <span className="font-medium">{data.portfolioImpact.diversification}%</span>
                  </div>
                  <Progress value={data.portfolioImpact.diversification} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Risiko-Reduktion</span>
                    <span className={`font-medium ${data.portfolioImpact.riskReduction >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.portfolioImpact.riskReduction > 0 ? '+' : ''}{data.portfolioImpact.riskReduction}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(data.portfolioImpact.riskReduction)} 
                    className={`h-2 ${data.portfolioImpact.riskReduction >= 0 ? '' : 'bg-red-500/20'}`} 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Erwarteter Beitrag</span>
                    <span className={`font-medium ${data.portfolioImpact.expectedContribution >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {data.portfolioImpact.expectedContribution > 0 ? '+' : ''}{data.portfolioImpact.expectedContribution}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.abs(data.portfolioImpact.expectedContribution)} 
                    className={`h-2 ${data.portfolioImpact.expectedContribution >= 0 ? '' : 'bg-red-500/20'}`} 
                  />
                </div>
              </div>
            </div>

            {/* Purchase/Sell Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="px-8 bg-green-600 hover:bg-green-700"
                    onClick={() => setTransactionType('BUY')}
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {selectedStock} kaufen
                  </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    variant="destructive"
                    className="px-8"
                    onClick={() => setTransactionType('SELL')}
                  >
                    <TrendingDown className="h-4 w-4 mr-2" />
                    {selectedStock} verkaufen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {transactionType === 'BUY' ? 'Kauf' : 'Verkauf'} bestätigen
                    </DialogTitle>
                    <DialogDescription>
                      Bitte überprüfen Sie Ihre {transactionType === 'BUY' ? 'Kauf-' : 'Verkaufs-'}Order vor der Ausführung.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Wertpapier</Label>
                        <div className="font-medium">{selectedStock}</div>
                      </div>
                      <div>
                        <Label>Kurs</Label>
                        <div className="font-medium">€{data.currentPrice}</div>
                      </div>
                      <div>
                        <Label>Betrag</Label>
                        <div className="font-medium">€{purchaseAmount}</div>
                      </div>
                      <div>
                        <Label>Anzahl Aktien</Label>
                        <div className="font-medium">{calculateShares()}</div>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between">
                        <span>Gesamtkosten (inkl. Gebühren):</span>
                        <span className="font-bold">€{(purchaseAmount + 9.90).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTransactionModalOpen(false)}>
                      Abbrechen
                    </Button>
                    <Button 
                      onClick={handlePurchase}
                      className={transactionType === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {transactionType === 'BUY' ? 'Kaufen' : 'Verkaufen'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Success Message */}
      {transactionCompleted && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Transaktion erfolgreich! {calculateShares()} Aktien von {selectedStock} gekauft.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Modal */}
      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback zur Empfehlung
            </DialogTitle>
            <DialogDescription>
              Helfen Sie uns, unsere KI-Empfehlungen zu verbessern. Ihr Feedback fließt in zukünftige Bewertungen ein.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
              <Label htmlFor="feedback-text">Zusätzliche Kommentare (optional)</Label>
              <Textarea
                id="feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Was fanden Sie hilfreich oder verbesserungswürdig?"
                className="mt-2"
              />
            </div>
            
            {/* Validation Checkbox */}
            <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <Checkbox 
                id="schedule-validation" 
                checked={scheduleForValidation}
                onCheckedChange={(checked) => setScheduleForValidation(checked as boolean)}
              />
              <Label htmlFor="schedule-validation" className="text-sm font-medium leading-relaxed">
                📅 Diesen Trade in 2 Wochen für Validierung vormerken
                <p className="text-xs text-muted-foreground mt-1">
                  Wir benachrichtigen Sie, um die tatsächliche Performance mit der Prognose zu vergleichen.
                </p>
              </Label>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>📊 Ihr Feedback wird anonymisiert gespeichert und zur Verbesserung unseres Systems verwendet.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackModalOpen(false)}>
              Überspringen
            </Button>
            <Button onClick={submitFeedback} disabled={feedbackRating === 0}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              Feedback senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}