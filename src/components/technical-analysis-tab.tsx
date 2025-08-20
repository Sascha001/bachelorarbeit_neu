"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'
import { 
  Database, 
  Brain, 
  Users, 
  BarChart3, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Info,
  X
} from "lucide-react"

interface TechnicalAnalysisTabProps {
  selectedStock: string
}

// Mock technical data
interface FeatureImportance {
  name: string;
  weight: number;
}

interface TechnicalData {
  dataValidation: {
    fundamentalData: { score: number; status: string; issues: number };
    newsReliability: { score: number; status: string; sources: number };
    timeSeriesIntegrity: { score: number; status: string; gaps: number };
    tradingVolume: { score: number; status: string; anomalies: number };
  };
  modelMetrics: {
    trainingAccuracy: number;
    validationLoss: number;
    featureImportance: FeatureImportance[];
    predictionInterval: string;
  };
  humanFactors: {
    expertConsensus: number;
    marketSentiment: number;
    analystReliability: number;
    behavioralBias: number;
  };
}

const getTechnicalData = (stock: string): TechnicalData => {
  const mockData: Record<string, TechnicalData> = {
    AAPL: {
      dataValidation: {
        fundamentalData: { score: 92, status: "excellent", issues: 0 },
        newsReliability: { score: 88, status: "good", sources: 15 },
        timeSeriesIntegrity: { score: 95, status: "excellent", gaps: 0 },
        tradingVolume: { score: 85, status: "good", anomalies: 2 }
      },
      modelMetrics: {
        trainingAccuracy: 94.2,
        validationLoss: 0.032,
        featureImportance: [
          { name: "Price Momentum", weight: 0.28 },
          { name: "Volume Trend", weight: 0.22 },
          { name: "Technical Indicators", weight: 0.20 },
          { name: "Market Sentiment", weight: 0.18 },
          { name: "Fundamental Ratios", weight: 0.12 }
        ],
        predictionInterval: "95% Confidence: $165.20 - $191.44"
      },
      humanFactors: {
        expertConsensus: 78,
        marketSentiment: 82,
        analystReliability: 88,
        behavioralBias: 15
      }
    },
    MSFT: {
      dataValidation: {
        fundamentalData: { score: 96, status: "excellent", issues: 0 },
        newsReliability: { score: 91, status: "excellent", sources: 12 },
        timeSeriesIntegrity: { score: 89, status: "good", gaps: 1 },
        tradingVolume: { score: 93, status: "excellent", anomalies: 0 }
      },
      modelMetrics: {
        trainingAccuracy: 91.8,
        validationLoss: 0.045,
        featureImportance: [
          { name: "Fundamental Ratios", weight: 0.32 },
          { name: "Price Momentum", weight: 0.25 },
          { name: "Market Sentiment", weight: 0.20 },
          { name: "Technical Indicators", weight: 0.15 },
          { name: "Volume Trend", weight: 0.08 }
        ],
        predictionInterval: "95% Confidence: $385.15 - $432.78"
      },
      humanFactors: {
        expertConsensus: 85,
        marketSentiment: 89,
        analystReliability: 92,
        behavioralBias: 8
      }
    },
    TSLA: {
      dataValidation: {
        fundamentalData: { score: 75, status: "fair", issues: 3 },
        newsReliability: { score: 68, status: "fair", sources: 8 },
        timeSeriesIntegrity: { score: 82, status: "good", gaps: 2 },
        tradingVolume: { score: 71, status: "fair", anomalies: 5 }
      },
      modelMetrics: {
        trainingAccuracy: 78.5,
        validationLoss: 0.089,
        featureImportance: [
          { name: "Market Sentiment", weight: 0.35 },
          { name: "Volume Trend", weight: 0.28 },
          { name: "Price Momentum", weight: 0.18 },
          { name: "Technical Indicators", weight: 0.12 },
          { name: "Fundamental Ratios", weight: 0.07 }
        ],
        predictionInterval: "95% Confidence: $198.45 - $287.91"
      },
      humanFactors: {
        expertConsensus: 62,
        marketSentiment: 74,
        analystReliability: 71,
        behavioralBias: 28
      }
    }
  }
  
  return mockData[stock] || mockData.AAPL
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "excellent": return "text-green-600 bg-green-500/10"
    case "good": return "text-blue-600 bg-blue-500/10"
    case "fair": return "text-yellow-600 bg-yellow-500/10"
    case "poor": return "text-red-600 bg-red-500/10"
    default: return "text-gray-600 bg-gray-500/10"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "excellent": return <CheckCircle className="h-4 w-4 text-green-600" />
    case "good": return <CheckCircle className="h-4 w-4 text-blue-600" />
    case "fair": return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "poor": return <XCircle className="h-4 w-4 text-red-600" />
    default: return <Clock className="h-4 w-4 text-gray-600" />
  }
}

