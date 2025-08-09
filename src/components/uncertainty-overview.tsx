"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Database, Brain, Users } from "lucide-react"

interface UncertaintyOverviewProps {
  selectedStock: string
}

// Mock data - in real app this would come from API
const getUncertaintyData = (stock: string) => {
  const mockData: Record<string, {
    totalUncertainty: number;
    dataUncertainty: number;
    modelUncertainty: number;
    humanUncertainty: number;
    recommendation: string;
    confidenceLevel: string;
  }> = {
    AAPL: {
      totalUncertainty: 73,
      dataUncertainty: 50, // 50% of total uncertainty
      modelUncertainty: 30, // 30% of total uncertainty  
      humanUncertainty: 20, // 20% of total uncertainty
      recommendation: "HOLD",
      confidenceLevel: "NIEDRIG"
    },
    MSFT: {
      totalUncertainty: 45,
      dataUncertainty: 40,
      modelUncertainty: 35,
      humanUncertainty: 25,
      recommendation: "BUY",
      confidenceLevel: "MITTEL"
    },
    TSLA: {
      totalUncertainty: 89,
      dataUncertainty: 60,
      modelUncertainty: 25,
      humanUncertainty: 15,
      recommendation: "SELL",
      confidenceLevel: "SEHR NIEDRIG"
    }
  }
  
  return mockData[stock] || mockData.AAPL
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