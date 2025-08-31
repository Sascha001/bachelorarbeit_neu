"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  HelpCircle,
  Database,
  Brain,
  Users,
  AlertTriangle,
  CheckCircle,
  Info,
  Lightbulb,
  Target
} from "lucide-react"

interface SimplifiedAnalysisTabProps {
  selectedStock: string
}

// Import parameter functions and uncertainty calculation
import { getFundamentalDataParams, getNewsReliabilityParams, getTimeSeriesIntegrityParams, getTradingVolumeParams } from "./technical-analysis-tab"

// Mock simplified data
interface ConcernData {
  category: string;
  explanation: string;
  impact: string;
  userAction: string;
}

interface SimplifiedData {
  overallMessage: string;
  confidenceLevel: number;
  mainConcerns: ConcernData[];
  recommendations: string[];
  riskLevel: string;
}

const getSimplifiedData = (stock: string): SimplifiedData => {
  // Calculate uncertainty scores from parameters
  const fundamentalParams = getFundamentalDataParams()
  const newsParams = getNewsReliabilityParams() 
  const timeSeriesParams = getTimeSeriesIntegrityParams()
  const tradingVolumeParams = getTradingVolumeParams()
  
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
  
  const dataCertainty = (fundamentalCertainty + newsCertainty + timeSeriesCertainty + tradingVolumeCertainty) / 4
  const confidenceLevel = Math.round(dataCertainty)
  
  // Generate dynamic explanations based on scores
  const getOverallMessage = (confidence: number, stockSymbol: string) => {
    if (confidence >= 90) return `Die KI-Empfehlung für ${stockSymbol} ist sehr verlässlich mit hochwertigen Daten und geringer Unsicherheit.`
    if (confidence >= 80) return `Die KI-Empfehlung für ${stockSymbol} ist weitgehend verlässlich, mit nur geringen Unsicherheiten.`
    if (confidence >= 70) return `Die KI-Empfehlung für ${stockSymbol} ist relativ verlässlich, aber es gibt einige Unsicherheiten zu beachten.`
    if (confidence >= 60) return `Die KI-Empfehlung für ${stockSymbol} zeigt moderate Unsicherheiten, die Ihre Entscheidung beeinflussen könnten.`
    return `Die KI-Empfehlung für ${stockSymbol} ist mit hohen Unsicherheiten verbunden und sollte vorsichtig interpretiert werden.`
  }
  
  const getRiskLevel = (confidence: number) => {
    if (confidence >= 90) return "Niedrig"
    if (confidence >= 80) return "Mittel-Niedrig" 
    if (confidence >= 70) return "Mittel"
    if (confidence >= 60) return "Mittel-Hoch"
    return "Sehr Hoch"
  }
  
  const getDataQualityConcern = (fundamentalCert: number, newsCert: number) => {
    const avgDataQuality = (fundamentalCert + newsCert) / 2
    if (avgDataQuality >= 90) {
      return {
        category: "Datenqualität",
        explanation: `Die Fundamentaldaten (${fundamentalCert.toFixed(1)}%) und Nachrichten (${newsCert.toFixed(1)}%) für ${stock} sind sehr hochwertig und zuverlässig.`,
        impact: "niedrig",
        userAction: "Sie können sich auf die verfügbaren Daten verlassen und kurzfristige Entscheidungen treffen."
      }
    } else if (avgDataQuality >= 80) {
      return {
        category: "Datenqualität", 
        explanation: `Die Datenqualität für ${stock} ist gut (Fundamentals: ${fundamentalCert.toFixed(1)}%, News: ${newsCert.toFixed(1)}%), aber gelegentliche Verzögerungen können auftreten.`,
        impact: "mittel",
        userAction: "Warten Sie bei wichtigen Entscheidungen auf die neuesten Quartalsergebnisse."
      }
    } else {
      return {
        category: "Datenqualität",
        explanation: `Die Datenqualität für ${stock} zeigt Probleme (Fundamentals: ${fundamentalCert.toFixed(1)}%, News: ${newsCert.toFixed(1)}%). Widersprüchliche Informationen können die Analyse erschweren.`,
        impact: "hoch", 
        userAction: "Verlassen Sie sich nicht nur auf automatisierte Analysen. Prüfen Sie mehrere Quellen."
      }
    }
  }
  
  const getModelConcern = (timeSeriesCert: number, tradingCert: number) => {
    const avgModelData = (timeSeriesCert + tradingCert) / 2
    if (avgModelData >= 90) {
      return {
        category: "KI-Modell",
        explanation: `Unser KI-System funktioniert sehr gut für ${stock} mit stabilen Zeitreihen (${timeSeriesCert.toFixed(1)}%) und vorhersagbaren Handelsmustern (${tradingCert.toFixed(1)}%).`,
        impact: "niedrig",
        userAction: "Das Modell liefert zuverlässige Prognosen für die nächsten 1-3 Monate."
      }
    } else if (avgModelData >= 75) {
      return {
        category: "KI-Modell",
        explanation: `Unser Modell arbeitet ordentlich für ${stock}, aber volatilere Handelsmuster (${tradingCert.toFixed(1)}%) können die Vorhersagen beeinträchtigen.`,
        impact: "mittel",
        userAction: "Fokussieren Sie sich auf längerfristige Trends statt kurzfristige Prognosen."
      }
    } else {
      return {
        category: "KI-Modell",
        explanation: `Unser Modell hat Schwierigkeiten mit ${stock} aufgrund unvorhersagbarer Zeitreihen (${timeSeriesCert.toFixed(1)}%) und volatiler Handelsmuster (${tradingCert.toFixed(1)}%).`,
        impact: "hoch",
        userAction: "Nutzen Sie unsere Empfehlungen nur als einen von vielen Faktoren."
      }
    }
  }
  
  const mainConcerns = [
    getDataQualityConcern(fundamentalCertainty, newsCertainty),
    getModelConcern(timeSeriesCertainty, tradingVolumeCertainty),
    {
      category: "Marktmeinung",
      explanation: `Expertenmeinungen zu ${stock} variieren basierend auf der aktuellen Nachrichtenlage (Verlässlichkeit: ${newsCertainty.toFixed(1)}%).`,
      impact: newsCertainty >= 85 ? "niedrig" : newsCertainty >= 75 ? "mittel" : "hoch",
      userAction: newsCertainty >= 85 ? "Expertenmeinungen sind weitgehend konsistent." : "Berücksichtigen Sie verschiedene Expertenmeinungen und diversifizieren Sie."
    }
  ]
  
  const recommendations = [
    `${stock} zeigt ${confidenceLevel >= 80 ? 'gute' : confidenceLevel >= 70 ? 'moderate' : 'schwache'} Datenqualität für KI-basierte Entscheidungen`,
    `Zeitreihen-Integrität: ${timeSeriesCertainty.toFixed(1)}% - ${timeSeriesCertainty >= 90 ? 'sehr stabil' : timeSeriesCertainty >= 80 ? 'stabil' : 'volatil'}`,
    `Handelsvolumen-Analyse: ${tradingVolumeCertainty.toFixed(1)}% - ${tradingVolumeCertainty >= 85 ? 'vorhersagbare Muster' : 'unregelmäßige Muster'}`,
    confidenceLevel >= 80 ? `Empfehlungen für ${stock} sind verlässlich` : `Seien Sie bei ${stock}-Entscheidungen besonders vorsichtig`
  ]
  
  return {
    overallMessage: getOverallMessage(confidenceLevel, stock),
    confidenceLevel,
    mainConcerns,
    recommendations,
    riskLevel: getRiskLevel(confidenceLevel)
  }
}

const getRiskColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "niedrig": return "text-green-600 bg-green-500/10"
    case "mittel-niedrig": return "text-blue-600 bg-blue-500/10" 
    case "mittel": return "text-yellow-600 bg-yellow-500/10"
    case "hoch": return "text-orange-600 bg-orange-500/10"
    case "sehr hoch": return "text-red-600 bg-red-500/10"
    default: return "text-gray-600 bg-gray-500/10"
  }
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "niedrig": return "text-green-600"
    case "mittel": return "text-yellow-600" 
    case "hoch": return "text-orange-600"
    case "sehr hoch": return "text-red-600"
    default: return "text-gray-600"
  }
}

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case "niedrig": return <CheckCircle className="h-4 w-4 text-green-600" />
    case "mittel": return <Info className="h-4 w-4 text-yellow-600" />
    case "hoch": return <AlertTriangle className="h-4 w-4 text-orange-600" />
    case "sehr hoch": return <AlertTriangle className="h-4 w-4 text-red-600" />
    default: return <HelpCircle className="h-4 w-4 text-gray-600" />
  }
}

export function SimplifiedAnalysisTab({ selectedStock }: SimplifiedAnalysisTabProps) {
  const data = getSimplifiedData(selectedStock)
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Daten-Erklärung
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Modell-Erklärung
          </TabsTrigger>
          <TabsTrigger value="human" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Menschliche Faktoren
          </TabsTrigger>
        </TabsList>

        {/* Data Explanation Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Datenqualität für {selectedStock}
              </CardTitle>
              <CardDescription>
                Verständliche Erklärung der Datenqualität und deren Auswirkungen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-base leading-relaxed">{data.overallMessage}</p>
                  </div>
                  <div className="text-center ml-6">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {100 - data.confidenceLevel}%
                    </div>
                    <p className="text-sm text-muted-foreground">Vertrauen</p>
                    <Badge className={getRiskColor(data.riskLevel)} variant="outline">
                      {data.riskLevel} Risiko
                    </Badge>
                  </div>
                </div>
                <Progress value={100 - data.confidenceLevel} className="w-full h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Data Quality Concerns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Datenqualität-Aspekte
              </CardTitle>
              <CardDescription>
                Alles über die Qualität und Verfügbarkeit der Daten für {selectedStock}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.mainConcerns
                  .filter((concern: ConcernData) => concern.category === "Datenqualität")
                  .map((concern: ConcernData, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500/30 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-lg">{concern.category}</h4>
                      <div className="flex items-center gap-1">
                        {getImpactIcon(concern.impact)}
                        <span className={`text-sm font-medium ${getImpactColor(concern.impact)}`}>
                          {concern.impact} Auswirkung
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-foreground mb-2">Was bedeutet das?</h5>
                        <p className="text-muted-foreground leading-relaxed">
                          {concern.explanation}
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Was können Sie tun?
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {concern.userAction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model Explanation Tab */}
        <TabsContent value="model" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                KI-Modell Erklärung für {selectedStock}
              </CardTitle>
              <CardDescription>
                Wie unser KI-System zu dieser Empfehlung kommt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.mainConcerns
                  .filter((concern: ConcernData) => concern.category === "KI-Modell")
                  .map((concern: ConcernData, index: number) => (
                  <div key={index} className="border-l-4 border-purple-500/30 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-lg">{concern.category}</h4>
                      <div className="flex items-center gap-1">
                        {getImpactIcon(concern.impact)}
                        <span className={`text-sm font-medium ${getImpactColor(concern.impact)}`}>
                          {concern.impact} Auswirkung
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-foreground mb-2">Was bedeutet das?</h5>
                        <p className="text-muted-foreground leading-relaxed">
                          {concern.explanation}
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Was können Sie tun?
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {concern.userAction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Practical Recommendations for Model */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Praktische Empfehlungen
              </CardTitle>
              <CardDescription>
                Konkrete Handlungsempfehlungen für Ihre Investitionsentscheidung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground">
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Human Factors Tab */}
        <TabsContent value="human" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Menschliche Faktoren für {selectedStock}
              </CardTitle>
              <CardDescription>
                Was Experten und der Markt über diese Aktie denken
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.mainConcerns
                  .filter((concern: ConcernData) => concern.category === "Marktmeinung")
                  .map((concern: ConcernData, index: number) => (
                  <div key={index} className="border-l-4 border-green-500/30 pl-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-lg">{concern.category}</h4>
                      <div className="flex items-center gap-1">
                        {getImpactIcon(concern.impact)}
                        <span className={`text-sm font-medium ${getImpactColor(concern.impact)}`}>
                          {concern.impact} Auswirkung
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-foreground mb-2">Was bedeutet das?</h5>
                        <p className="text-muted-foreground leading-relaxed">
                          {concern.explanation}
                        </p>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Was können Sie tun?
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {concern.userAction}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment Summary */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Risiko-Einschätzung Zusammenfassung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Gesamtrisiko für {selectedStock}:</span>
                  <Badge className={getRiskColor(data.riskLevel)} variant="outline">
                    {data.riskLevel}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <div className="text-sm font-medium text-green-600">Niedrig-Mittel</div>
                    <p className="text-xs text-muted-foreground mt-1">Für konservative Anleger geeignet</p>
                  </div>
                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                    <div className="text-sm font-medium text-yellow-600">Mittel-Hoch</div>
                    <p className="text-xs text-muted-foreground mt-1">Erfordert aktive Überwachung</p>
                  </div>
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="text-sm font-medium text-red-600">Sehr Hoch</div>
                    <p className="text-xs text-muted-foreground mt-1">Nur für erfahrene Trader</p>
                  </div>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    Investieren Sie nur Geld, dessen Verlust Sie verschmerzen können. 
                    Diversifizieren Sie immer Ihr Portfolio.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}