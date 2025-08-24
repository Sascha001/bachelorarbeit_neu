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
  
  // STEP 1: Calculate average certainty for data dimension (4 parameters)
  const dataCertainty = (fundamentalCertainty + newsCertainty + timeSeriesCertainty + tradingVolumeCertainty) / 4
  
  // STEP 2: Calculate model certainty (existing logic, no new parameters yet)
  const modelCertainty = Math.max(30, Math.min(95, 70 + (dataCertainty - 70) * 0.4)) // Model benefits from good data
  
  // STEP 3: Calculate human certainty (existing logic, no new parameters yet)  
  const humanCertainty = Math.max(60, Math.min(95, 80 - (fundamentalCertainty + newsCertainty) / 12)) // Experts more uncertain with complex situations
  
  // STEP 4: Convert certainties to uncertainties (inversion)
  const dataUncertaintyRaw = 100 - dataCertainty
  const modelUncertaintyRaw = 100 - modelCertainty  
  const humanUncertaintyRaw = 100 - humanCertainty
  
  // STEP 5: Calculate total uncertainty (sum of all dimensions)
  const totalUncertaintyRaw = dataUncertaintyRaw + modelUncertaintyRaw + humanUncertaintyRaw
  const totalUncertainty = Math.round(totalUncertaintyRaw)
  
  // STEP 6: Calculate relative breakdown (always sums to 100%)
  const dataUncertaintyPercent = Math.round((dataUncertaintyRaw / totalUncertaintyRaw) * 100)
  const modelUncertaintyPercent = Math.round((modelUncertaintyRaw / totalUncertaintyRaw) * 100)  
  const humanUncertaintyPercent = 100 - dataUncertaintyPercent - modelUncertaintyPercent // Ensure exact 100% sum
  
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
    dataUncertainty: dataUncertaintyPercent,      // Now shows relative percentage
    modelUncertainty: modelUncertaintyPercent,    // Now shows relative percentage  
    humanUncertainty: humanUncertaintyPercent,    // Now shows relative percentage
    recommendation: getRecommendation(totalUncertainty, stock),
    confidenceLevel: getConfidenceLevel(totalUncertainty)
  }
}

export function UncertaintyOverview({ selectedStock }: UncertaintyOverviewProps) {
  const data = getUncertaintyData(selectedStock)
  
  const getUncertaintyColor = (level: number) => {
    if (level < 20) return "text-green-600"    // HOCH confidence = green
    if (level < 40) return "text-yellow-600"   // MITTEL confidence = yellow
    if (level < 70) return "text-orange-600"   // NIEDRIG confidence = orange
    return "text-red-600"                      // SEHR NIEDRIG confidence = red
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