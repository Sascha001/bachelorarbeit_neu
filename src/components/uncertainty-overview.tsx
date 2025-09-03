"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Database, Brain, Users } from "lucide-react"

interface UncertaintyOverviewProps {
  selectedStock: string
}

// Import parameter functions from technical analysis
import { getFundamentalDataParams, getNewsReliabilityParams, getTimeSeriesIntegrityParams, getTradingVolumeParams, getModelUncertaintyParams, calculateAllHumanUncertainty, getHumanUncertaintyParams } from "./technical-analysis-tab"
import { TradingUncertaintyData, UncertaintyAnalytics } from "@/hooks/use-trading-uncertainty"

// Calculate uncertainty data from actual parameters - now receives human uncertainty data
const getUncertaintyData = (stock: string, stockData: TradingUncertaintyData[], analytics: UncertaintyAnalytics | null) => {
  // Get calculated scores from parameter functions (stock-specific)
  const fundamentalParams = getFundamentalDataParams(stock)
  const newsParams = getNewsReliabilityParams(stock) 
  const timeSeriesParams = getTimeSeriesIntegrityParams(stock)
  const tradingVolumeParams = getTradingVolumeParams(stock)
  
  // Calculate individual dimension certainties using calculation functions (higher score = lower uncertainty)
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
  
  // STEP 6: Calculate relative uncertainty breakdown (percentages that sum to 100%)
  const totalRawUncertainty = dataUncertaintyRaw + modelUncertaintyRaw + humanUncertaintyRaw
  
  const dataUncertaintyPercent = Math.round((dataUncertaintyRaw / totalRawUncertainty) * 100 * 10) / 10
  const modelUncertaintyPercent = Math.round((modelUncertaintyRaw / totalRawUncertainty) * 100 * 10) / 10
  const humanUncertaintyPercent = Math.round((humanUncertaintyRaw / totalRawUncertainty) * 100 * 10) / 10
  
  // Determine recommendation using 2-step process: market analysis + uncertainty filter
  const getRecommendation = (uncertainty: number, stock: string) => {
    // STEP 1: Market-based fundamental recommendation
    let marketRecommendation = "HOLD"; // Default
    
    // Analyze stock characteristics for market recommendation
    const stockAnalysis: Record<string, string> = {
      // Strong fundamentals - BUY recommendations
      MSFT: "BUY", JNJ: "BUY", PG: "BUY", UNH: "BUY", 
      "ALV.DE": "BUY", "NESN.SW": "BUY", "SIE.DE": "BUY", HD: "BUY", AMZN: "BUY", "BRK.B": "BUY", "ASML.AS": "BUY",
      
      // Mixed signals / regulatory challenges - HOLD recommendations  
      V: "HOLD", GOOGL: "HOLD", AAPL: "HOLD", META: "HOLD",
      
      // Overvaluation / sector concerns - SELL recommendations
      MA: "SELL", KO: "SELL", JPM: "SELL", "SAP.DE": "SELL", "BMW.DE": "SELL", "BAS.DE": "SELL", TSLA: "SELL", NVDA: "SELL"
    };
    
    marketRecommendation = stockAnalysis[stock] || "HOLD";
    
    // STEP 2: Uncertainty filter - if uncertainty > 40%, force to HOLD
    if (uncertainty > 40) {
      return "HOLD"; // Too uncertain to trade
    }
    
    // Return market-based recommendation if uncertainty is manageable
    return marketRecommendation;
  }
  
  const getConfidenceLevel = (uncertainty: number) => {
    if (uncertainty < 11) return "SEHR SICHER"
    if (uncertainty < 21) return "SICHER"
    if (uncertainty < 36) return "UNSICHER"
    return "SEHR UNSICHER"
  }
  
  return {
    totalUncertainty,
    dataUncertainty: dataUncertaintyPercent,      // Shows relative percentage (part of 100%)
    modelUncertainty: modelUncertaintyPercent,    // Shows relative percentage (part of 100%)  
    humanUncertainty: humanUncertaintyPercent,    // Shows relative percentage (part of 100%)
    recommendation: getRecommendation(totalUncertainty, stock),
    confidenceLevel: getConfidenceLevel(totalUncertainty)
  }
}

export function UncertaintyOverview({ selectedStock }: UncertaintyOverviewProps) {
  // This component can't use hooks directly since it's called from server components
  // We'll use a placeholder for now and will need to restructure later
  const stockData: TradingUncertaintyData[] = []
  const analytics: UncertaintyAnalytics | null = null
  const data = getUncertaintyData(selectedStock, stockData, analytics)
  
  const getUncertaintyColor = (level: number) => {
    if (level < 11) return "text-green-600"    // SEHR SICHER = green
    if (level < 21) return "text-blue-600"     // SICHER = blue  
    if (level < 36) return "text-orange-600"   // UNSICHER = orange
    return "text-red-600"                      // SEHR UNSICHER = red
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "SEHR SICHER": return "bg-green-500/10 text-green-600"
      case "SICHER": return "bg-blue-500/10 text-blue-600"
      case "UNSICHER": return "bg-orange-500/10 text-orange-600"
      case "SEHR UNSICHER": return "bg-red-500/10 text-red-600"
      default: return "bg-gray-500/10 text-gray-600"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* General Uncertainty Card */}
      <Card className="violet-bloom-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Gesamtunsicherheit
              </CardTitle>
              <CardDescription>
                KI-Empfehlung für {selectedStock}
              </CardDescription>
            </div>
            <Badge className={getConfidenceColor(data.confidenceLevel)}>
              {data.confidenceLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getUncertaintyColor(data.totalUncertainty)}`}>
              {data.totalUncertainty}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Unsicherheit der Empfehlung
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Empfehlung:</span>
            <Badge variant={data.recommendation === "BUY" ? "default" : data.recommendation === "SELL" ? "destructive" : "secondary"}>
              {data.recommendation}
            </Badge>
          </div>
          <Progress value={100 - data.totalUncertainty} className="w-full" />
          <p className="text-xs text-muted-foreground">
            {100 - data.totalUncertainty}% Konfidenz in der Empfehlung
          </p>
        </CardContent>
      </Card>

      {/* Uncertainty Breakdown Card */}
      <Card className="violet-bloom-card">
        <CardHeader className="pb-4">
          <CardTitle>Unsicherheits-Aufschlüsselung</CardTitle>
          <CardDescription>
            Prozentualer Anteil jeder Dimension an der Gesamtunsicherheit für {selectedStock}:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data Uncertainty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Daten-Unsicherheit</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{data.dataUncertainty}%</div>
              </div>
            </div>
            <Progress value={data.dataUncertainty} className="w-full h-2" />
          </div>

          {/* Model Uncertainty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Modell-Unsicherheit</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{data.modelUncertainty}%</div>
              </div>
            </div>
            <Progress value={data.modelUncertainty} className="w-full h-2" />
          </div>

          {/* Human Uncertainty */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Menschliche Unsicherheit</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{data.humanUncertainty}%</div>
              </div>
            </div>
            <Progress value={data.humanUncertainty} className="w-full h-2" />
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Summe der Anteile:</span>
              <span className="font-semibold">100% (Gesamtunsicherheit: {data.totalUncertainty}%)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}