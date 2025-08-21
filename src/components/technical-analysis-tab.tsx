"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import React, { useState } from "react"
import 'katex/dist/katex.min.css'

// Custom CSS for formula scaling and violet bloom scrollbar
const formulaStyles = `
  .formula-container .katex {
    font-size: 0.9rem !important;
  }
  .formula-container .katex .frac-line {
    border-bottom-width: 0.08em !important;
  }
  .formula-container-small .katex {
    font-size: 0.8rem !important;
  }
  .formula-container-large .katex {
    font-size: 1rem !important;
  }

  /* Violet Bloom Scrollbar Styling */
  .violet-bloom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: hsl(270 95% 75%) hsl(270 20% 98%);
  }

  .violet-bloom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .violet-bloom-scrollbar::-webkit-scrollbar-track {
    background: linear-gradient(180deg, hsl(270 20% 98%) 0%, hsl(270 15% 95%) 100%);
    border-radius: 4px;
  }

  .violet-bloom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, hsl(270 95% 75%) 0%, hsl(280 80% 70%) 50%, hsl(290 75% 65%) 100%);
    border-radius: 4px;
    border: 1px solid hsl(270 60% 85%);
    transition: all 0.3s ease;
  }

  .violet-bloom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, hsl(270 95% 70%) 0%, hsl(280 85% 65%) 50%, hsl(290 80% 60%) 100%);
    border-color: hsl(270 70% 75%);
    transform: scale(1.1);
  }

  .violet-bloom-scrollbar::-webkit-scrollbar-thumb:active {
    background: linear-gradient(180deg, hsl(270 95% 65%) 0%, hsl(280 90% 60%) 50%, hsl(290 85% 55%) 100%);
    border-color: hsl(270 80% 65%);
  }

  .violet-bloom-scrollbar::-webkit-scrollbar-corner {
    background: hsl(270 20% 98%);
  }
`
import { BlockMath } from 'react-katex'
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

// News Reliability Parameters Interface  
interface NewsReliabilityParams {
  sourceReliability: { value: number; totalSources: number; averageReliability: number };
  reputationAccuracy: { value: number; totalNews: number; falseNews: number };
  crossSourceConsensus: { value: number; totalNews: number; confirmedNews: number };
  biasCheck: { value: number; biasIndex: number; maxBiasValue: number };
}

// Time Series Integrity Parameters Interface
interface TimeSeriesIntegrityParams {
  completeness: { value: number; missingTimepoints: number; expectedTimepoints: number };
  outlierFreedom: { value: number; outliers: number; totalObservations: number };
  revisionStability: { value: number; revisedValues: number; totalValues: number };
  continuity: { value: number; gaps: number; totalIntervals: number };
}

const getNewsReliabilityParams = (stock: string): NewsReliabilityParams => {
  const params: Record<string, NewsReliabilityParams> = {
    // AAPL: Score should be 88% => (R + P + K + (1-B)) * weights = 0.88
    // Weights: w1=0.3, w2=0.3, w3=0.25, w4=0.15
    AAPL: {
      sourceReliability: { value: 0.89, totalSources: 15, averageReliability: 0.89 },        // R = 0.89 (Reuters=0.98, Bloomberg=0.95, CNN=0.75, etc.)
      reputationAccuracy: { value: 0.90, totalNews: 100, falseNews: 10 },                   // P = 1 - (10/100) = 0.90
      crossSourceConsensus: { value: 0.85, totalNews: 10, confirmedNews: 8 },               // K = 8/10 = 0.85 (8 von 10 News bestätigt)
      biasCheck: { value: 0.85, biasIndex: 0.15, maxBiasValue: 1.0 }                       // B = 0.15/1.0 = 0.15, so (1-B) = 0.85
    },
    // MSFT: Score should be 91% => (R + P + K + (1-B)) * weights = 0.91
    MSFT: {
      sourceReliability: { value: 0.93, totalSources: 12, averageReliability: 0.93 },       // R = 0.93 (mehr premium sources)
      reputationAccuracy: { value: 0.92, totalNews: 100, falseNews: 8 },                    // P = 1 - (8/100) = 0.92
      crossSourceConsensus: { value: 0.90, totalNews: 10, confirmedNews: 9 },               // K = 9/10 = 0.90
      biasCheck: { value: 0.88, biasIndex: 0.12, maxBiasValue: 1.0 }                       // B = 0.12, so (1-B) = 0.88
    },
    // TSLA: Score should be 68% => (R + P + K + (1-B)) * weights = 0.68
    TSLA: {
      sourceReliability: { value: 0.70, totalSources: 8, averageReliability: 0.70 },        // R = 0.70 (mehr unreliable sources, Twitter hype)
      reputationAccuracy: { value: 0.75, totalNews: 100, falseNews: 25 },                   // P = 1 - (25/100) = 0.75
      crossSourceConsensus: { value: 0.60, totalNews: 10, confirmedNews: 6 },               // K = 6/10 = 0.60 (viel speculation)
      biasCheck: { value: 0.65, biasIndex: 0.35, maxBiasValue: 1.0 }                       // B = 0.35 (high bias), so (1-B) = 0.65
    }
  }
  return params[stock] || params.AAPL
}

