"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Database, Brain, Users } from "lucide-react"

interface UncertaintyOverviewProps {
  selectedStock: string
}

// Import parameter functions from technical analysis
import { getFundamentalDataParams, getNewsReliabilityParams, getTimeSeriesIntegrityParams, getTradingVolumeParams } from "./technical-analysis-tab"

// Calculate uncertainty data from actual parameters
const getUncertaintyData = (stock: string) => {
  // Get calculated scores from parameter functions
  const fundamentalParams = getFundamentalDataParams(stock)
  const newsParams = getNewsReliabilityParams(stock) 
  const timeSeriesParams = getTimeSeriesIntegrityParams(stock)
  const tradingVolumeParams = getTradingVolumeParams(stock)
  
  // Calculate individual dimension certainties (higher score = lower uncertainty)
  const fundamentalCertainty = (0.2 * fundamentalParams.completeness.value + 
                               0.2 * fundamentalParams.timeliness.value + 
                               0.2 * fundamentalParams.consistency.value + 
                               0.2 * fundamentalParams.accuracy.value + 
                               0.2 * fundamentalParams.stability.value) * 100
  
  const newsCertainty = (0.3 * newsParams.sourceReliability.value + 
                        0.3 * newsParams.reputationAccuracy.value + 
                        0.25 * newsParams.crossSourceConsensus.value + 
                        0.15 * newsParams.biasCheck.value) * 100
  
  const timeSeriesCertainty = (0.25 * timeSeriesParams.completeness.value + 
                              0.25 * timeSeriesParams.outlierFreedom.value + 
                              0.25 * timeSeriesParams.revisionStability.value + 
                              0.25 * timeSeriesParams.continuity.value) * 100
  
  const tradingVolumeCertainty = (0.4 * tradingVolumeParams.concentration.value + 
                                 0.3 * tradingVolumeParams.anomalousSpikes.value + 
                                 0.3 * tradingVolumeParams.timeStability.value) * 100
  
  // Calculate weighted data uncertainty (average of all data dimensions)
  const dataCertainty = (fundamentalCertainty + newsCertainty + timeSeriesCertainty + tradingVolumeCertainty) / 4
  const dataUncertainty = 100 - dataCertainty
  
  // Estimate model uncertainty based on data quality (better data = more stable model)
  const modelUncertainty = Math.max(5, Math.min(40, 30 - (dataCertainty - 70) * 0.5))
  
  // Estimate human uncertainty (inversely related to news reliability and fundamental quality)
  const humanUncertainty = Math.max(10, Math.min(35, 35 - (newsCertainty + fundamentalCertainty) / 6))
  
  // Calculate total uncertainty as weighted average
  const totalUncertainty = Math.round(0.5 * dataUncertainty + 0.3 * modelUncertainty + 0.2 * humanUncertainty)
  
  // Determine recommendation and confidence level
  const getRecommendation = (uncertainty: number, stock: string) => {
    if (uncertainty < 25) return "BUY"
    if (uncertainty < 55) return "HOLD" 
    return "SELL"
  }
  
  const getConfidenceLevel = (uncertainty: number) => {
    if (uncertainty < 20) return "HOCH"
    if (uncertainty < 40) return "MITTEL"
    if (uncertainty < 70) return "NIEDRIG"
    return "SEHR NIEDRIG"
  }
  
  return {
    totalUncertainty,
    dataUncertainty: Math.round(dataUncertainty),
    modelUncertainty: Math.round(modelUncertainty),
    humanUncertainty: Math.round(humanUncertainty),
    recommendation: getRecommendation(totalUncertainty, stock),
    confidenceLevel: getConfidenceLevel(totalUncertainty)
  }
}

export function UncertaintyOverview({ selectedStock }: UncertaintyOverviewProps) {
  const data = getUncertaintyData(selectedStock)
  
  const getUncertaintyColor = (level: number) => {
    if (level < 30) return "text-green-600"
    if (level < 60) return "text-yellow-600" 
    return "text-red-600"
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "HOCH": return "bg-green-500/10 text-green-600"
      case "MITTEL": return "bg-yellow-500/10 text-yellow-600"
      case "NIEDRIG": return "bg-orange-500/10 text-orange-600"
      case "SEHR NIEDRIG": return "bg-red-500/10 text-red-600"
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
            Die {data.totalUncertainty}% Unsicherheit setzen sich zusammen aus:
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
                <div className="text-xs text-muted-foreground">
                  ~{Math.round((data.dataUncertainty / 100) * data.totalUncertainty)}% absolut
                </div>
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
                <div className="text-xs text-muted-foreground">
                  ~{Math.round((data.modelUncertainty / 100) * data.totalUncertainty)}% absolut
                </div>
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
                <div className="text-xs text-muted-foreground">
                  ~{Math.round((data.humanUncertainty / 100) * data.totalUncertainty)}% absolut
                </div>
              </div>
            </div>
            <Progress value={data.humanUncertainty} className="w-full h-2" />
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Summe:</span>
              <span className="font-semibold">{data.dataUncertainty + data.modelUncertainty + data.humanUncertainty}% = 100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}