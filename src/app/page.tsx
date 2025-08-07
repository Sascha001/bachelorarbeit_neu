import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-border/50">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 violet-bloom-hover rounded-md p-2" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
          {/* Top 4 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Portfolio Wert */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-6 violet-bloom-card">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Portfolio Wert</p>
                <p className="text-3xl font-bold text-foreground">€127.432,50</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">↗ +3.34%</span>
                </div>
                <p className="text-xs text-muted-foreground">Trending up today ↗</p>
                <p className="text-xs text-primary font-medium">Performance heute</p>
              </div>
            </div>

            {/* Aktive Positionen */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-6 violet-bloom-card">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Aktive Positionen</p>
                <p className="text-3xl font-bold text-foreground">24</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">+8 neu</span>
                </div>
                <p className="text-xs text-muted-foreground">8 neue Empfehlungen 📊</p>
                <p className="text-xs text-primary font-medium">KI-Signale aktiv</p>
              </div>
            </div>

            {/* KI Vertrauen */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-6 violet-bloom-card">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">KI Vertrauen</p>
                <p className="text-3xl font-bold text-foreground">87%</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full">🔒 Hoch</span>
                </div>
                <p className="text-xs text-muted-foreground">Starke KI Konfidenz 🎯</p>
                <p className="text-xs text-primary font-medium">Durchschnittliche Sicherheit</p>
              </div>
            </div>

            {/* Unsicherheits-Score */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-6 violet-bloom-card">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Unsicherheits-Score</p>
                <p className="text-3xl font-bold text-foreground">Medium</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-full">⚠ 3 Alerts</span>
                </div>
                <p className="text-xs text-muted-foreground">3 Risiko-Alerts ⚠</p>
                <p className="text-xs text-primary font-medium">Überwachung aktiv</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Aktuelle KI-Empfehlungen */}
            <div className="lg:col-span-2 bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-6 violet-bloom-card">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Aktuelle KI-Empfehlungen</h3>
                  <p className="text-sm text-muted-foreground">Neueste Trading-Signale mit Unsicherheitsanalyse</p>
                </div>
                
                <div className="space-y-4">
                  {/* AAPL */}
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold">AAPL</span>
                      <span className="bg-green-500/10 text-green-600 text-sm px-2 py-1 rounded">KAUFEN</span>
                      <span className="text-muted-foreground">$178.32</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">92% Konfidenz</p>
                        <p className="text-xs text-green-600">Niedrig Unsicherheit</p>
                      </div>
                      <button className="text-primary hover:text-primary/80 text-sm">👁 Details</button>
                    </div>
                  </div>

                  {/* TSLA */}
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold">TSLA</span>
                      <span className="bg-red-500/10 text-red-600 text-sm px-2 py-1 rounded">VERKAUFEN</span>
                      <span className="text-muted-foreground">$242.68</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">78% Konfidenz</p>
                        <p className="text-xs text-yellow-600">Mittel Unsicherheit</p>
                      </div>
                      <button className="text-primary hover:text-primary/80 text-sm">👁 Details</button>
                    </div>
                  </div>

                  {/* NVDA */}
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold">NVDA</span>
                      <span className="bg-blue-500/10 text-blue-600 text-sm px-2 py-1 rounded">HALTEN</span>
                      <span className="text-muted-foreground">$459.12</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">65% Konfidenz</p>
                        <p className="text-xs text-red-600">Hoch Unsicherheit</p>
                      </div>
                      <button className="text-primary hover:text-primary/80 text-sm">👁 Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Unsicherheits-Quellen */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-6 violet-bloom-card">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Unsicherheits-Quellen</h3>
                  <p className="text-sm text-muted-foreground">Analyse der verschiedenen Unsicherheitsfaktoren</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">Modell-Unsicherheit</span>
                    <div className="ml-auto">
                      <div className="w-16 h-2 bg-blue-500/20 rounded-full">
                        <div className="w-1/4 h-full bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">25%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">Daten-Unsicherheit</span>
                    <div className="ml-auto">
                      <div className="w-16 h-2 bg-yellow-500/20 rounded-full">
                        <div className="w-1/3 h-full bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">35%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Experten-Einschätzung</span>
                    <div className="ml-auto">
                      <div className="w-16 h-2 bg-green-500/20 rounded-full">
                        <div className="w-2/12 h-full bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">15%</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium mb-2">Gesamt-Unsicherheit</p>
                    <div className="w-full h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
                    <p className="text-center text-sm text-muted-foreground mt-1">Mittel</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risiko-Management */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-6 violet-bloom-card">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Risiko-Management</h3>
                  <p className="text-sm text-muted-foreground">Aktuelle Warnungen und Empfehlungen</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Hohe Volatilität erkannt</p>
                      <p className="text-xs text-muted-foreground">TSLA zeigt ungewöhnliche Kursbewegungen</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Datenqualität-Warnung</p>
                      <p className="text-xs text-muted-foreground">Verzögerung bei Realtime-Daten für NVDA</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Portfolio ausbalanciert</p>
                      <p className="text-xs text-muted-foreground">Diversifikation innerhalb der Zielwerte</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aktivitäts-Feed */}
            <div className="bg-gradient-to-br from-card via-card to-primary/5 border border-primary/20 rounded-xl p-6 violet-bloom-card">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Aktivitäts-Feed</h3>
                  <p className="text-sm text-muted-foreground">Letzte Trading-Aktivitäten und KI-Updates</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">AAPL Position eröffnet</p>
                      <p className="text-xs text-muted-foreground">vor 15 Minuten • Kauforder ausgeführt</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">KI-Modell aktualisiert</p>
                      <p className="text-xs text-muted-foreground">vor 32 Minuten • Neue Gewichtungen aktiv</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Markt-Anomalie erkannt</p>
                      <p className="text-xs text-muted-foreground">vor 1 Stunde • Erhöhte Überwachung aktiv</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Stop-Loss ausgelöst</p>
                      <p className="text-xs text-muted-foreground">vor 2 Stunden • META Position geschlossen</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
