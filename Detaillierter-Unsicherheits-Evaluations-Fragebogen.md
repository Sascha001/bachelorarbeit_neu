# Detaillierter Evaluations-Fragebogen: Unsicherheitsvisualisierung in KI-Trading-Systemen

## Hinweis zur Teilnahme

Vielen Dank, dass Sie an dieser Evaluation teilnehmen.

Ihre Angaben werden ausschließlich im Rahmen meiner Bachelorarbeit an der [Name der Hochschule] verwendet.

Die Teilnahme ist freiwillig, die Daten werden anonym erhoben und nicht an Dritte weitergegeben.

Sie können die Befragung jederzeit ohne Angabe von Gründen abbrechen.

Mit Ihrer Teilnahme erklären Sie sich einverstanden, dass Ihre Antworten in die Analyse meiner Bachelorarbeit einfließen.

## Informationen zum Artefakt

Das in dieser Arbeit entwickelte Artefakt dient der Visualisierung von KI-Handelsempfehlungen. Ziel ist es, die verborgenen Unsicherheiten hinter den Empfehlungen darzustellen und den Nutzern dadurch eine reflektiertere Entscheidungsfindung zu ermöglichen.

Dabei werden drei Dimensionen der Unsicherheit verdeutlicht:

**Datenunsicherheit**

**Modellunsicherheit**

**Menschliche Unsicherheit**

🔎 **Hinweis:** Alle im Prototyp verwendeten Daten sind Dummy-Daten. Sie können also Werte enthalten, die in der Realität nicht auftreten würden. Das ist bewusst so gewählt, da hier nicht die realen Börsendaten, sondern die Darstellung von Unsicherheit im Vordergrund steht.

Das Artefakt umfasst vier Seiten:

- Dashboard
- Depotübersicht & Performance
- Validierung markierter Trades
- Unsicherheitsanalyse (Kernstück)

## Leitfaden zur Nutzung

**Info-Icons:** Bei Hover oder Klick erscheinen Zusatzinformationen.

**Zugänge zur Unsicherheitsanalyse (drei Wege):**
- Über die Suchleiste im Header
- Über die aktuelle KI-Empfehlung im Dashboard
- Über Statistik → Unsicherheitsanalyse

Innerhalb der Unsicherheitsanalyse können Sie sowohl eine technische Analyse als auch eine vereinfachte Analyse betrachten.

Am Ende der Seite haben Sie die Möglichkeit, eine Aktie zu kaufen oder zu verkaufen – bitte probieren Sie diese Funktion ebenfalls aus.

Im Anschluss möchte ich Sie bitten, den Fragebogen auszufüllen, um das Frontend-Design und die Nutzerfreundlichkeit des Artefakts zu bewerten.

**Vielen Dank für Ihre Unterstützung!** 🙏

---

## Einleitung zum Fragebogen
Dieser Fragebogen konzentriert sich speziell auf die **Wahrnehmung und Interpretation von Unsicherheitsvisualisierungen** in KI-basierten Trading-Empfehlungen. Ihr Feedback ist entscheidend für das Verständnis, wie Experten Unsicherheit visuell verarbeiten und für Entscheidungen nutzen.

**Fokus:** Kognitive Verarbeitung von Unsicherheitsinformationen  
**Dauer:** 45-50 Minuten  
**Methodik:** Think-Aloud Protokoll + detaillierte Wahrnehmungsanalyse

---

## Teil A: Vorab-Einschätzung zu Unsicherheit

### A1. Unsicherheits-Präferenzen
**Wie gehen Sie normalerweise mit Unsicherheit in Trading-Entscheidungen um?**
- [ ] Ich vermeide unsichere Positionen komplett
- [ ] Ich reduziere Positionsgrößen bei Unsicherheit
- [ ] Ich nutze Unsicherheit als zusätzliche Information
- [ ] Ich ignoriere Unsicherheit und fokussiere auf Rendite
- [ ] Ich hedge gezielt gegen identifizierte Unsicherheiten

### A2. Informationsbedarf
**Welche Art von Unsicherheitsinformation ist für Sie am wertvollsten?**
- [ ] Numerische Konfidenzwerte (z.B. 85% Sicherheit)
- [ ] Qualitative Einschätzungen (niedrig/mittel/hoch)
- [ ] Visuelle Darstellungen (Ampelfarben, Balken)
- [ ] Detaillierte Aufschlüsselungen nach Faktoren
- [ ] Historische Vergleiche (ähnliche Situationen)