const getTimeSeriesIntegrityParams = (stock: string): TimeSeriesIntegrityParams => {
  const params: Record<string, TimeSeriesIntegrityParams> = {
    // AAPL: Score should be 95% => (C + O + R + K) / 4 = 0.95
    AAPL: {
      completeness: { value: 0.98, missingTimepoints: 5, expectedTimepoints: 250 },     // C = 1 - (5/250) = 0.98
      outlierFreedom: { value: 0.988, outliers: 3, totalObservations: 250 },          // O = 1 - (3/250) = 0.988
      revisionStability: { value: 0.992, revisedValues: 2, totalValues: 250 },        // R = 1 - (2/250) = 0.992
      continuity: { value: 1.0, gaps: 0, totalIntervals: 250 }                        // K = 1 - (0/250) = 1.0
    },
    // MSFT: Score should be 89% => (C + O + R + K) / 4 = 0.89  
    MSFT: {
      completeness: { value: 0.96, missingTimepoints: 10, expectedTimepoints: 250 },   // C = 1 - (10/250) = 0.96
      outlierFreedom: { value: 0.92, outliers: 20, totalObservations: 250 },          // O = 1 - (20/250) = 0.92
      revisionStability: { value: 0.896, revisedValues: 26, totalValues: 250 },       // R = 1 - (26/250) = 0.896
      continuity: { value: 0.784, gaps: 54, totalIntervals: 250 }                     // K = 1 - (54/250) = 0.784
    },
    // TSLA: Score should be 82% => (C + O + R + K) / 4 = 0.82
    TSLA: {
      completeness: { value: 0.88, missingTimepoints: 30, expectedTimepoints: 250 },   // C = 1 - (30/250) = 0.88
      outlierFreedom: { value: 0.84, outliers: 40, totalObservations: 250 },          // O = 1 - (40/250) = 0.84
      revisionStability: { value: 0.78, revisedValues: 55, totalValues: 250 },        // R = 1 - (55/250) = 0.78
      continuity: { value: 0.78, gaps: 55, totalIntervals: 250 }                      // K = 1 - (55/250) = 0.78
    }
  }
  return params[stock] || params.AAPL
}

