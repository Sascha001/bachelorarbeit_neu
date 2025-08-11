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
  const mockData: Record<string, SimplifiedData> = {
    AAPL: {
      overallMessage: "Die KI-Empfehlung für Apple ist relativ verlässlich, aber es gibt einige Unsicherheiten zu beachten.",
      confidenceLevel: 73,
      mainConcerns: [
        {
          category: "Datenqualität",
          explanation: "Die Informationen über Apple sind größtenteils aktuell und zuverlässig. Gelegentlich können Verzögerungen bei Quartalszahlen auftreten.",
          impact: "mittel",
          userAction: "Warten Sie auf die neuesten Quartalsergebnisse, bevor Sie große Investitionen tätigen."
        },
        {
          category: "KI-Modell",
          explanation: "Unser KI-System funktioniert gut für Apple, da das Unternehmen ein vorhersagbares Geschäftsmodell hat.",
          impact: "niedrig", 
          userAction: "Das Modell sollte zuverlässige Prognosen für die nächsten 1-3 Monate liefern."
        },
        {
          category: "Marktmeinung",
          explanation: "Experten sind sich über Apples Zukunft nicht ganz einig. Einige sehen großes Wachstumspotential, andere warnen vor Marktsättigung.",
          impact: "mittel",
          userAction: "Berücksichtigen Sie verschiedene Expertenmeinungen und diversifizieren Sie Ihr Portfolio."
        }
      ],
      recommendations: [
        "Apple gilt als relativ sichere Investition für langfristige Anleger",
        "Beobachten Sie iPhone-Verkaufszahlen und neue Produktankündigungen",
        "Achten Sie auf Entwicklungen im Bereich Services (App Store, iCloud)",
        "Berücksichtigen Sie geopolitische Risiken in Bezug auf China"
      ],
      riskLevel: "Mittel-Niedrig"
    },
    MSFT: {
      overallMessage: "Microsoft zeigt starke Fundamentaldaten, aber die hohe Bewertung schafft Unsicherheit über zukünftige Renditen.",
      confidenceLevel: 55,
      mainConcerns: [
        {
          category: "Datenqualität", 
          explanation: "Microsoft-Daten sind sehr zuverlässig und aktuell. Das Unternehmen veröffentlicht regelmäßig detaillierte Finanzdaten.",
          impact: "niedrig",
          userAction: "Sie können sich auf die verfügbaren Daten verlassen."
        },
        {
          category: "KI-Modell",
          explanation: "Unser Modell hat Schwierigkeiten mit Microsofts sich schnell entwickelndem Cloud-Geschäft und KI-Investitionen.",
          impact: "hoch",
          userAction: "Seien Sie vorsichtig bei kurzfristigen Prognosen. Fokussieren Sie sich auf langfristige Trends."
        },
        {
          category: "Marktmeinung",
          explanation: "Experten sind optimistisch über Microsoft, aber es gibt Bedenken über die hohe Bewertung und Konkurrenz im Cloud-Bereich.",
          impact: "mittel",
          userAction: "Verfolgen Sie Azure-Wachstumszahlen und Konkurrenz mit Amazon AWS."
        }
      ],
      recommendations: [
        "Microsoft profitiert von der KI-Revolution und Cloud-Migration",
        "Hohe Bewertung erfordert kontinuierliches starkes Wachstum", 
        "Achten Sie auf Office 365 und Teams Nutzerzahlen",
        "Regulierungsrisiken im Tech-Sektor beobachten"
      ],
      riskLevel: "Mittel"
    },
    TSLA: {
      overallMessage: "Tesla ist sehr schwer vorherzusagen aufgrund der hohen Volatilität und unvorhersehbaren Faktoren.",
      confidenceLevel: 11,
      mainConcerns: [
        {
          category: "Datenqualität",
          explanation: "Tesla-Daten sind oft widersprüchlich. Elon Musks Tweets und spontane Ankündigungen erschweren die Analyse erheblich.",
          impact: "hoch",
          userAction: "Verlassen Sie sich nicht nur auf automatisierte Analysen. Verfolgen Sie Tesla-News sehr aktiv."
        },
        {
          category: "KI-Modell", 
          explanation: "Unser Modell versagt bei Tesla regelmäßig, da das Unternehmen sich nicht wie traditionelle Autohersteller verhält.",
          impact: "sehr hoch",
          userAction: "Nutzen Sie unsere Empfehlungen nur als einen von vielen Faktoren für Ihre Entscheidung."
        },
        {
          category: "Marktmeinung",
          explanation: "Experten sind extrem gespalten über Tesla - von 'Revolutionary Company' bis 'Overvalued Bubble' ist alles dabei.",
          impact: "sehr hoch", 
          userAction: "Bilden Sie sich eine eigene Meinung basierend auf fundamentalen Faktoren."
        }
      ],
      recommendations: [
        "Tesla ist nur für risikobereite Anleger geeignet",
        "Investieren Sie nur Geld, dessen Verlust Sie verkraften können",
        "Verfolgen Sie Autopilot-Entwicklung und Produktionszahlen genau",
        "Beachten Sie regulatorische Entwicklungen bei autonomem Fahren"
      ],
      riskLevel: "Sehr Hoch"
    }
  }
  
  return mockData[stock] || mockData.AAPL
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

      {/* Main Concerns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Was Sie wissen sollten
          </CardTitle>
          <CardDescription>
            Die wichtigsten Unsicherheitsfaktoren in einfachen Worten erklärt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.mainConcerns.map((concern: ConcernData, index: number) => (
              <div key={index} className="border-l-4 border-primary/20 pl-4 space-y-3">
                <div className="flex items-center gap-2">
                  {concern.category === "Datenqualität" && <Database className="h-5 w-5 text-blue-600" />}
                  {concern.category === "KI-Modell" && <Brain className="h-5 w-5 text-purple-600" />}
                  {concern.category === "Marktmeinung" && <Users className="h-5 w-5 text-green-600" />}
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

      {/* Practical Recommendations */}
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
              <div className="text-center text-muted-foreground p-8">
                <Brain className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <p>Modell-Erklärungen werden hier angezeigt...</p>
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
              <div className="text-center text-muted-foreground p-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <p>Menschliche Faktoren werden hier angezeigt...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}