// Fundamentaldaten parameters with calculated values
interface FundamentalDataParams {
  completeness: { value: number; missingValues: number; totalValues: number };
  timeliness: { value: number; delayDays: number; maxTolerance: number };
  consistency: { value: number; avgDeviation: number; referenceValue: number };
  accuracy: { value: number; deviation: number; officialValue: number };
  stability: { value: number; revisions: number; totalDataPoints: number };
}

const getFundamentalDataParams = (stock: string): FundamentalDataParams => {
  const params: Record<string, FundamentalDataParams> = {
    // AAPL: Score should be 92% => (C + T + K + A + S) / 5 = 0.92
    AAPL: {
      completeness: { value: 0.95, missingValues: 5, totalValues: 100 },        // C = 1 - (5/100) = 0.95
      timeliness: { value: 0.90, delayDays: 3, maxTolerance: 30 },             // T = max(0, 1 - (3/30)) = 0.90  
      consistency: { value: 0.92, avgDeviation: 0.097, referenceValue: 1.21 },  // K = 1 - (0.097/1.21) = 0.92
      accuracy: { value: 0.92, deviation: 0.096, officialValue: 1.20 },        // A = 1 - (0.096/1.20) = 0.92
      stability: { value: 0.91, revisions: 9, totalDataPoints: 100 }           // S = 1 - (9/100) = 0.91
    },
    // MSFT: Score should be 96% => (C + T + K + A + S) / 5 = 0.96  
    MSFT: {
      completeness: { value: 0.98, missingValues: 2, totalValues: 100 },        // C = 1 - (2/100) = 0.98
      timeliness: { value: 0.93, delayDays: 2, maxTolerance: 30 },             // T = max(0, 1 - (2/30)) = 0.93
      consistency: { value: 0.96, avgDeviation: 0.098, referenceValue: 2.45 }, // K = 1 - (0.098/2.45) = 0.96
      accuracy: { value: 0.975, deviation: 0.06, officialValue: 2.40 },        // A = 1 - (0.06/2.40) = 0.975
      stability: { value: 0.965, revisions: 3.5, totalDataPoints: 100 }        // S = 1 - (3.5/100) = 0.965
    },
    // TSLA: Score should be 75% => (C + T + K + A + S) / 5 = 0.75
    TSLA: {
      completeness: { value: 0.85, missingValues: 15, totalValues: 100 },       // C = 1 - (15/100) = 0.85
      timeliness: { value: 0.70, delayDays: 9, maxTolerance: 30 },             // T = max(0, 1 - (9/30)) = 0.70
      consistency: { value: 0.72, avgDeviation: 0.518, referenceValue: 1.85 }, // K = 1 - (0.518/1.85) = 0.72
      accuracy: { value: 0.70, deviation: 0.546, officialValue: 1.82 },        // A = 1 - (0.546/1.82) = 0.70
      stability: { value: 0.73, revisions: 27, totalDataPoints: 100 }          // S = 1 - (27/100) = 0.73
    }
  }
  return params[stock] || params.AAPL
}

// Info box content mapping
const getInfoBoxContent = (metric: string, stock?: string) => {
  const infoContent: Record<string, { title: string; content: string }> = {
    fundamentalData: {
      title: "Fundamentaldaten-Qualität – Technische Dimensionen",
      content: "Die Fundamentaldaten-Qualität wird aus 5 kritischen Parametern berechnet, die direkt die Zuverlässigkeit Ihrer Trading-Entscheidungen beeinflussen."
    },
    newsReliability: {
      title: "Nachrichten-Verlässlichkeit Berechnung", 
      content: "Detaillierte Informationen zur Berechnung der Nachrichten-Verlässlichkeit kommen hier..."
    },
    timeSeriesIntegrity: {
      title: "Zeitreihen-Integrität Berechnung",
      content: "Detaillierte Informationen zur Berechnung der Zeitreihen-Integrität kommen hier..."
    },
    tradingVolume: {
      title: "Handelsvolumen-Verteilung Berechnung",
      content: "Detaillierte Informationen zur Berechnung der Handelsvolumen-Verteilung kommen hier..."
    }
  }
  return infoContent[metric] || { title: "Information", content: "Keine Informationen verfügbar." }
}