// Info box content mapping
const getInfoBoxContent = (metric: string) => {
  const infoContent: Record<string, { title: string; content: string }> = {
    fundamentalData: {
      title: "Fundamentaldaten-Qualität – Technische Dimensionen",
      content: "Die Fundamentaldaten-Qualität wird aus 5 kritischen Parametern berechnet, die direkt die Zuverlässigkeit Ihrer Trading-Entscheidungen beeinflussen."
    },
    newsReliability: {
      title: "Nachrichten-Verlässlichkeit Berechnung", 
      content: "Die Nachrichten-Verlässlichkeit evaluiert die Qualität und Glaubwürdigkeit von Marktinformationen durch vier zentrale Dimensionen: Source Reliability (Seriosität der Quelle), Reputation Accuracy (historische Trefferquote), Cross-Source Consensus (Bestätigung durch mehrere Quellen) und Bias Check (Verzerrungsanalyse). Diese Parameter werden gewichtet kombiniert, um die Gesamtverlässlichkeit der verwendeten Nachrichtenquellen zu bewerten."
    },
    timeSeriesIntegrity: {
      title: "Zeitreihen-Integrität Berechnung",
      content: "Die Zeitreihen-Integrität bewertet die Qualität und Vollständigkeit von Kursdaten über die Zeit. Sie berücksichtigt vier Hauptdimensionen: Vollständigkeit (ob alle Zeitpunkte vorhanden sind), Ausreißer-Freiheit (Erkennung von Datenfehlern), Revision-Stabilität (Konsistenz historischer Korrekturen) und Kontinuität (gleichmäßige Zeitverteilung ohne Gaps)."
    },
    tradingVolume: {
      title: "Handelsvolumen-Verteilung Berechnung",
      content: `Die Handelsvolumen-Verteilung misst die Qualität und Stabilität des Marktvolumens durch drei kritische Dimensionen:

**1. Konzentration der Marktteilnehmer (S)**
Bewertet, ob das Volumen gleichmäßig über viele Akteure verteilt oder von wenigen dominiert wird.

Herfindahl-Hirschman Index (HHI): HHI = Σ(si²)
mit si = Marktanteil eines Teilnehmers am Gesamtvolumen

Score: S = 1 - HHI
(je kleiner HHI, desto größer die Verteilung)

**2. Anomalous Spikes (A)** 
Erkennt untypische Volumenschübe (z.B. einzelne Zeitpunkte mit extrem hohem Anteil).

Formel: A = 1 - (Anzahl Spike-Zeitpunkte / Gesamtanzahl Zeitpunkte)

**3. Stabilität über die Zeit (T)**
Misst die Volatilität des Handelsvolumens über Perioden.

Formel: T = 1 - (σV / (μV + ε))
mit σV = Standardabweichung, μV = Mittelwert

**Gesamtformel:**
Qvolume = w1·S + w2·A + w3·T

Typische Gewichtung: w1=0.4, w2=0.3, w3=0.3
→ Konzentration (S) hat größten Einfluss auf Marktunsicherheit`
    }
  }
  return infoContent[metric] || { title: "Information", content: "Keine Informationen verfügbar." }
}