### A3. Vertrauen in KI-Systeme
**Wie wichtig ist Transparenz von KI-Empfehlungen für Ihr Vertrauen?**

*Skala: 1 = gar nicht wichtig, 5 = extrem wichtig*
- [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

**Kommentar:** ________________________________________________

---

## Teil B: Erste Unsicherheits-Wahrnehmung

*Nach der ersten Betrachtung der Unsicherheits-Overview*

### B1. Spontane Reaktion
**Was war Ihr erster Gedanke beim Anblick der Gesamtunsicherheit?**

________________________________________________

________________________________________________

### B2. 3-Dimensionale Aufteilung
**Die Unsicherheit wird in drei Dimensionen aufgeteilt: Daten (blau), Modell (lila), Menschlich (grün).**

**Ist diese Aufteilung für Sie logisch und verständlich?**
- [ ] Sehr verständlich - sofort klar
- [ ] Verständlich nach kurzer Überlegung  
- [ ] Teilweise verständlich - einige Fragen bleiben
- [ ] Verwirrend - schwer zu unterscheiden
- [ ] Völlig unverständlich

**Welche Dimension finden Sie am wichtigsten für Trading-Entscheidungen?**
- [ ] Daten-Unsicherheit (Qualität der verfügbaren Informationen)
- [ ] Modell-Unsicherheit (Vertrauen in die KI-Vorhersage)
- [ ] Menschliche Unsicherheit (Expertenmeinungen, Marktpsychologie)
- [ ] Alle gleich wichtig
- [ ] Kommt auf die Marktlage an

**Begründung:** ________________________________________________

### B3. Farbkodierung & Visuelle Gestaltung
**Die Farben kommunizieren Unsicherheitslevel (grün=sicher, orange=unsicher, rot=sehr unsicher).**

**Ist die Farblogik intuitiv?**
- [ ] Ja, sofort verständlich
- [ ] Größtenteils ja, mit kleinen Verbesserungsmöglichkeiten
- [ ] Teilweise - einige Farben sind verwirrend
- [ ] Nein, die Farbauswahl ist problematisch
- [ ] Komplett kontraintuitiv

**Welche visuellen Elemente helfen Ihnen am meisten beim Verständnis?**
*Mehrfachauswahl möglich*
- [ ] Progress-Balken (zeigen Unsicherheitslevel)
- [ ] Numerische Prozent-Werte
- [ ] Farbkodierung (grün/orange/rot)
- [ ] Textuelle Beschreibungen (SICHER/UNSICHER)
- [ ] Icons (Database, Brain, Users)
- [ ] Badges mit Empfehlungen

---

## Teil C: Detailanalyse der Unsicherheitsdimensionen

*Nach der Exploration der technischen Analyse*

### C1. Daten-Unsicherheit (4 Subdimensionen)

**Fundamentaldaten - Zeitreihen - Nachrichten - Handelsvolumen**

**Können Sie die 4 Datenunsicherheits-Aspekte klar voneinander unterscheiden?**
- [ ] Ja, alle 4 sind klar abgrenzbar
- [ ] 3 sind klar, 1 ist unklar: _______________
- [ ] 2 sind klar, 2 sind unklar: _______________
- [ ] Nur 1 ist klar: _______________
- [ ] Alle 4 verschwimmen ineinander

**Welcher Datenaspekt ist für Sie am relevantesten?**
- [ ] Fundamentaldaten (Unternehmenszahlen, Bilanzen)
- [ ] Zeitreihen-Integrität (Kursverlauf, technische Daten)
- [ ] Nachrichten-Verlässlichkeit (News-Qualität, Bias)
- [ ] Handelsvolumen-Verteilung (Marktstruktur, Liquidität)

**Begründung:** ________________________________________________

### C2. Modell-Unsicherheit (ChatGPT Framework - 5 Dimensionen)

**Die 5 KI-Unsicherheitsaspekte: Epistemisch, Aleatorisch, Overfitting, Robustheit, Erklärung**

**Wie empfinden Sie die mathematische Komplexität?**
- [ ] Perfekt - hilft beim Verständnis der KI-Logik
- [ ] Angemessen - zeigt Seriosität und Fundament
- [ ] Zu komplex - überfordert mich als Nutzer
- [ ] Unnötig - Ergebnisse reichen, Details sind überflüssig
- [ ] Abschreckend - macht das System unnutzbar

**Welcher KI-Unsicherheitsaspekt ist für Sie am verständlichsten?**
- [ ] Epistemische Unsicherheit (Modellwissen/Trainingsdaten)
- [ ] Aleatorische Unsicherheit (Markt-Zufälligkeit/Volatilität)
- [ ] Overfitting-Risiko (Generalisierungsfähigkeit)
- [ ] Robustheit (Stabilität bei kleinen Änderungen)
- [ ] Erklärungs-Konsistenz (Nachvollziehbarkeit)

### C3. KaTeX Formeln & mathematische Transparenz
**Die mathematischen Formeln werden als KaTeX-Visualisierungen angezeigt.**

**Wie wirken sich die Formeln auf Ihr Vertrauen aus?**
- [ ] Erhöhen Vertrauen erheblich - zeigt wissenschaftliche Fundierung
- [ ] Erhöhen Vertrauen leicht - gut dass Berechnung transparent ist
- [ ] Neutral - weder positiv noch negativ
- [ ] Verringern Vertrauen leicht - zu akademisch/theoretisch
- [ ] Verringern Vertrauen erheblich - wirkt überkompliziert

**Nutzen Sie die mathematischen Tooltips/Erklärungen?**
- [ ] Ja, regelmäßig - sie helfen beim Verständnis
- [ ] Gelegentlich - bei besonderem Interesse
- [ ] Selten - nur wenn verwirrt
- [ ] Nie - zu kompliziert/zeitaufwändig
- [ ] Nie - störend beim Workflow

### C4. Menschliche Unsicherheit
**Expertenmeinungen, Marktpsychologie, Sentiment-Faktoren**

**Ist die Integration menschlicher Faktoren in die Unsicherheitsanalyse sinnvoll?**
- [ ] Sehr sinnvoll - Menschen sind der Unsicherheitsfaktor #1
- [ ] Sinnvoll - ergänzt die technischen Aspekte gut
- [ ] Teilweise sinnvoll - aber schwer messbar
- [ ] Wenig sinnvoll - zu subjektiv/unzuverlässig
- [ ] Unsinnig - verwässert die objektive Analyse

---

## Teil D: Aktienspezifische Unsicherheitsmuster

### D1. Realitätsnähe der Unterschiede
**Sie haben verschiedene Aktien betrachtet (z.B. TSLA vs. AAPL vs. JNJ).**

**Spiegeln die unterschiedlichen Unsicherheitslevel realistische Marktbedingungen wider?**

**TSLA (Sehr Unsicher - 43-47%):**
- [ ] Sehr realistisch - TSLA ist bekannt volatil
- [ ] Größtenteils realistisch - leichte Über-/Untertreibung
- [ ] Teilweise realistisch - einige Aspekte fragwürdig
- [ ] Unrealistisch - zu hoch/niedrig eingeschätzt
- [ ] Kann ich nicht beurteilen

**JNJ (Sicher - 14-20%):**
- [ ] Sehr realistisch - stabile Pharma-Werte
- [ ] Größtenteils realistisch - leichte Über-/Untertreibung
- [ ] Teilweise realistisch - einige Aspekte fragwürdig
- [ ] Unrealistisch - zu hoch/niedrig eingeschätzt
- [ ] Kann ich nicht beurteilen

### D2. Vergleichbarkeit und Ranking
**Können Sie basierend auf den Unsicherheitsvisualisierungen ein mentales Ranking verschiedener Aktien erstellen?**
- [ ] Ja, sehr einfach - klare Hierarchie erkennbar
- [ ] Ja, mit etwas Überlegung machbar
- [ ] Schwierig - zu viele Variable zu beachten
- [ ] Nein, zu komplex für Vergleiche
- [ ] Nein, jede Aktie ist zu individuell

### D3. Unsicherheits-Schwellenwerte
**Das System empfiehlt bei >40% Gesamtunsicherheit automatisch "HOLD" (zu unsicher für Trading).**

**Ist diese 40%-Schwelle sinnvoll?**
- [ ] Ja, sehr konservativ und sicherheitsorientiert
- [ ] Ja, angemessen für die meisten Trader
- [ ] Zu niedrig - erst ab 50-60% sollte HOLD empfohlen werden  
- [ ] Zu hoch - bereits ab 30% ist Vorsicht geboten
- [ ] Sollte individuell einstellbar sein

**Bei welchem Unsicherheitslevel würden SIE persönlich nicht mehr traden?**
- [ ] Bereits ab 20% - nur sehr sichere Positionen
- [ ] Ab 30% - moderate Risikobereitschaft
- [ ] Ab 40% - wie das System vorschlägt
- [ ] Ab 50% - höhere Risikobereitschaft
- [ ] Ab 60%+ - nur bei extremer Unsicherheit stoppen

---

## Teil E: Vereinfachte vs. Technische Ansicht

### E1. Ansichts-Präferenz
**Nach dem Vergleich beider Ansichten:**

**Welche bevorzugen Sie für Ihre tägliche Arbeit?**
- [ ] Eindeutig die technische Ansicht - Details sind wichtig
- [ ] Tendenziell die technische Ansicht - aber gelegentlich vereinfacht
- [ ] Beide gleich - je nach Situation/Zeitdruck
- [ ] Tendenziell die vereinfachte Ansicht - aber gelegentlich Details
- [ ] Eindeutig die vereinfachte Ansicht - Übersicht ist wichtiger

### E2. Informationsverlust
**Verliert die vereinfachte Ansicht wichtige Informationen?**
- [ ] Nein - alle relevanten Infos sind erhalten
- [ ] Minimal - vernachlässigbare Details gehen verloren
- [ ] Teilweise - einige wichtige Nuancen fehlen
- [ ] Erheblich - zu viele Details vereinfacht
- [ ] Ja - wird praktisch unbrauchbar

### E3. Zielgruppen-Eignung
**Für wen ist welche Ansicht geeignet?**

**Technische Ansicht geeignet für:**
*Mehrfachauswahl möglich*
- [ ] Quantitative Analysten
- [ ] Professionelle Trader (>5 Jahre Erfahrung)
- [ ] Risk Manager
- [ ] Algorithmic Trading Entwickler
- [ ] Research Analysten
- [ ] Compliance/Aufsicht
                                                    //Hier nochmal überdenken die zwei Fragen
**Vereinfachte Ansicht geeignet für:**
*Mehrfachauswahl möglich*
- [ ] Privatanleger mit Trading-Erfahrung
- [ ] Portfolio Manager (Überblick)
- [ ] Junior Trader/Analysten
- [ ] Wealth Manager (Kundengespräche)
- [ ] Management/Entscheider
- [ ] Compliance/Aufsicht

---

## Teil F: Weitere Frontend-Komponenten & Unsicherheitsintegration

### F1. Dashboard & Randomisierungs-Feature
**Sie haben das Dashboard mit den "Aktuellen KI-Empfehlungen" und dem Randomisierungs-Button erkundet.**

**Wie bewerten Sie die kategorisierte Darstellung der Empfehlungen (Sehr Sicher → Sehr Unsicher)?**
- [ ] Sehr nützlich - sofortiger Überblick über Unsicherheitsspektrum
- [ ] Nützlich - gute Orientierung für weitere Analyse
- [ ] Teilweise nützlich - zu vereinfacht dargestellt
- [ ] Wenig nützlich - Kategorien sind nicht aussagekräftig
- [ ] Unnötig - Details sind wichtiger als Kategorien

**Der "Neue Empfehlungen generieren" Button zeigt verschiedene Aktien für Quick-Insights:**
**Ist dieses Feature wertvoll für die Unsicherheitserkundung?**
- [ ] Sehr wertvoll - ermöglicht schnelle Vergleiche verschiedener Unsicherheitslevel
- [ ] Wertvoll - guter Einstiegspunkt vor detaillierter Analyse
- [ ] Neutral - nette Funktion aber nicht entscheidend
- [ ] Wenig wertvoll - zu oberflächlich für fundierte Entscheidungen
- [ ] Störend - lenkt von systematischer Analyse ab

**Kommentar zur Dashboard-Unsicherheitsvisualisierung:**
________________________________________________

### F2. Depot-Unsicherheits-Integration
**Das Depot zeigt Portfolio-Wert, Positionen und Performance, aber KEINE Unsicherheitsmetriken.**

**Sollte das Portfolio eine Gesamt-Unsicherheit basierend auf allen Positionen anzeigen?**
- [ ] Ja, definitiv - Gesamt-Portfolio-Risiko ist entscheidend
- [ ] Ja, als zusätzliche Metrik - ergänzt Performance-Daten
- [ ] Möglicherweise - abhängig von der Berechnungsmethode
- [ ] Eher nicht - zu komplex für Depot-Übersicht
- [ ] Nein - Unsicherheit gehört in die Einzelaktien-Analyse

**Wie sollte Portfolio-Unsicherheit berechnet werden?**
*Mehrfachauswahl möglich*
- [ ] Gewichteter Durchschnitt der Einzelposition-Unsicherheiten
- [ ] Korrelations-adjustierte Portfolio-Unsicherheit
- [ ] Höchste Einzelposition-Unsicherheit als Maßstab
- [ ] Separate Anzeige pro Anlageklasse (Aktien/ETFs/Anleihen)
- [ ] Zeit-Horizon-basierte Unsicherheit (kurzfristig vs. langfristig)

**Wären Unsicherheits-Warnungen für Einzelpositionen nützlich?**
- [ ] Ja - Alert bei Überschreitung von Unsicherheits-Schwellen
- [ ] Ja - Farbkodierung der Positionen nach Unsicherheit
- [ ] Teilweise - nur für kritische Überschreitungen
- [ ] Nein - überfrachtet die Depot-Übersicht
- [ ] Nein - gehört nicht in diese Ansicht

### F3. Validierungsseite & Feedback-Loop Integration
**Das System hat eine Validierungsseite für nachträgliches Modell-Training durch User-Feedback.**

**Wie wichtig ist dieser "Assessment → Feedback → Training" Workflow für die Unsicherheitsvisualisierung?**
- [ ] Sehr wichtig - Unsicherheit muss durch Realitäts-Checks kalibriert werden
- [ ] Wichtig - verbessert die Genauigkeit der Unsicherheitsmetriken
- [ ] Teilweise wichtig - nützlich aber nicht entscheidend
- [ ] Wenig wichtig - Unsicherheitsvisualisierung sollte objektiv bleiben
- [ ] Unwichtig - Feedback verfälscht die mathematischen Grundlagen

**Sollte die Validierung auch Unsicherheits-spezifisches Feedback sammeln?**
*Beispiel: "War die angezeigte Unsicherheit angemessen für das tatsächliche Marktergebnis?"*
- [ ] Ja, definitiv - Unsicherheitskalibrierung ist essentiell
- [ ] Ja, als zusätzliche Metrik - ergänzt Empfehlungs-Feedback
- [ ] Möglicherweise - abhängig von der Implementierung
- [ ] Eher nicht - zu subjektiv für objektive Unsicherheit
- [ ] Nein - verwässert die mathematische Fundierung

**Wie sollte Unsicherheits-Feedback visualisiert werden?**
- [ ] Historische Charts: Prognostizierte vs. tatsächliche Unsicherheit
- [ ] Kalibrierungs-Plots: Wie oft lagen Unsicherheitsprognosen richtig?
- [ ] Fehleranalyse: Welche Unsicherheitsdimensionen waren ungenau?
- [ ] Verbesserungs-Trends: Wie entwickelt sich Unsicherheitsprognose-Qualität?
- [ ] Gar nicht - Feedback sollte intern bleiben

### F4. Navigation & Sidebar-Orientierung
**Die Sidebar verbindet Dashboard, Statistik, Unsicherheitsanalyse, Validierung und Depot.**

**Ist die Informationsarchitektur für Unsicherheits-Features logisch strukturiert?**
- [ ] Sehr logisch - klarer Workflow von Dashboard → Details → Validierung
- [ ] Größtenteils logisch - minimale Verbesserungen nötig
- [ ] Teilweise logisch - einige Bereiche sind verwirrend
- [ ] Wenig logisch - Umstrukturierung nötig
- [ ] Unlogisch - schwer zu navigieren

**Welcher Navigations-Flow macht für Unsicherheitsanalyse am meisten Sinn?**
1. Ranking nach Präferenz (1 = beste Route, 5 = schlechteste Route):
   - [ ] ___ Dashboard → Suchleiste → Unsicherheitsanalyse → Details
   - [ ] ___ Dashboard → Quick-Pick → Unsicherheitsanalyse → Validierung
   - [ ] ___ Statistik → Unsicherheitsanalyse → Vereinfachte Ansicht → Technische Details
   - [ ] ___ Depot → Einzelposition → Unsicherheitsanalyse → Portfolio-Kontext
   - [ ] ___ Direkter Zugang über globale Suchleiste von überall

**Fehlen wichtige Unsicherheits-Features in der Navigation?**
*Mehrfachauswahl möglich*
- [ ] Portfolio-Unsicherheits-Dashboard
- [ ] Unsicherheits-Vergleichstool (mehrere Aktien gleichzeitig)
- [ ] Historische Unsicherheits-Trends
- [ ] Unsicherheits-Alerts/Benachrichtigungen
- [ ] Unsicherheits-Settings/Personalisierung
- [ ] Keine - alle wichtigen Features sind vorhanden

---

## Teil G: Gesamtes Frontend-Ecosystem & Integration

### G1. End-to-End Unsicherheits-Journey
**Betrachten Sie den gesamten User-Flow durch alle Frontend-Bereiche:**

**Wie kohärent ist die Unsicherheitsvisualisierung across alle Komponenten?**
- [ ] Sehr kohärent - konsistentes Design und Logik überall
- [ ] Größtenteils kohärent - kleinere Inkonsistenzen
- [ ] Teilweise kohärent - einige Bereiche passen nicht zusammen
- [ ] Wenig kohärent - unterschiedliche Ansätze in verschiedenen Bereichen
- [ ] Inkohärent - jeder Bereich macht sein eigenes Ding

**Welcher Bereich integriert Unsicherheitsvisualisierung am besten?**
Ranking (1 = beste Integration, 5 = schlechteste Integration):
- [ ] ___ Unsicherheitsanalyse (Hauptfeature)
- [ ] ___ Dashboard (Quick-Überblick)
- [ ] ___ Depot (Portfolio-Integration)
- [ ] ___ Validierung (Feedback-Loop)
- [ ] ___ Navigation/Sidebar (Strukturierung)

### G2. Fehlende Integration-Punkte
**Wo sollten zusätzliche Unsicherheitsinformationen angezeigt werden?**

**Dashboard-Erweiterungen:**
*Mehrfachauswahl möglich*
- [ ] "Unsicherheits-Wetter" - tägliche Markt-Unsicherheit
- [ ] Top-5 unsicherste/sicherste Aktien des Tages
- [ ] Unsicherheits-Trend-Charts (steigend/fallend)
- [ ] Unsicherheits-Heat-Map für verschiedene Sektoren

**Depot-Erweiterungen:**
*Mehrfachauswahl möglich*
- [ ] Unsicherheits-Icons neben jeder Position
- [ ] Portfolio-Unsicherheits-Score in der Kopfzeile
- [ ] Unsicherheits-basierte Diversifikations-Metriken
- [ ] Unsicherheits-gewichtete Performance-Darstellung

**Neue Bereiche/Features:**
*Mehrfachauswahl möglich*
- [ ] Unsicherheits-Vergleichstool für mehrere Aktien
- [ ] Unsicherheits-Radar für Sektor-Analyse
- [ ] Unsicherheits-Timeline für historische Entwicklung
- [ ] Personalisierte Unsicherheits-Schwellenwerte

### G3. System-übergreifende Konsistenz
**Bewerten Sie die Konsistenz der Unsicherheitsdarstellung:**

**Farbkodierung (grün=sicher, rot=unsicher) ist überall einheitlich:**
- [ ] Ja, vollständig konsistent
- [ ] Größtenteils konsistent - kleinere Abweichungen
- [ ] Teilweise konsistent - einige Bereiche weichen ab
- [ ] Inkonsistent - verschiedene Bereiche nutzen verschiedene Logik

**Terminologie und Bezeichnungen sind einheitlich:**
- [ ] Ja, vollständig konsistent
- [ ] Größtenteils konsistent - kleinere Abweichungen
- [ ] Teilweise konsistent - einige Bereiche weichen ab
- [ ] Inkonsistent - verwirrende unterschiedliche Begriffe

**Interaktions-Muster (Tooltips, Info-Boxen, Details-Zugang) sind einheitlich:**
- [ ] Ja, vollständig konsistent
- [ ] Größtenteils konsistent - kleinere Abweichungen
- [ ] Teilweise konsistent - einige Bereiche weichen ab
- [ ] Inkonsistent - jeder Bereich hat eigene Patterns

---

## Teil H: Psychologische Wirkung & Entscheidungsbeeinflussung

### H1. Vertrauenswirkung
**Hat die Unsicherheitsvisualisierung Ihr Vertrauen in KI-Empfehlungen verändert?**

**Vor der Nutzung des Systems (Schätzung):**
Mein Vertrauen in KI-Trading-Empfehlungen war: [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

**Nach der Nutzung des Systems:**
Mein Vertrauen in KI-Trading-Empfehlungen ist: [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

**Was hat die Änderung bewirkt?**
- [ ] Transparenz erhöht Vertrauen
- [ ] Ehrlichkeit über Unsicherheiten wirkt professionell
- [ ] Mathematische Fundierung überzeugt
- [ ] Realistische Einschätzungen (TSLA unsicher, JNJ sicher)
- [ ] Komplexität schreckt ab
- [ ] Zu viel Unsicherheit macht nervös
- [ ] Andere: ________________________________________________

### H2. Trading-Verhalten Beeinflussung
**Wie würde das System Ihr Trading-Verhalten beeinflussen?**

**Bei hoher Unsicherheit (40%+) würde ich:**
- [ ] Position komplett vermeiden (wie empfohlen)
- [ ] Positionsgröße reduzieren (25-50% kleiner)
- [ ] Stop-Loss enger setzen
- [ ] Diversifikation erhöhen  
- [ ] Trotzdem normal handeln - Unsicherheit gehört dazu
- [ ] Andere: ________________________________________________

**Bei niedriger Unsicherheit (<20%) würde ich:**
- [ ] Positionsgröße erhöhen (höhere Confidence)
- [ ] Längeren Anlagehorizont wählen
- [ ] Stop-Loss weiter setzen
- [ ] Konzentrierter investieren
- [ ] Trotzdem vorsichtig bleiben - kann sich ändern
- [ ] Andere: ________________________________________________

### H3. Emotionale Reaktion
**Welche Emotionen lösen verschiedene Unsicherheitslevel bei Ihnen aus?**

**Bei SEHR UNSICHER (40%+):**
- [ ] Warnung/Vorsicht - gut dass System mich schützt
- [ ] Frustration - zu konservativ/vorsichtig
- [ ] Neugier - will verstehen warum so unsicher
- [ ] Skepsis - stimmt die Einschätzung?
- [ ] Angst - vielleicht übersehe ich Risiken generell

**Bei SEHR SICHER (<15%):**
- [ ] Vertrauen - kann beruhigt investieren
- [ ] Skepsis - nichts ist so sicher wie es scheint
- [ ] FOMO - sollte ich mehr investieren?
- [ ] Entspannung - endlich mal klare Verhältnisse
- [ ] Gleichgültigkeit - ändert meine Strategie nicht

### H4. Kognitive Belastung
**Wie anstrengend ist es, die Unsicherheitsinformationen zu verarbeiten?**
- [ ] Sehr leicht - intuitiv erfassbar
- [ ] Leicht - nach kurzer Eingewöhnung
- [ ] Moderat - erfordert Konzentration aber machbar
- [ ] Schwer - anstrengend und zeitaufwändig
- [ ] Sehr schwer - überfordert mich kognitiv

**Was ist am schwierigsten zu verarbeiten?**
*Mehrfachauswahl möglich*
- [ ] Die Vielzahl der Dimensionen (3 Hauptkategorien)
- [ ] Die Subdimensionen (16 Parameter total)
- [ ] Die mathematischen Formeln
- [ ] Die Interpretation der Prozentwerte
- [ ] Der Vergleich zwischen verschiedenen Aktien
- [ ] Die Integration in Trading-Entscheidungen

---

## Teil I: Systemverbesserungen für Unsicherheitsvisualisierung

### I1. Visualisierungs-Verbesserungen
**Wie könnte die Unsicherheitsdarstellung verbessert werden?**

**Alternative Visualisierungsformen, die Sie interessieren würden:**
*Mehrfachauswahl möglich*
- [ ] Radar-Chart (alle Dimensionen auf einen Blick)
- [ ] Heatmap (Farbintensitäten für verschiedene Aspekte)
- [ ] Zeitverlauf (wie sich Unsicherheit historisch entwickelt)
- [ ] Benchmark-Vergleich (vs. Marktdurchschnitt)
- [ ] Risiko-Rendite-Plot (Unsicherheit vs. Ertragspotential)
- [ ] Ampel-System (einfacher Rot/Gelb/Grün)

### I2. Informationstiefe
**Die richtige Balance zwischen Detail und Überblick:**

**Hauptansicht sollte zeigen:**
- [ ] Nur Gesamtunsicherheit + Empfehlung
- [ ] Gesamtunsicherheit + 3 Hauptdimensionen  
- [ ] Wie jetzt: Gesamtunsicherheit + 3 Dimensionen + Details auf Klick
- [ ] Alle 16 Parameter sofort sichtbar
- [ ] Vollständig anpassbar durch User

**Details-Zugang sollte erfolgen durch:**
- [ ] Hover-Tooltips (wie jetzt teilweise)
- [ ] Klick-Aufklapp-Bereiche (Accordion)
- [ ] Separate Detail-Seiten
- [ ] Info-Box-Overlays (wie jetzt implementiert)
- [ ] Komplett separate technische Ansicht

### I3. Handlungsempfehlungen
**Welche zusätzlichen Empfehlungen basierend auf Unsicherheit wären hilfreich?**

*Mehrfachauswahl möglich*
- [ ] Empfohlene Positionsgröße basierend auf Unsicherheit
- [ ] Dynamische Stop-Loss Levels
- [ ] Optimaler Anlagehorizont
- [ ] Hedging-Empfehlungen bei hoher Unsicherheit  
- [ ] Zeitpunkt-Empfehlungen (jetzt kaufen vs. abwarten)
- [ ] Diversifikations-Vorschläge
- [ ] Monitoring-Intervalle (wie oft Position überprüfen)

---

## Teil J: Gesamtbewertung der Unsicherheitsvisualisierung

### J1. Kern-Innovation
**Was ist der größte Wert der 3-dimensionalen Unsicherheitsvisualisierung?**

**Ranking (1 = wichtigster Nutzen, 5 = geringster Nutzen):**
- [ ] ___ Transparenz: Ich verstehe, warum KI unsicher ist
- [ ] ___ Vertrauen: Ehrlichkeit über Grenzen erhöht Glaubwürdigkeit  
- [ ] ___ Risikomanagement: Bessere Einschätzung des Verlustpotentials
- [ ] ___ Entscheidungshilfe: Weiß wann ich vorsichtiger sein sollte
- [ ] ___ Bildung: Lerne über Faktoren die Trading-Unsicherheit treiben

### J2. Praktische Implementierung
**Würden Sie das System in Ihrem echten Trading-Setup verwenden?**
- [ ] Ja, täglich als Haupt-Entscheidungstool
- [ ] Ja, regelmäßig als zusätzliche Information
- [ ] Ja, gelegentlich bei unsicheren Situationen
- [ ] Möglicherweise, nach weiterer Verbesserung
- [ ] Nein, zu komplex für praktische Anwendung
- [ ] Nein, vertraue lieber eigener Analyse

**Was müsste sich ändern für tägliche Nutzung?**
________________________________________________

________________________________________________

### J3. Unsicherheits-Kommunikation
**Wie erfolgreich kommuniziert das System Unsicherheit?**

**Verständlichkeit der Unsicherheits-Konzepte:**
- [ ] 1 - Völlig unklar  [ ] 2  [ ] 3  [ ] 4  [ ] 5 - Kristallklar

**Nützlichkeit für Entscheidungsfindung:**
- [ ] 1 - Nicht hilfreich  [ ] 2  [ ] 3  [ ] 4  [ ] 5 - Sehr hilfreich

**Angemessenheit der Detailtiefe:**
- [ ] 1 - Zu oberflächlich  [ ] 2  [ ] 3  [ ] 4  [ ] 5 - Zu detailliert

### J4. Wissenschaftlicher Beitrag
**Leistet diese Art der Unsicherheitsvisualisierung einen wertvollen Beitrag zur Fintech-Forschung?**
- [ ] Ja, bahnbrechend - sollte Standard werden
- [ ] Ja, wertvoll - wichtiger Schritt vorwärts
- [ ] Teilweise - interessant aber nicht revolutionär
- [ ] Begrenzt - nette Idee aber wenig Praxisrelevanz
- [ ] Nein - akademisch aber unpraktisch

**Begründung:** ________________________________________________

________________________________________________

---

## Teil K: Qualitative Reflexion

### K1. Unsicherheits-Philosophie
**Hat das System Ihre Einstellung zu Unsicherheit in Trading-Entscheidungen verändert?**

________________________________________________

________________________________________________

### K2. Kognitiver Aufwand vs. Informationsgewinn
**Lohnt sich der mentale Aufwand, Unsicherheitsinformationen zu verarbeiten?**

________________________________________________

________________________________________________

### K3. Verbesserungsvorschläge
**Die drei wichtigsten Verbesserungen für die Unsicherheitsvisualisierung:**

1. ________________________________________________

2. ________________________________________________  

3. ________________________________________________

### K4. Killer-Feature oder Nice-to-Have?
**Ist Unsicherheitsvisualisierung ein 'Must-Have' für moderne Trading-Tools oder nur 'Nice-to-Have'?**

________________________________________________

________________________________________________

---

## Abschluss

**Zusätzliche Gedanken zur Unsicherheitsvisualisierung:**

________________________________________________

________________________________________________

________________________________________________

**Vielen Dank für Ihre detaillierte Evaluation der Unsicherheitsvisualisierung!**

---

*Hinweis: Diese Daten helfen dabei zu verstehen, wie Finanzexperten Unsicherheitsinformationen kognitiv verarbeiten und für Entscheidungen nutzen.*