# Evaluations-Leitfaden für die Durchführung

## Übersicht der Evaluation

**Ziel:** Wissenschaftliche Bewertung der KI-Unsicherheitsvisualisierung für Trading-Systeme  
**Teilnehmer:** 8-12 Experten aus dem Finanz-/Trading-Bereich  
**Dauer:** 35-40 Minuten pro Teilnehmer  
**Format:** Individuelle Sessions (persönlich oder remote)

---

## Vorbereitung

### Technische Vorbereitung
- [ ] Development Server läuft (`npm run dev`)
- [ ] URL bereit: `http://localhost:3000`
- [ ] Test-Navigation funktioniert
- [ ] Verschiedene Aktien getestet (AAPL, TSLA, MSFT, etc.)
- [ ] Bildschirmaufzeichnung vorbereitet (optional)

### Materialien
- [ ] Fragebogen (digital oder ausgedruckt)
- [ ] Einverständniserklärung für Studienteilnahme
- [ ] Kurze System-Einführung (2-3 Folien)
- [ ] Liste der 23 verfügbaren Aktien
- [ ] Backup-Plan bei technischen Problemen

### Teilnehmer-Rekrutierung
**Zielgruppe:**
- Trading-Experten (min. 3 Jahre Erfahrung)
- Portfolio Manager
- Quantitative Analysten
- Risk Manager
- FinTech-Entwickler mit Trading-Hintergrund

---

## Durchführungsablauf (35-40 Minuten)

### Phase 1: Pre-Task Interview (5 Minuten)

**Begrüßung & Einführung:**
- Kurze Vorstellung der Studie
- Erklärung der Freiwilligkeit
- Einverständnis zur Datenverwendung

**Kurze Vorab-Befragung:**
- "Erzählen Sie mir kurz von Ihrem beruflichen Hintergrund."
- "Welche Trading-Tools verwenden Sie aktuell?"
- "Haben Sie schon einmal KI-basierte Empfehlungssysteme verwendet?"
- "Was erwarten Sie von einem Unsicherheitsvisualisierungs-System?"

### Phase 2: System-Demonstration (3 Minuten)

**Kurze System-Einführung:**
```
"Das System visualisiert 3 Arten von Unsicherheit in KI-Trading-Empfehlungen:
1. Daten-Unsicherheit: Qualität der verfügbaren Informationen
2. Modell-Unsicherheit: Vertrauen in die KI-Vorhersagen  
3. Menschliche Unsicherheit: Expertenmeinungen und Marktpsychologie

Sie werden gleich das System selbst erkunden. Bitte denken Sie dabei laut 
und teilen Sie Ihre Gedanken mit mir."
```

### Phase 3: Geführte Exploration (15-20 Minuten)

**Aufgaben für den Teilnehmer:**

**Aufgabe 1: Navigation & Überblick (3-4 Min)**
- "Öffnen Sie bitte die Unsicherheitsanalyse"
- "Wählen Sie eine Aktie aus, die Sie interessiert"
- "Schauen Sie sich die Gesamtunsicherheit an"

**Beobachtungspunkte:**
- Findet der Teilnehmer die Navigation intuitiv?
- Versteht er die Unsicherheits-Overview sofort?
- Welche Aktie wählt er und warum?

**Aufgabe 2: Detailanalyse (8-10 Min)**
- "Klicken Sie auf 'Technische Analyse' und erkunden Sie die verschiedenen Dimensionen"
- "Was sagen Ihnen die Datenunsicherheits-Parameter?"
- "Schauen Sie sich die mathematischen Formeln an - sind diese hilfreich?"

**Beobachtungspunkte:**
- Versteht er die 4 Datenunsicherheits-Dimensionen?
- Nutzt er die Info-Tooltips mit Formeln?
- Wie reagiert er auf die mathematischen Details?

**Aufgabe 3: Vereinfachte Ansicht (4-5 Min)**
- "Wechseln Sie zur 'Vereinfachten Ansicht'"
- "Vergleichen Sie die Erklärungen mit der technischen Ansicht"

**Beobachtungspunkte:**
- Präferiert er die vereinfachte oder technische Ansicht?
- Sind die Erklärungen verständlich?

**Aufgabe 4: Vergleich verschiedener Aktien (3-4 Min)**
- "Vergleichen Sie die Unsicherheit von AAPL vs. TSLA"
- "Was fällt Ihnen bei der Kauf-Empfehlung auf?"

**Beobachtungspunkte:**
- Erkennt er die unterschiedlichen Unsicherheitsmuster?
- Versteht er die Empfehlungslogik?