// Mathematical Formula Component for Tooltips
const FormulaTooltip = ({ param, stock }: { param: string; stock: string }) => {
  const data = getFundamentalDataParams(stock)
  
  const formulas = {
    completeness: {
      title: `Vollständigkeit (C = ${data.completeness.value})`,
      description: "Sind alle Pflichtfelder verfügbar?",
      formula: "C = 1 - \\frac{\\text{Fehlende Werte}}{\\text{Gesamte erwartete Werte}}",
      calculation: `C = 1 - \\frac{${data.completeness.missingValues}}{${data.completeness.totalValues}} = ${data.completeness.value}`,
      impact: `${data.completeness.missingValues} fehlende Werte reduzieren die Datenqualität um ${((1 - data.completeness.value) * 100).toFixed(1)}%.`
    },
    timeliness: {
      title: `Aktualität (T = ${data.timeliness.value})`,
      description: "Wie zeitnah sind die Daten verfügbar?",
      formula: "T = \\max\\left(0, 1 - \\frac{\\text{Verzögerung in Tagen}}{\\text{Maximaltoleranz}}\\right)",
      calculation: `T = \\max\\left(0, 1 - \\frac{${data.timeliness.delayDays}}{${data.timeliness.maxTolerance}}\\right) = ${data.timeliness.value}`,
      impact: `${data.timeliness.delayDays} Tage Verzögerung reduzieren die Aktualität um ${((1 - data.timeliness.value) * 100).toFixed(1)}%.`
    },
    consistency: {
      title: `Konsistenz (K = ${data.consistency.value})`,
      description: "Stimmen Daten über verschiedene Quellen überein?",
      formula: "K = 1 - \\frac{\\text{Durchschnittliche Abweichung}}{\\text{Referenzwert}}",
      calculation: `K = 1 - \\frac{${data.consistency.avgDeviation}}{${data.consistency.referenceValue}} = ${data.consistency.value}`,
      impact: "Geringe Abweichung zwischen Quellen sorgt für hohe Verlässlichkeit."
    },
    accuracy: {
      title: `Genauigkeit (A = ${data.accuracy.value})`,
      description: "Stimmen Daten mit offiziellen Quellen überein?",
      formula: "A = 1 - \\frac{\\text{Abweichung von offizieller Quelle}}{\\text{Referenzwert}}",
      calculation: `A = 1 - \\frac{${data.accuracy.deviation}}{${data.accuracy.officialValue}} = ${data.accuracy.value}`,
      impact: `${((1 - data.accuracy.value) * 100).toFixed(1)}% Abweichung von SEC-Filings bedeutet moderate Ungenauigkeit.`
    },
    stability: {
      title: `Stabilität (S = ${data.stability.value})`,
      description: "Werden Daten häufig nachträglich korrigiert?",
      formula: "S = 1 - \\frac{\\text{Anzahl Revisionen}}{\\text{Gesamte Anzahl Datenpunkte}}",
      calculation: `S = 1 - \\frac{${data.stability.revisions}}{${data.stability.totalDataPoints}} = ${data.stability.value}`,
      impact: `${data.stability.revisions} nachträgliche Korrekturen reduzieren die Verlässlichkeit um ${((1 - data.stability.value) * 100).toFixed(1)}%.`
    }
  }
  
  const formula = formulas[param as keyof typeof formulas]
  if (!formula) return <div>Keine Informationen verfügbar.</div>
  
  return (
    <div className="space-y-3 max-w-sm">
      <div className="font-semibold text-sm">{formula.title}</div>
      <div className="text-xs text-muted-foreground">{formula.description}</div>
      
      <div className="space-y-2">
        <div className="text-xs font-medium">Formel:</div>
        <div className="bg-white p-2 rounded border">
          <BlockMath math={formula.formula} />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs font-medium">Aktuell:</div>
        <div className="bg-white p-2 rounded border">
          <BlockMath math={formula.calculation} />
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground border-t pt-2">
        <strong>Auswirkung:</strong> {formula.impact}
      </div>
    </div>
  )
}

