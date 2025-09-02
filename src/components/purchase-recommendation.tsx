"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
  ThumbsUp,
  Info
} from "lucide-react"
import { useState } from "react"

interface PurchaseRecommendationProps {
  selectedStock: string
}

// Import parameter functions and mock stock prices
import { getFundamentalDataParams, getNewsReliabilityParams, getTimeSeriesIntegrityParams, getTradingVolumeParams, getModelUncertaintyParams, getHumanUncertaintyParams, calculateAllHumanUncertainty } from "./technical-analysis-tab"
import { COMPREHENSIVE_MOCK_DATA } from "../data/mockStockData"
import { TradingConfirmationDialog } from "./trading-confirmation-dialog"
import { useTradingUncertainty, TradingUncertaintyData, UncertaintyAnalytics } from "@/hooks/use-trading-uncertainty"

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
  // Get stock price from mock data
  const stockData = COMPREHENSIVE_MOCK_DATA[stock] || COMPREHENSIVE_MOCK_DATA.AAPL
  const currentPrice = stockData.price
  
  // Calculate uncertainty scores from parameters (stock-specific)
  const fundamentalParams = getFundamentalDataParams(stock)
  const newsParams = getNewsReliabilityParams(stock) 
  const timeSeriesParams = getTimeSeriesIntegrityParams(stock)
  const tradingVolumeParams = getTradingVolumeParams(stock)
  
  // Calculate dimension certainties using calculation functions
  const fundamentalCalculated = {
    completeness: 1 - (fundamentalParams.completeness.missingValues / fundamentalParams.completeness.totalValues),
    timeliness: Math.max(0, 1 - (fundamentalParams.timeliness.daysOld / fundamentalParams.timeliness.maxAcceptableDays)),
    consistency: 1 - (fundamentalParams.consistency.inconsistentEntries / fundamentalParams.consistency.totalEntries),
    accuracy: fundamentalParams.accuracy.accurateReports / fundamentalParams.accuracy.totalReports,
    stability: 1 - (fundamentalParams.stability.revisions / fundamentalParams.stability.totalDataPoints)
  };
  const fundamentalCertainty = (0.2 * fundamentalCalculated.completeness + 
                               0.2 * fundamentalCalculated.timeliness + 
                               0.2 * fundamentalCalculated.consistency + 
                               0.2 * fundamentalCalculated.accuracy + 
                               0.2 * fundamentalCalculated.stability) * 100
  
  const newsCalculated = {
    sourceReliability: newsParams.sourceReliability.averageReliability,
    reputationAccuracy: 1 - (newsParams.reputationAccuracy.falseNews / newsParams.reputationAccuracy.totalNews),
    crossSourceConsensus: newsParams.crossSourceConsensus.confirmedNews / newsParams.crossSourceConsensus.totalNews,
    biasCheck: 1 - (newsParams.biasCheck.biasIndex / newsParams.biasCheck.maxBiasValue)
  };
  const newsCertainty = (0.3 * newsCalculated.sourceReliability + 
                        0.3 * newsCalculated.reputationAccuracy + 
                        0.25 * newsCalculated.crossSourceConsensus + 
                        0.15 * newsCalculated.biasCheck) * 100
  
  const timeSeriesCalculated = {
    completeness: 1 - (timeSeriesParams.completeness.missingTimepoints / timeSeriesParams.completeness.expectedTimepoints),
    outlierFreedom: 1 - (timeSeriesParams.outlierFreedom.outliers / timeSeriesParams.outlierFreedom.totalObservations),
    revisionStability: 1 - (timeSeriesParams.revisionStability.revisedValues / timeSeriesParams.revisionStability.totalValues),
    continuity: 1 - (timeSeriesParams.continuity.gaps / timeSeriesParams.continuity.totalIntervals)
  };
  const timeSeriesCertainty = (0.25 * timeSeriesCalculated.completeness + 
                              0.25 * timeSeriesCalculated.outlierFreedom + 
                              0.25 * timeSeriesCalculated.revisionStability + 
                              0.25 * timeSeriesCalculated.continuity) * 100
  
  const tradingVolumeCalculated = {
    concentration: 1 - (tradingVolumeParams.concentration.topTradersVolume / tradingVolumeParams.concentration.totalVolume),
    anomalousSpikes: 1 - (tradingVolumeParams.anomalousSpikes.spikes / tradingVolumeParams.anomalousSpikes.totalTradingDays),
    timeStability: 1 - (tradingVolumeParams.timeStability.varianceCoefficient / tradingVolumeParams.timeStability.maxVarianceCoefficient)
  };
  const tradingVolumeCertainty = (0.4 * tradingVolumeCalculated.concentration + 
                                 0.3 * tradingVolumeCalculated.anomalousSpikes + 
                                 0.3 * tradingVolumeCalculated.timeStability) * 100
  
  // STEP 1: Calculate average certainty for data dimension (4 parameters)
  const dataCertainty = (fundamentalCertainty + newsCertainty + timeSeriesCertainty + tradingVolumeCertainty) / 4
  
  // STEP 2: Calculate model certainty using ChatGPT Framework
  const modelParams = getModelUncertaintyParams(stock)
  
  // Calculate the actual values using the calculation functions
  const epistemicValue = 1 - (modelParams.epistemicUncertainty.predictionStdDev / (modelParams.epistemicUncertainty.meanPrediction + modelParams.epistemicUncertainty.epsilon))
  const aleatoricValue = 1 - (modelParams.aleatoricUncertainty.meanPredictionVariance / modelParams.aleatoricUncertainty.maxExpectedVariance)
  const overfittingValue = 1 - (Math.abs(modelParams.overfittingRisk.trainLoss - modelParams.overfittingRisk.testLoss) / (modelParams.overfittingRisk.trainLoss + modelParams.overfittingRisk.epsilon))
  const robustnessValue = 1 - (modelParams.robustness.meanPerturbationChange / modelParams.robustness.baselinePrediction)
  const explanationValue = (modelParams.explanationConsistency.featureImportanceCorrelation + 1) / 2
  
  const modelCertainty = (0.25 * epistemicValue + 
                         0.15 * aleatoricValue + 
                         0.20 * overfittingValue + 
                         0.20 * robustnessValue + 
                         0.20 * explanationValue) * 100
  
  // STEP 3: Calculate human certainty from static parameters (pure static data)
  const humanParams = getHumanUncertaintyParams(stock)
  const humanCalculated = calculateAllHumanUncertainty(humanParams)
  
  // Convert human uncertainty to certainty (weighted average of 4 dimensions)
  const humanCertainty = (1 - (0.3 * humanCalculated.perceivedUncertainty + 
                               0.25 * humanCalculated.epistemicUncertainty + 
                               0.25 * humanCalculated.aleatoricUncertainty + 
                               0.2 * humanCalculated.decisionStability)) * 100
  
  // STEP 4: Convert certainties to uncertainties (inversion)
  const dataUncertaintyRaw = 100 - dataCertainty
  const modelUncertaintyRaw = 100 - modelCertainty  
  const humanUncertaintyRaw = 100 - humanCertainty
  
  // STEP 5: Calculate total uncertainty (sum divided by maximum possible = 300%)
  const totalUncertaintyRaw = dataUncertaintyRaw + modelUncertaintyRaw + humanUncertaintyRaw
  const totalUncertainty = Math.round((totalUncertaintyRaw / 300) * 100)
  
  const uncertaintyScore = totalUncertainty
  
  // Generate recommendation using 2-step process: market analysis + uncertainty filter
  const getRecommendation = (uncertainty: number, stock: string) => {
    // STEP 1: Market-based fundamental recommendation
    const stockAnalysis: Record<string, string> = {
      // Growth stocks with strong fundamentals
      AAPL: "BUY", MSFT: "BUY", GOOGL: "BUY", V: "BUY", MA: "BUY",
      // Stable value stocks  
      JNJ: "BUY", PG: "BUY", KO: "BUY", UNH: "BUY",
      // Mixed signals / mature markets
      HD: "HOLD", JPM: "HOLD",
      // High volatility / risk concerns
      TSLA: "SELL", META: "HOLD", NVDA: "SELL", AMZN: "HOLD"
    };
    
    const marketRecommendation = stockAnalysis[stock] || "HOLD";
    
    // STEP 2: Uncertainty filter - if uncertainty > 40%, force to HOLD
    if (uncertainty > 40) {
      return "HOLD"; // Too uncertain to trade
    }
    
    return marketRecommendation;
  }
  
  const recommendation = getRecommendation(uncertaintyScore, stock)
  
  // Calculate portfolio metrics based on uncertainty and stock characteristics
  const calculatePortfolioMetrics = (certainty: number) => {
    // Diversification: Higher for stocks with different risk profiles
    const isDifferentSector = stockData.sector !== 'Technology'
    const baseDiversification = isDifferentSector ? 85 : 75
    const diversification = Math.min(95, Math.max(50, baseDiversification + (certainty - 75) * 0.3))
    
    // Risk Reduction: Better data quality = better risk management
    const baseRiskReduction = certainty >= 85 ? 15 : certainty >= 75 ? 8 : certainty >= 65 ? 2 : -8
    const riskReduction = Math.round(baseRiskReduction + (tradingVolumeCertainty - 80) * 0.2)
    
    // Expected Contribution: Based on fundamental strength and news reliability
    const baseContribution = (fundamentalCertainty + newsCertainty) / 2
    const expectedContribution = Math.round((baseContribution - 70) * 0.4)
    
    return {
      diversification: Math.round(diversification),
      riskReduction: Math.max(-15, Math.min(25, riskReduction)),
      expectedContribution: Math.max(-10, Math.min(25, expectedContribution))
    }
  }
  
  // Calculate investment amounts based on recommendation type
  const getInvestmentAmounts = (certainty: number, price: number, rec: string) => {
    // HOLD = 0€ (position halten, nichts tun)
    if (rec === "HOLD") return { recommended: 0, min: 0, max: 0 }
    
    // BUY und SELL bekommen beide empfohlene Beträge basierend auf Certainty
    const baseAmount = certainty >= 85 ? 3000 : certainty >= 75 ? 2000 : 1000
    const priceAdjusted = Math.round(baseAmount / price) * price  // Round to whole shares
    
    return {
      recommended: priceAdjusted,
      min: Math.round(price * 2), // At least 2 shares
      max: Math.round(priceAdjusted * 4) // Up to 4x recommended
    }
  }
  
  const amounts = getInvestmentAmounts(dataCertainty, currentPrice, recommendation)
  
  // Calculate expected return based on data quality and recommendation
  const getExpectedReturn = (certainty: number, rec: string) => {
    if (rec === "SELL") return Math.round(((certainty - 80) * -0.3) * 10) / 10
    if (rec === "HOLD") return Math.round(((certainty - 70) * 0.15) * 10) / 10
    return Math.round(((certainty - 65) * 0.25) * 10) / 10
  }
  
  // Time horizon based on data stability
  const getTimeHorizon = (timeSeriesCert: number, newsCert: number) => {
    const avgStability = (timeSeriesCert + newsCert) / 2
    if (avgStability >= 90) return "6-12 Monate"
    if (avgStability >= 80) return "3-6 Monate"
    return "1-3 Monate"
  }
  
  return {
    currentPrice,
    recommendation,
    recommendedAmount: amounts.recommended,
    minAmount: amounts.min,
    maxAmount: amounts.max,
    expectedReturn: getExpectedReturn(dataCertainty, recommendation),
    timeHorizon: getTimeHorizon(timeSeriesCertainty, newsCertainty),
    riskScore: Math.round(uncertaintyScore),
    portfolioImpact: calculatePortfolioMetrics(dataCertainty)
  }
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
  const { addUncertaintyData } = useTradingUncertainty()
  
  const [purchaseAmount, setPurchaseAmount] = useState(0)
  const [isRecommendedSelected, setIsRecommendedSelected] = useState(false)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)
  const [isUncertaintyModalOpen, setIsUncertaintyModalOpen] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState("")
  const [transactionCompleted, setTransactionCompleted] = useState(false)
  const [transactionType, setTransactionType] = useState<'BUY' | 'SELL'>('BUY')
  const [scheduleForValidation, setScheduleForValidation] = useState(false)
  const [currentTradingData, setCurrentTradingData] = useState<{
    symbol: string;
    action: 'buy' | 'sell';
    amount: number;
    price: number;
    totalValue: number;
    aiConfidence: number;
    aiRecommendation: string;
    marketSentiment: string;
  } | null>(null)

  const calculateShares = () => {
    return purchaseAmount > 0 ? Math.floor(purchaseAmount / data.currentPrice) : 0
  }

  const handlePurchase = () => {
    setIsTransactionModalOpen(false)
    
    // Prepare trading data for uncertainty modal
    const tradingData = {
      symbol: selectedStock,
      action: transactionType.toLowerCase() as 'buy' | 'sell',
      amount: calculateShares(),
      price: data.currentPrice,
      totalValue: calculateShares() * data.currentPrice,
      aiConfidence: data.riskScore / 100, // Convert risk score to confidence
      aiRecommendation: data.recommendation,
      marketSentiment: 'neutral' // Could be derived from data
    }
    setCurrentTradingData(tradingData)
    
    setTimeout(() => {
      setIsFeedbackModalOpen(true)
      setIsUncertaintyModalOpen(true) // Open both modals simultaneously
    }, 1000)
  }

  const handleUncertaintySubmit = (uncertaintyData: TradingUncertaintyData) => {
    // Send uncertainty data to hook
    addUncertaintyData(uncertaintyData)
    console.log("Uncertainty data submitted:", uncertaintyData)
    
    // Close uncertainty modal
    setIsUncertaintyModalOpen(false)
  }

  const handleUncertaintyClose = () => {
    setIsUncertaintyModalOpen(false)
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
    setTransactionCompleted(true) // Show transaction success only after feedback
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
                  {data.recommendation === "BUY" && "Empfohlener Kaufbetrag"}
                  {data.recommendation === "SELL" && "Empfohlener Verkaufsbetrag"}  
                  {data.recommendation === "HOLD" && "Position halten"}
                </h4>
{data.recommendation === "HOLD" ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <div className="text-sm text-yellow-700 mb-2">
                      Empfehlung: Position halten
                    </div>
                    <div className="text-lg font-medium text-yellow-800">
                      Kein Handel empfohlen - Aktuelle Position beibehalten
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Minimum</div>
                      <div className="text-lg font-bold">€{data.minAmount}</div>
                    </div>
                    <div 
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isRecommendedSelected 
                          ? 'border-2 border-primary bg-primary/5 violet-bloom-active' 
                          : 'border border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                      }`}
                      onClick={() => {
                        setIsRecommendedSelected(true)
                        setPurchaseAmount(Math.round(data.recommendedAmount * 100) / 100)
                      }}
                    >
                      <div className={`text-sm font-medium ${isRecommendedSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                        Empfohlen
                      </div>
                      <div className={`text-2xl font-bold ${isRecommendedSelected ? 'text-primary' : 'text-foreground'}`}>
                        €{data.recommendedAmount.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Maximum</div>
                      <div className="text-lg font-bold">€{data.maxAmount}</div>
                    </div>
                  </div>
                )}
              </div>

{data.recommendation !== "HOLD" && (
                /* Custom Amount Input */
                <div className="space-y-2">
                  <Label htmlFor="purchase-amount">Ihr gewünschter Betrag</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="purchase-amount"
                      type="number"
                      value={purchaseAmount > 0 ? purchaseAmount : ""}
                      onChange={(e) => {
                        setPurchaseAmount(Number(e.target.value) || 0)
                        setIsRecommendedSelected(false) // Deselect recommended when manually typing
                      }}
                      min={data.minAmount}
                      max={data.maxAmount}
                      placeholder="Betrag eingeben"
                      className="flex-1"
                    />
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      ≈ {calculateShares()} Aktien
                    </div>
                  </div>
                </div>
              )}
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
                    <div className="flex items-center gap-1">
                      <span>Diversifikation</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              Wie stark diese Aktie zur Risikoverstreuung Ihres Portfolios beiträgt. 
                              Höhere Werte bedeuten bessere Diversifikation durch unterschiedliche Branchen oder Regionen.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="font-medium">{data.portfolioImpact.diversification}%</span>
                  </div>
                  <Progress value={data.portfolioImpact.diversification} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span>Risiko-Reduktion</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              Erwartete Veränderung des Gesamtrisikos Ihres Portfolios durch diese Investition. 
                              Positive Werte reduzieren das Risiko, negative Werte erhöhen es.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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
                    <div className="flex items-center gap-1">
                      <span>Erwarteter Beitrag</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              Prognostizierter Beitrag dieser Aktie zur Gesamtrendite Ihres Portfolios. 
                              Basiert auf Fundamentaldaten und aktueller Markteinschätzung.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
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

{data.recommendation !== "HOLD" && (
              /* Purchase/Sell Buttons */
              <div className="flex justify-center gap-4 pt-4">
                <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className="px-8 bg-green-600 hover:bg-green-700"
                      onClick={() => setTransactionType('BUY')}
                      disabled={purchaseAmount <= 0}
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
                      disabled={purchaseAmount <= 0}
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
                        <div className="font-medium">€{(purchaseAmount || data.recommendedAmount).toFixed(2)}</div>
                      </div>
                      <div>
                        <Label>Anzahl Aktien</Label>
                        <div className="font-medium">{purchaseAmount > 0 ? calculateShares() : Math.floor(data.recommendedAmount / data.currentPrice)}</div>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between">
                        <span>Gesamtkosten (inkl. Gebühren):</span>
                        <span className="font-bold">€{((purchaseAmount || data.recommendedAmount) + 9.90).toFixed(2)}</span>
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Success Message */}
      {transactionCompleted && (
        <Card className={`${
          transactionType === 'BUY' 
            ? 'border-green-500/50 bg-green-500/5' 
            : 'border-red-500/50 bg-red-500/5'
        }`}>
          <CardContent className="pt-6">
            <div className={`flex items-center gap-3 ${
              transactionType === 'BUY' ? 'text-green-600' : 'text-red-600'
            }`}>
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Transaktion erfolgreich! {calculateShares()} Aktien von {selectedStock} {
                  transactionType === 'BUY' ? 'gekauft' : 'verkauft'
                }.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback Modal */}
      <Dialog open={isFeedbackModalOpen} onOpenChange={() => {}}>
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
            <Button variant="outline" onClick={() => {
              setIsFeedbackModalOpen(false)
              setTransactionCompleted(true) // Show transaction success also when skipping
            }}>
              Überspringen
            </Button>
            <Button onClick={submitFeedback} disabled={feedbackRating === 0}>
              <ThumbsUp className="h-4 w-4 mr-2" />
              Feedback senden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Uncertainty Assessment Modal - parallel to feedback */}
      {currentTradingData && (
        <TradingConfirmationDialog
          isOpen={isUncertaintyModalOpen}
          onClose={handleUncertaintyClose}
          onConfirm={handleUncertaintySubmit}
          tradingData={currentTradingData}
        />
      )}
    </div>
  )
}