### Phase 4: Fragebogen-Bearbeitung (10 Minuten)

**Moderator-Hinweise:**
- Teilnehmer arbeitet selbstständig
- Bei Verständnisfragen helfen
- Notizen zu Reaktionen machen
- Nicht bei der Bewertung beeinflussen

### Phase 5: Abschluss-Interview (5-7 Minuten)

**Leitfragen:**
- "Was war Ihr erster Eindruck des Systems?"
- "Welcher Teil hat Sie am meisten überzeugt?"
- "Was würden Sie als erstes ändern/verbessern?"
- "Sehen Sie praktische Anwendungsmöglichkeiten in Ihrem Arbeitsbereich?"
- "Wie unterscheidet sich das von Tools, die Sie kennen?"

---

## Beobachtungsprotokoll

### Teilnehmer: _____ | Datum: _____ | Dauer: _____

**Pre-Task Notizen:**
- Erfahrungslevel: _________________________________
- Erwartungen: ___________________________________
- Aktuelle Tools: _________________________________

**Exploration Beobachtungen:**

**Navigation & Usability:**
- Intuitive Bedienung: [ ] Sehr gut [ ] Gut [ ] Probleme bei: _________
- Gewählte Aktie: ____________ Grund: ___________________
- Erste Reaktion auf UI: _______________________________

**Technische Analyse:**
- Verständnis der 3 Dimensionen: [ ] Sofort [ ] Nach Erklärung [ ] Schwierig
- Nutzung der Info-Tooltips: [ ] Häufig [ ] Gelegentlich [ ] Gar nicht
- Reaktion auf Formeln: [ ] Hilfreich [ ] Überflüssig [ ] Verwirrend
- Problembereiche: ____________________________________

**Vereinfachte Ansicht:**
- Präferenz: [ ] Technisch [ ] Vereinfacht [ ] Beide gleich
- Verständlichkeit: ___________________________________

**Aktien-Vergleich:**
- Erkennt Unterschiede: [ ] Ja [ ] Teilweise [ ] Nein
- Kommentare: ______________________________________

**Gesamteindruck:**
- Engagement-Level: [ ] Hoch [ ] Mittel [ ] Niedrig
- Spontane Kommentare: _______________________________
- Kritikpunkte: ____________________________________
- Begeisterung für: _________________________________

---

## Datenauswertung

### Quantitative Metriken

**System Usability (Teil B):**
- Durchschnittsbewertung Navigation: _____
- Durchschnittsbewertung Visualisierung: _____
- Durchschnittsbewertung Formeln: _____

**Fachliche Relevanz (Teil C):**
- Validität der Dimensionen: _____
- ChatGPT-Framework: _____
- Mathematische Korrektheit: _____

**Praktische Anwendbarkeit (Teil D):**
- Nutzen für Trading: _____
- Workflow-Integration: _____
- Vertrauen in KI: _____

**Innovation (Teil E):**
- Neuartigkeit: _____
- Praxispotential: _____
- Wissenschaftlicher Beitrag: _____

### Qualitative Analyse

**Häufigste Stärken:**
1. _________________________________
2. _________________________________
3. _________________________________

**Häufigste Kritikpunkte:**
1. _________________________________
2. _________________________________
3. _________________________________

**Verbesserungsvorschläge:**
1. _________________________________
2. _________________________________
3. _________________________________

---

## Erfolgs-Kriterien

### Minimaler Erfolg
- [ ] Durchschnittliche Gesamtbewertung ≥ 6/10
- [ ] 70% würden System weiterempfehlen
- [ ] Keine grundlegenden Usability-Probleme

### Guter Erfolg
- [ ] Durchschnittliche Gesamtbewertung ≥ 7.5/10
- [ ] 80% sehen praktischen Nutzen
- [ ] Positive Bewertung der Innovation

### Exzellenter Erfolg
- [ ] Durchschnittliche Gesamtbewertung ≥ 8.5/10
- [ ] 90% würden System verwenden
- [ ] Spontane Implementierungs-Anfragen

---

## Tipps für Moderatoren

### Vorbereitung
- System gründlich testen
- Mit verschiedenen Aktien vertraut machen
- Backup-Szenarien durchdenken
- Neutrale Haltung bewahren

### Während der Session
- Nicht beeinflussen oder führen
- Authentische Reaktionen beobachten
- Bei technischen Problemen ruhig bleiben
- Think-Aloud-Protokoll ermutigen

### Nach der Session
- Sofort Notizen vervollständigen
- Besondere Erkenntnisse dokumentieren
- Teilnehmer-Feedback zusammenfassen
- Verbesserungen für nächste Session notieren