export function TechnicalAnalysisTab({ selectedStock }: TechnicalAnalysisTabProps) {
  const data = getTechnicalData(selectedStock)
  const [activeInfoBox, setActiveInfoBox] = useState<string | null>(null)
  const [isInfoBoxVisible, setIsInfoBoxVisible] = useState(false)
  
  const handleInfoClick = (metric: string) => {
    if (activeInfoBox === metric) {
      setIsInfoBoxVisible(false)
      setTimeout(() => setActiveInfoBox(null), 300) // Wait for animation
    } else {
      setActiveInfoBox(metric)
      // Small delay to ensure DOM update before animation
      setTimeout(() => setIsInfoBoxVisible(true), 10)
    }
  }

  const closeInfoBox = () => {
    setIsInfoBoxVisible(false)
    setTimeout(() => setActiveInfoBox(null), 300) // Wait for animation
  }
  
  return (
    <TooltipProvider>
      <div className="relative space-y-4">
        <Tabs defaultValue="data" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Datenunsicherheit
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Modellunsicherheit
          </TabsTrigger>
          <TabsTrigger value="human" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Menschliche Unsicherheit
          </TabsTrigger>
        </TabsList>

        {/* Data Uncertainty Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Datenvalidierung & -qualität
              </CardTitle>
              <CardDescription>
                Analyse der Eingangsdaten für die KI-Empfehlung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fundamental Data */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.dataValidation.fundamentalData.status)}
                  <span className="font-medium">Fundamentaldaten</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleInfoClick('fundamentalData')}
                        className="ml-1 p-1 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Für nähere Information klicken Sie auf das Icon</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge className={getStatusColor(data.dataValidation.fundamentalData.status)}>
                  {data.dataValidation.fundamentalData.score}%
                </Badge>
              </div>
              <Progress value={data.dataValidation.fundamentalData.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {data.dataValidation.fundamentalData.issues} Qualitätsprobleme erkannt
              </p>
            </div>

            {/* News Reliability */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.dataValidation.newsReliability.status)}
                  <span className="font-medium">Nachrichten-Verlässlichkeit</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleInfoClick('newsReliability')}
                        className="ml-1 p-1 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Für nähere Information klicken Sie auf das Icon</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge className={getStatusColor(data.dataValidation.newsReliability.status)}>
                  {data.dataValidation.newsReliability.score}%
                </Badge>
              </div>
              <Progress value={data.dataValidation.newsReliability.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {data.dataValidation.newsReliability.sources} vertrauenswürdige Quellen
              </p>
            </div>

            {/* Time Series Integrity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.dataValidation.timeSeriesIntegrity.status)}
                  <span className="font-medium">Zeitreihen-Integrität</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleInfoClick('timeSeriesIntegrity')}
                        className="ml-1 p-1 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Für nähere Information klicken Sie auf das Icon</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge className={getStatusColor(data.dataValidation.timeSeriesIntegrity.status)}>
                  {data.dataValidation.timeSeriesIntegrity.score}%
                </Badge>
              </div>
              <Progress value={data.dataValidation.timeSeriesIntegrity.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {data.dataValidation.timeSeriesIntegrity.gaps} Datenlücken gefunden
              </p>
            </div>

            {/* Trading Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(data.dataValidation.tradingVolume.status)}
                  <span className="font-medium">Handelsvolumen-Verteilung</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => handleInfoClick('tradingVolume')}
                        className="ml-1 p-1 rounded-full hover:bg-muted/50 transition-colors"
                      >
                        <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Für nähere Information klicken Sie auf das Icon</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge className={getStatusColor(data.dataValidation.tradingVolume.status)}>
                  {data.dataValidation.tradingVolume.score}%
                </Badge>
              </div>
              <Progress value={data.dataValidation.tradingVolume.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {data.dataValidation.tradingVolume.anomalies} Volumen-Anomalien
              </p>
            </div>
          </div>
        </CardContent>
          </Card>
        </TabsContent>

        {/* Model Uncertainty Tab */}
        <TabsContent value="model" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Modell-Metriken & Performance
              </CardTitle>
              <CardDescription>
                Technische Details zur KI-Modell-Performance
              </CardDescription>
            </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Model Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {data.modelMetrics.trainingAccuracy}%
                </div>
                <p className="text-sm text-muted-foreground">Trainings-Genauigkeit</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {data.modelMetrics.validationLoss}
                </div>
                <p className="text-sm text-muted-foreground">Validierungsfehler</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm font-medium text-center text-primary">
                  {data.modelMetrics.predictionInterval}
                </div>
                <p className="text-sm text-muted-foreground">Prognoseintervall</p>
              </div>
            </div>

            {/* Feature Importance */}
            <div>
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Feature-Wichtigkeit
              </h4>
              <div className="space-y-3">
                {data.modelMetrics.featureImportance.map((feature: FeatureImportance, index: number) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{feature.name}</span>
                      <span className="font-medium">{(feature.weight * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={feature.weight * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
          </Card>
        </TabsContent>

        {/* Human Uncertainty Tab */}
        <TabsContent value="human" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Menschliche Faktoren & Experteneinschätzung
              </CardTitle>
              <CardDescription>
                Analyse der menschlichen Unsicherheitsfaktoren
              </CardDescription>
            </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Experten-Konsens</span>
                  <span className="font-medium">{data.humanFactors.expertConsensus}%</span>
                </div>
                <Progress value={data.humanFactors.expertConsensus} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Markt-Sentiment</span>
                  <span className="font-medium">{data.humanFactors.marketSentiment}%</span>
                </div>
                <Progress value={data.humanFactors.marketSentiment} className="h-2" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analysten-Verlässlichkeit</span>
                  <span className="font-medium">{data.humanFactors.analystReliability}%</span>
                </div>
                <Progress value={data.humanFactors.analystReliability} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Verhaltens-Bias</span>
                  <span className="font-medium text-red-600">{data.humanFactors.behavioralBias}%</span>
                </div>
                <Progress value={data.humanFactors.behavioralBias} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Niedrigere Werte sind besser
                </p>
              </div>
            </div>
          </div>
            </CardContent>
          </Card>

          {/* Uncertainty Heatmap Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-orange-600" />
                Unsicherheits-Heatmap
              </CardTitle>
              <CardDescription>
                Visuelle Darstellung der Unsicherheitsquellen über Zeit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {/* Heatmap simulation */}
                <div className="text-center font-medium">Mo</div>
                <div className="text-center font-medium">Di</div>
                <div className="text-center font-medium">Mi</div>
                <div className="text-center font-medium">Do</div>
                <div className="text-center font-medium">Fr</div>
                <div className="text-center font-medium">Sa</div>
                <div className="text-center font-medium">So</div>
                
                {/* Week 1 */}
                <div className="h-8 bg-green-500/30 rounded flex items-center justify-center">15%</div>
                <div className="h-8 bg-yellow-500/40 rounded flex items-center justify-center">23%</div>
                <div className="h-8 bg-green-500/20 rounded flex items-center justify-center">12%</div>
                <div className="h-8 bg-yellow-500/50 rounded flex items-center justify-center">28%</div>
                <div className="h-8 bg-red-500/30 rounded flex items-center justify-center">42%</div>
                <div className="h-8 bg-green-500/25 rounded flex items-center justify-center">18%</div>
                <div className="h-8 bg-green-500/15 rounded flex items-center justify-center">9%</div>
                
                {/* Week 2 */}
                <div className="h-8 bg-yellow-500/35 rounded flex items-center justify-center">25%</div>
                <div className="h-8 bg-green-500/30 rounded flex items-center justify-center">16%</div>
                <div className="h-8 bg-red-500/40 rounded flex items-center justify-center">45%</div>
                <div className="h-8 bg-yellow-500/45 rounded flex items-center justify-center">31%</div>
                <div className="h-8 bg-green-500/20 rounded flex items-center justify-center">11%</div>
                <div className="h-8 bg-yellow-500/30 rounded flex items-center justify-center">22%</div>
                <div className="h-8 bg-green-500/25 rounded flex items-center justify-center">17%</div>
              </div>
              <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                <span>Niedrig (0-20%)</span>
                <span>Mittel (21-40%)</span>
                <span>Hoch (41%+)</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>

        {/* Slide-in Info Box */}
        {activeInfoBox && (
          <>
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
              onClick={closeInfoBox}
            />
            
            {/* Info Box sliding from right */}
            <div className={`fixed right-0 top-0 h-full w-96 bg-background border-l shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
              isInfoBoxVisible ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <div className="p-6 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <h3 className="text-lg font-semibold text-foreground">
                    {getInfoBoxContent(activeInfoBox, selectedStock).title}
                  </h3>
                  <button 
                    onClick={closeInfoBox}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {getInfoBoxContent(activeInfoBox, selectedStock).content}
                    </p>
                    
                    {/* Fundamentaldaten detailed parameters */}
                    {activeInfoBox === 'fundamentalData' && (() => {
                      const params = getFundamentalDataParams(selectedStock)
                      const overallScore = ((params.completeness.value + params.timeliness.value + params.consistency.value + params.accuracy.value + params.stability.value) / 5 * 100).toFixed(1)
                      
                      return (
                        <>
                          {/* Overall Score */}
                          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h4 className="font-semibold mb-2 text-primary">Gesamtscore: {overallScore}%</h4>
                            <p className="text-sm text-muted-foreground">
                              Durchschnitt aller 5 Dimensionen für {selectedStock}
                            </p>
                          </div>

                          {/* Parameter Details */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-foreground">Detaillierte Parameter-Aufschlüsselung:</h4>
                            
                            {/* Completeness */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">1. Vollständigkeit (C)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="completeness" stock={selectedStock} />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.completeness.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.completeness.totalValues - params.completeness.missingValues} von {params.completeness.totalValues} Feldern verfügbar
                              </div>
                            </div>

                            {/* Timeliness */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">2. Aktualität (T)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="timeliness" stock={selectedStock} />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.timeliness.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Durchschnittlich {params.timeliness.delayDays} Tage Verzögerung
                              </div>
                            </div>

                            {/* Consistency */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">3. Konsistenz (K)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="consistency" stock={selectedStock} />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.consistency.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Durchschnittliche Abweichung zwischen Quellen: {params.consistency.avgDeviation}
                              </div>
                            </div>

                            {/* Accuracy */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">4. Genauigkeit (A)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="accuracy" stock={selectedStock} />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.accuracy.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Abweichung von SEC-Filings: {params.accuracy.deviation}
                              </div>
                            </div>

                            {/* Stability */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">5. Stabilität (S)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="stability" stock={selectedStock} />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.stability.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.stability.revisions} von {params.stability.totalDataPoints} Datenpunkten revidiert
                              </div>
                            </div>
                          </div>

                          {/* Formula Explanation */}
                          <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                            <h4 className="font-medium mb-4 text-green-700">Gesamtberechnung</h4>
                            
                            <div className="space-y-4">
                              <div className="bg-white p-3 rounded border">
                                <div className="text-center">
                                  <BlockMath math="\\text{Fundamentaldaten-Score} = \\frac{C + T + K + A + S}{5}" />
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded border">
                                <div className="text-center">
                                  <BlockMath math={`\\text{Aktuell} = \\frac{${(params.completeness.value * 100).toFixed(1)} + ${(params.timeliness.value * 100).toFixed(1)} + ${(params.consistency.value * 100).toFixed(1)} + ${(params.accuracy.value * 100).toFixed(1)} + ${(params.stability.value * 100).toFixed(1)}}{5} = ${overallScore}\\%`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                    
                    {/* Other metrics placeholder */}
                    {activeInfoBox !== 'fundamentalData' && (
                      <>
                        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                          <h4 className="font-medium mb-2 text-foreground">Berechnungsdetails</h4>
                          <p className="text-sm text-muted-foreground">
                            Hier werden später detaillierte Informationen zur Berechnung dieser Metrik angezeigt.
                          </p>
                        </div>
                        
                        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                          <h4 className="font-medium mb-2 text-blue-700">Wichtige Faktoren</h4>
                          <p className="text-sm text-muted-foreground">
                            Diese Sektion wird später mit spezifischen Faktoren befüllt, die diese Metrik beeinflussen.
                          </p>
                        </div>
                        
                        <div className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                          <h4 className="font-medium mb-2 text-green-700">Interpretation</h4>
                          <p className="text-sm text-muted-foreground">
                            Anleitung zur Interpretation der Werte und deren Auswirkung auf die Gesamteinschätzung.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="pt-4 mt-4 border-t">
                  <p className="text-xs text-muted-foreground text-center">
                    Detaillierte Berechnungsinformationen für {selectedStock}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}