// Mathematical Formula Component for Tooltips
const FormulaTooltip = ({ param, stock, type = "fundamental" }: { param: string; stock: string; type?: "fundamental" | "timeSeries" | "newsReliability" }) => {
  const fundamentalData = getFundamentalDataParams(stock)
  const timeSeriesData = getTimeSeriesIntegrityParams(stock)
  const newsReliabilityData = getNewsReliabilityParams(stock)
  
  const fundamentalFormulas = {
    completeness: {
      title: `Vollständigkeit (C = ${fundamentalData.completeness.value})`,
      description: "Sind alle Pflichtfelder verfügbar?",
      formula: "C = 1 - \\frac{\\text{Fehlende Werte}}{\\text{Gesamte erwartete Werte}}",
      calculation: `C = 1 - \\frac{${fundamentalData.completeness.missingValues}}{${fundamentalData.completeness.totalValues}} = ${fundamentalData.completeness.value}`,
      impact: `${fundamentalData.completeness.missingValues} fehlende Werte reduzieren die Datenqualität um ${((1 - fundamentalData.completeness.value) * 100).toFixed(1)}%.`
    },
    timeliness: {
      title: `Aktualität (T = ${fundamentalData.timeliness.value})`,
      description: "Wie zeitnah sind die Daten verfügbar?",
      formula: "T = \\max\\left(0, 1 - \\frac{\\text{Verzögerung in Tagen}}{\\text{Maximaltoleranz}}\\right)",
      calculation: `T = \\max\\left(0, 1 - \\frac{${fundamentalData.timeliness.delayDays}}{${fundamentalData.timeliness.maxTolerance}}\\right) = ${fundamentalData.timeliness.value}`,
      impact: `${fundamentalData.timeliness.delayDays} Tage Verzögerung reduzieren die Aktualität um ${((1 - fundamentalData.timeliness.value) * 100).toFixed(1)}%.`
    },
    consistency: {
      title: `Konsistenz (K = ${fundamentalData.consistency.value})`,
      description: "Stimmen Daten über verschiedene Quellen überein?",
      formula: "K = 1 - \\frac{\\text{Durchschnittliche Abweichung}}{\\text{Referenzwert}}",
      calculation: `K = 1 - \\frac{${fundamentalData.consistency.avgDeviation}}{${fundamentalData.consistency.referenceValue}} = ${fundamentalData.consistency.value}`,
      impact: "Geringe Abweichung zwischen Quellen sorgt für hohe Verlässlichkeit."
    },
    accuracy: {
      title: `Genauigkeit (A = ${fundamentalData.accuracy.value})`,
      description: "Stimmen Daten mit offiziellen Quellen überein?",
      formula: "A = 1 - \\frac{\\text{Abweichung von offizieller Quelle}}{\\text{Referenzwert}}",
      calculation: `A = 1 - \\frac{${fundamentalData.accuracy.deviation}}{${fundamentalData.accuracy.officialValue}} = ${fundamentalData.accuracy.value}`,
      impact: `${((1 - fundamentalData.accuracy.value) * 100).toFixed(1)}% Abweichung von SEC-Filings bedeutet moderate Ungenauigkeit.`
    },
    stability: {
      title: `Stabilität (S = ${fundamentalData.stability.value})`,
      description: "Werden Daten häufig nachträglich korrigiert?",
      formula: "S = 1 - \\frac{\\text{Anzahl Revisionen}}{\\text{Gesamte Anzahl Datenpunkte}}",
      calculation: `S = 1 - \\frac{${fundamentalData.stability.revisions}}{${fundamentalData.stability.totalDataPoints}} = ${fundamentalData.stability.value}`,
      impact: `${fundamentalData.stability.revisions} nachträgliche Korrekturen reduzieren die Verlässlichkeit um ${((1 - fundamentalData.stability.value) * 100).toFixed(1)}%.`
    }
  }

  const timeSeriesFormulas = {
    completeness: {
      title: `Vollständigkeit (C = ${timeSeriesData.completeness.value})`,
      description: "Sind alle erwarteten Zeitpunkte vorhanden?",
      formula: "C = 1 - \\frac{\\text{fehlende Zeitpunkte}}{\\text{gesamte erwartete Zeitpunkte}}",
      calculation: `C = 1 - \\frac{${timeSeriesData.completeness.missingTimepoints}}{${timeSeriesData.completeness.expectedTimepoints}} = ${timeSeriesData.completeness.value}`,
      impact: `${timeSeriesData.completeness.missingTimepoints} fehlende Handelstage von ${timeSeriesData.completeness.expectedTimepoints} reduzieren die Vollständigkeit um ${((1 - timeSeriesData.completeness.value) * 100).toFixed(1)}%.`
    },
    outlierFreedom: {
      title: `Ausreißer-Freiheit (O = ${timeSeriesData.outlierFreedom.value})`,
      description: "Gibt es unplausible Sprünge oder Werte?",
      formula: "O = 1 - \\frac{\\text{Anzahl Ausreißer}}{\\text{Gesamtanzahl Beobachtungen}}",
      calculation: `O = 1 - \\frac{${timeSeriesData.outlierFreedom.outliers}}{${timeSeriesData.outlierFreedom.totalObservations}} = ${timeSeriesData.outlierFreedom.value}`,
      impact: `${timeSeriesData.outlierFreedom.outliers} Ausreißer bei ${timeSeriesData.outlierFreedom.totalObservations} Handelstagen deuten auf Datenfeed-Fehler hin.`
    },
    revisionStability: {
      title: `Revision-Stabilität (R = ${timeSeriesData.revisionStability.value})`,
      description: "Werden historische Zeitreihen später korrigiert?",
      formula: "R = 1 - \\frac{\\text{revidierte Werte}}{\\text{gesamte Werte}}",
      calculation: `R = 1 - \\frac{${timeSeriesData.revisionStability.revisedValues}}{${timeSeriesData.revisionStability.totalValues}} = ${timeSeriesData.revisionStability.value}`,
      impact: `${timeSeriesData.revisionStability.revisedValues} nachträgliche Korrekturen von ${timeSeriesData.revisionStability.totalValues} Werten zeigen Instabilität der Datenquelle.`
    },
    continuity: {
      title: `Kontinuität (K = ${timeSeriesData.continuity.value})`,
      description: "Ist die Serie gleichmäßig über die Zeit verteilt?",
      formula: "K = 1 - \\frac{\\text{Anzahl an Gaps > Intervall}}{\\text{Gesamtanzahl Intervalle}}",
      calculation: `K = 1 - \\frac{${timeSeriesData.continuity.gaps}}{${timeSeriesData.continuity.totalIntervals}} = ${timeSeriesData.continuity.value}`,
      impact: `${timeSeriesData.continuity.gaps} Gaps in der Zeitreihe unterbrechen die Kontinuität der Datenversorgung.`
    }
  }

  const newsReliabilityFormulas = {
    sourceReliability: {
      title: `Source Reliability (R = ${newsReliabilityData.sourceReliability.value})`,
      description: "Gewichtete Zuverlässigkeit der Quellen (Reuters > privater Blog)",
      formula: "R = \\frac{\\sum \\text{Gewichtete Zuverlässigkeit der Quellen}}{\\text{Anzahl Nachrichten}}",
      calculation: `R = \\frac{\\text{Durchschnittliche Quellenreliabilität}}{1} = ${newsReliabilityData.sourceReliability.value}`,
      impact: `${newsReliabilityData.sourceReliability.totalSources} Quellen mit durchschnittlicher Verlässlichkeit von ${(newsReliabilityData.sourceReliability.averageReliability * 100).toFixed(1)}%.`
    },
    reputationAccuracy: {
      title: `Reputation Accuracy (P = ${newsReliabilityData.reputationAccuracy.value})`,
      description: "Historische Trefferquote der Quellen gegen tatsächliche Marktereignisse",
      formula: "P = 1 - \\frac{\\text{Anzahl widerlegter Nachrichten}}{\\text{Gesamtanzahl Nachrichten}}",
      calculation: `P = 1 - \\frac{${newsReliabilityData.reputationAccuracy.falseNews}}{${newsReliabilityData.reputationAccuracy.totalNews}} = ${newsReliabilityData.reputationAccuracy.value}`,
      impact: `${newsReliabilityData.reputationAccuracy.falseNews} von ${newsReliabilityData.reputationAccuracy.totalNews} Nachrichten erwiesen sich als falsch.`
    },
    crossSourceConsensus: {
      title: `Cross-Source Consensus (K = ${newsReliabilityData.crossSourceConsensus.value})`,
      description: "Anteil der von mehreren unabhängigen Quellen bestätigten Nachrichten",
      formula: "K = \\frac{\\text{Anzahl bestätigter Nachrichten}}{\\text{Gesamtanzahl Nachrichten}}",
      calculation: `K = \\frac{${newsReliabilityData.crossSourceConsensus.confirmedNews}}{${newsReliabilityData.crossSourceConsensus.totalNews}} = ${newsReliabilityData.crossSourceConsensus.value}`,
      impact: `${newsReliabilityData.crossSourceConsensus.confirmedNews} von ${newsReliabilityData.crossSourceConsensus.totalNews} wichtigen News wurden von mind. 2 unabhängigen Quellen bestätigt.`
    },
    biasCheck: {
      title: `Bias Check (1-B = ${newsReliabilityData.biasCheck.value})`,
      description: "Einschätzung der Einseitigkeit durch NLP-Sentiment-Analyse",
      formula: "B = \\frac{\\text{Bias-Index}}{\\text{Max-Bias-Wert}}, \\quad \\text{Score} = 1 - B",
      calculation: `B = \\frac{${newsReliabilityData.biasCheck.biasIndex}}{${newsReliabilityData.biasCheck.maxBiasValue}} = ${1 - newsReliabilityData.biasCheck.value}, \\quad \\text{Score} = ${newsReliabilityData.biasCheck.value}`,
      impact: `Bias-Index von ${newsReliabilityData.biasCheck.biasIndex} deutet auf ${newsReliabilityData.biasCheck.biasIndex > 0.3 ? 'starke' : newsReliabilityData.biasCheck.biasIndex > 0.15 ? 'moderate' : 'geringe'} Verzerrung hin.`
    }
  }

  let formula: { title: string; description: string; formula: string; calculation: string; impact: string } | undefined
  
  if (type === "newsReliability") {
    formula = newsReliabilityFormulas[param as keyof typeof newsReliabilityFormulas]
  } else if (type === "timeSeries") {
    formula = timeSeriesFormulas[param as keyof typeof timeSeriesFormulas]
  } else {
    formula = fundamentalFormulas[param as keyof typeof fundamentalFormulas]
  }
  
  if (!formula) return <div>Keine Informationen verfügbar.</div>
  
  return (
    <div className="space-y-3 max-w-sm">
      <div className="font-semibold text-sm">{formula.title}</div>
      <div className="text-xs text-muted-foreground">{formula.description}</div>
      
      <div className="space-y-2">
        <div className="text-xs font-medium">Formel:</div>
        <div className="bg-white p-2 rounded border text-black overflow-hidden formula-container">
          <div className="flex items-center justify-center min-h-[60px]">
            <BlockMath math={formula.formula} />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-xs font-medium">Aktuell:</div>
        <div className="bg-white p-2 rounded border text-black overflow-hidden formula-container-small">
          <div className="flex items-center justify-center min-h-[50px]">
            <BlockMath math={formula.calculation} />
          </div>
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

  // Inject custom CSS for formula scaling
  React.useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = formulaStyles
    document.head.appendChild(styleElement)
    
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])
  
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
                    {getInfoBoxContent(activeInfoBox).title}
                  </h3>
                  <button 
                    onClick={closeInfoBox}
                    className="p-2 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto violet-bloom-scrollbar">
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {getInfoBoxContent(activeInfoBox).content}
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
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                <div className="flex items-center justify-center min-h-[70px]">
                                  <BlockMath math="\\text{Fundamentaldaten-Score} = \\frac{C + T + K + A + S}{5}" />
                                </div>
                              </div>
                              
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-small">
                                <div className="flex items-center justify-center min-h-[60px]">
                                  <BlockMath math={`\\text{Aktuell} = \\frac{${(params.completeness.value * 100).toFixed(1)} + ${(params.timeliness.value * 100).toFixed(1)} + ${(params.consistency.value * 100).toFixed(1)} + ${(params.accuracy.value * 100).toFixed(1)} + ${(params.stability.value * 100).toFixed(1)}}{5} = ${overallScore}\\%`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                    
                    {/* Time Series Integrity Details */}
                    {activeInfoBox === 'timeSeriesIntegrity' && (() => {
                      const params = getTimeSeriesIntegrityParams(selectedStock)
                      const overallScoreNum = (params.completeness.value + params.outlierFreedom.value + params.revisionStability.value + params.continuity.value) / 4 * 100
                      const overallScore = overallScoreNum.toFixed(1)
                      
                      return (
                        <>
                          {/* Overall Score */}
                          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h4 className="font-semibold mb-2 text-primary">Gesamtscore: {overallScore}%</h4>
                            <p className="text-sm text-muted-foreground">
                              Durchschnitt aller 4 Dimensionen für {selectedStock}
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
                                    <FormulaTooltip param="completeness" stock={selectedStock} type="timeSeries" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.completeness.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.completeness.expectedTimepoints - params.completeness.missingTimepoints} von {params.completeness.expectedTimepoints} Zeitpunkten verfügbar
                              </div>
                            </div>

                            {/* Outlier Freedom */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">2. Ausreißer-Freiheit (O)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="outlierFreedom" stock={selectedStock} type="timeSeries" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.outlierFreedom.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.outlierFreedom.totalObservations - params.outlierFreedom.outliers} von {params.outlierFreedom.totalObservations} Beobachtungen ohne Ausreißer
                              </div>
                            </div>

                            {/* Revision Stability */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">3. Revision-Stabilität (R)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="revisionStability" stock={selectedStock} type="timeSeries" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.revisionStability.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.revisionStability.totalValues - params.revisionStability.revisedValues} von {params.revisionStability.totalValues} Werten ohne Revision
                              </div>
                            </div>

                            {/* Continuity */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">4. Kontinuität (K)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="continuity" stock={selectedStock} type="timeSeries" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.continuity.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.continuity.totalIntervals - params.continuity.gaps} von {params.continuity.totalIntervals} Intervallen ohne Gaps
                              </div>
                            </div>
                          </div>

                          {/* Overall Formula */}
                          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                            <h4 className="font-medium mb-2 text-foreground">Berechnung des Gesamtscores</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Durchschnitt aller 4 Parameter mit gleicher Gewichtung:
                            </p>
                            <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-small">
                              <div className="flex items-center justify-center min-h-[60px]">
                                <BlockMath math={`\\text{Aktuell} = \\frac{${(params.completeness.value * 100).toFixed(1)} + ${(params.outlierFreedom.value * 100).toFixed(1)} + ${(params.revisionStability.value * 100).toFixed(1)} + ${(params.continuity.value * 100).toFixed(1)}}{4} = ${overallScore}\\%`} />
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                    
                    {/* News Reliability Details */}
                    {activeInfoBox === 'newsReliability' && (() => {
                      const params = getNewsReliabilityParams(selectedStock)
                      // Weighted calculation: w1=0.3, w2=0.3, w3=0.25, w4=0.15
                      const w1 = 0.3, w2 = 0.3, w3 = 0.25, w4 = 0.15
                      const overallScoreNum = (w1 * params.sourceReliability.value + w2 * params.reputationAccuracy.value + w3 * params.crossSourceConsensus.value + w4 * params.biasCheck.value) * 100
                      const overallScore = overallScoreNum.toFixed(1)
                      
                      return (
                        <>
                          {/* Overall Score */}
                          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <h4 className="font-semibold mb-2 text-primary">Gesamtscore: {overallScore}%</h4>
                            <p className="text-sm text-muted-foreground">
                              Gewichteter Durchschnitt aller 4 Dimensionen für {selectedStock}
                            </p>
                          </div>

                          {/* Parameter Details */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-foreground">Detaillierte Parameter-Aufschlüsselung:</h4>
                            
                            {/* Source Reliability */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">1. Source Reliability (R)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="sourceReliability" stock={selectedStock} type="newsReliability" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.sourceReliability.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.sourceReliability.totalSources} Quellen analysiert, durchschnittliche Verlässlichkeit: {(params.sourceReliability.averageReliability * 100).toFixed(1)}%
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w1 * 100}% (Reuters=0.98, Bloomberg=0.95, CNN=0.75)
                              </div>
                            </div>

                            {/* Reputation Accuracy */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">2. Reputation Accuracy (P)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="reputationAccuracy" stock={selectedStock} type="newsReliability" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.reputationAccuracy.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.reputationAccuracy.falseNews} widerlegte Nachrichten von {params.reputationAccuracy.totalNews} geprüften
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w2 * 100}% - Track Record gegen tatsächliche Marktereignisse
                              </div>
                            </div>

                            {/* Cross-Source Consensus */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">3. Cross-Source Consensus (K)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="crossSourceConsensus" stock={selectedStock} type="newsReliability" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.crossSourceConsensus.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {params.crossSourceConsensus.confirmedNews} von {params.crossSourceConsensus.totalNews} wichtigen News wurden bestätigt
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w3 * 100}% - Bestätigung durch mind. 2 unabhängige Quellen
                              </div>
                            </div>

                            {/* Bias Check */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">4. Bias Check (1-B)</span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button className="p-1 rounded-full hover:bg-muted/50">
                                      <Info className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-lg">
                                    <FormulaTooltip param="biasCheck" stock={selectedStock} type="newsReliability" />
                                  </TooltipContent>
                                </Tooltip>
                                <Badge className="ml-auto">{(params.biasCheck.value * 100).toFixed(1)}%</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Bias-Index: {params.biasCheck.biasIndex} (NLP-Sentiment-Analyse)
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Gewichtung: {w4 * 100}% - Erkennung von Sensationalismus und Pump & Dump
                              </div>
                            </div>
                          </div>

                          {/* Formula Explanation */}
                          <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                            <h4 className="font-medium mb-4 text-green-700">Gesamtformel Nachrichten-Verlässlichkeit</h4>
                            
                            <div className="space-y-4">
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                <div className="flex items-center justify-center min-h-[70px]">
                                  <BlockMath math="Q_{news} = w_1 \\cdot R + w_2 \\cdot P + w_3 \\cdot K + w_4 \\cdot (1-B)" />
                                </div>
                              </div>
                              
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p><strong>R</strong> = Source Reliability, <strong>P</strong> = Reputation Accuracy</p>
                                <p><strong>K</strong> = Cross-Source Consensus, <strong>B</strong> = Bias-Score</p>
                                <p><strong>Gewichte:</strong> w₁={w1}, w₂={w2}, w₃={w3}, w₄={w4}</p>
                              </div>
                              
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-small">
                                <div className="flex items-center justify-center min-h-[60px]">
                                  <BlockMath math={`\\text{Aktuell} = ${w1} \\cdot ${params.sourceReliability.value} + ${w2} \\cdot ${params.reputationAccuracy.value} + ${w3} \\cdot ${params.crossSourceConsensus.value} + ${w4} \\cdot ${params.biasCheck.value} = ${(overallScoreNum/100).toFixed(3)}`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}
                    
                    {/* Trading Volume Distribution Info */}
                    {(() => {
                      if (activeInfoBox !== 'tradingVolume') return null
                      
                      const w1 = 0.4, w2 = 0.3, w3 = 0.3 // Gewichtungen
                      
                      return (
                        <>
                          <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                            <h4 className="font-medium mb-4 text-blue-700">1. Konzentration der Marktteilnehmer (S)</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Bewertet, ob das Handelsvolumen gleichmäßig über viele Akteure verteilt oder von wenigen dominiert wird.
                            </p>
                            
                            <div className="space-y-4">
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                <div className="flex items-center justify-center min-h-[70px]">
                                  <BlockMath math="HHI = \\sum_{i=1}^{N} s_i^2" />
                                </div>
                              </div>
                              
                              <div className="text-xs text-muted-foreground">
                                <p><strong>s_i</strong> = Marktanteil eines Teilnehmers am Gesamtvolumen</p>
                              </div>
                              
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                <div className="flex items-center justify-center min-h-[70px]">
                                  <BlockMath math="S = 1 - HHI" />
                                </div>
                              </div>
                              
                              <div className="text-xs text-muted-foreground">
                                <p>Je kleiner HHI, desto größer die Verteilung, desto besser der Score</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                            <h4 className="font-medium mb-4 text-yellow-700">2. Anomalous Spikes (A)</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Erkennt untypische Volumenschübe (z.B. einzelne Zeitpunkte mit extrem hohem Anteil).
                            </p>
                            
                            <div className="space-y-4">
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                <div className="flex items-center justify-center min-h-[70px]">
                                  <BlockMath math="A = 1 - \\frac{\\text{Anzahl Spike-Zeitpunkte}}{\\text{Gesamtanzahl Zeitpunkte}}" />
                                </div>
                              </div>
                              
                              <div className="text-xs text-muted-foreground">
                                <p>Spike = Zeitpunkt mit Volumen &gt; k-facher Median des rollierenden Fensters</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                            <h4 className="font-medium mb-4 text-purple-700">3. Stabilität über die Zeit (T)</h4>
                            <p className="text-sm text-muted-foreground mb-4">
                              Misst die Volatilität des Handelsvolumens über Perioden (Coefficient of Variation).
                            </p>
                            
                            <div className="space-y-4">
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                <div className="flex items-center justify-center min-h-[70px]">
                                  <BlockMath math="T = 1 - \\frac{\\sigma_V}{\\mu_V + \\epsilon}" />
                                </div>
                              </div>
                              
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p><strong>σ_V</strong> = Standardabweichung des Volumens</p>
                                <p><strong>μ_V</strong> = Mittelwert des Volumens</p>
                                <p><strong>ε</strong> = kleine Konstante für Sicherheit bei sehr kleinen Volumen</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                            <h4 className="font-medium mb-4 text-green-700">Gesamtformel</h4>
                            
                            <div className="space-y-4">
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-large">
                                <div className="flex items-center justify-center min-h-[70px]">
                                  <BlockMath math="Q_{volume} = w_1 \\cdot S + w_2 \\cdot A + w_3 \\cdot T" />
                                </div>
                              </div>
                              
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p><strong>Typische Gewichtung:</strong> w₁={w1}, w₂={w2}, w₃={w3}</p>
                                <p><strong>Begründung:</strong> Konzentration (S) hat größten Einfluss auf Marktunsicherheit</p>
                              </div>
                              
                              <div className="bg-white p-3 rounded border text-black overflow-hidden formula-container-small">
                                <div className="flex items-center justify-center min-h-[60px]">
                                  <BlockMath math={`Q_{volume} = ${w1} \\cdot S + ${w2} \\cdot A + ${w3} \\cdot T`} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })()}

                    {/* Other metrics placeholder */}
                    {activeInfoBox !== 'fundamentalData' && activeInfoBox !== 'timeSeriesIntegrity' && activeInfoBox !== 'newsReliability' && activeInfoBox !== 'tradingVolume' && (
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