# Hikmaai — Documento di Specifiche Prototipo UI

> Versione: 0.1.0 · Data: 26 giugno 2026  
> Scope: prototipo interattivo front-end (storyboard Red Team)

---

## 1. Contesto del progetto

### 1.1 Cos'è Hikmaai

Hikmaai è una piattaforma di **cybersecurity per agenti AI**. Consente di:

1. **Registrare asset** — agenti AI, server MCP e skill
2. **Configurare test** — singoli o ricorrenti, con preset Hikmaai o regole custom
3. **Eseguire assessment** — tramite algoritmi automatizzati su tre macro-aree
4. **Generare report** — con findings, impatto, remediation e possibilità di refresh

### 1.2 Le tre macro-aree di test

| Area | Descrizione |
|------|-------------|
| **Security** | Resistenza a prompt injection, escalation dei privilegi, sandbox escape, data exfiltration |
| **Compliance** | GDPR, audit trail, gestione PII, conformità normativa |
| **Efficiency** | Latenza, SLA, rate limiting, accuratezza delle risposte |

### 1.3 Obiettivo del prototipo

Validare lo **storyboard UX** emerso dai workshop, semplificando rispetto alla piattaforma attuale (cartella `Applicazione oggi/`). Il prototipo non è connesso a backend reale: utilizza dati mock per dimostrare flussi e gerarchia informativa.

### 1.4 Principi di design

- **Dark mode** come tema predefinito, con accenti cyan/teal (identità cybersecurity)
- **Semplicità** — meno layer, meno dati per schermata rispetto all'app attuale
- **Progressive disclosure** — drawer per overview rapida, pagina dedicata per il dettaglio completo
- **shadcn/ui** come design system (componenti accessibili, customizzabili)

---

## 2. Storyboard utente

```
Dashboard (Overview)
    │
    ├─► Click "Test critici" ──► Lista test filtrata (priority=critical)
    │                               │
    │                               ├─► Click riga ──► Drawer overview test
    │                               │                      │
    │                               │                      └─► "Apri dettaglio" ──► Pagina test
    │                               │
    │                               └─► Click "Apri dettaglio" diretto
    │
    └─► Sidebar "Assets" ──► Lista agenti/MCP/skill
                                  │
                                  ├─► Click riga ──► Drawer overview asset
                                  │                      │
                                  │                      └─► "Apri dettaglio" ──► Pagina asset
                                  │
                                  └─► Da asset detail ──► Link a test associati
```

---

## 3. Architettura informativa

### 3.1 Topbar

| Elemento | Comportamento |
|----------|---------------|
| Logo + `hikmaai / workspace` | Branding; click su workspace apre dropdown con lista workspace |
| Navigazione orizzontale | Voci di macro-area prodotto (vedi §3.3) |
| Avatar utente | Account corrente (prototipo: statico) |

### 3.2 Sidebar (contestuale alla macro-area attiva)

| Voce | Route | Stato prototipo |
|------|-------|-----------------|
| Overview | `/overview` | ✅ Implementata |
| Tests | `/tests` | ✅ Implementata |
| Assets | `/assets` | ✅ Implementata |
| Schedule | `/schedule` | ✅ Implementata (base) |
| Evaluation | `/evaluation` | ✅ Implementata (base) |
| Settings | — | Placeholder |
| Account | Footer sidebar | Statico |

### 3.3 Navigazione topbar — nomenclatura

| Nome originale | Nome nel prototipo | Razionale |
|----------------|-------------------|-----------|
| Redteaming | **Red Team** | Termine standard in cybersecurity; area su cui si lavora |
| Gateway | **Gateway** | Mantenuto — punto di accesso/API gateway |
| Workstation Agents | **Agent Workstation** | Più chiaro: ambiente di lavoro degli agenti |
| Inventory | **Asset Inventory** | Esplicita che si tratta di inventario asset |

> Le voci Gateway, Agent Workstation e Asset Inventory sono presenti ma non attive nel prototipo (link `#`).

---

## 4. Specifiche per pagina

### 4.1 Overview (`/overview`)

**Scopo:** dare all'utente una fotografia immediata dello stato di sicurezza del workspace.

| Componente | Contenuto |
|------------|-----------|
| Hikmaai Score | Lettera (A–F) + percentuale globale |
| Area breakdown | Donut chart + valori per Security, Compliance, Efficiency |
| Priority cards | 3 card cliccabili: test critici (9), media priorità (14), bassa priorità (23) |
| Assessment trend | Line chart 90 giorni con 4 serie (overall, security, compliance, efficiency) |
| Critical tests list | Ultimi 4 test critici con link diretto al dettaglio |

**Interazioni:**
- Click su priority card → `/tests?priority={critical|medium|low}`
- Click su test critico → `/tests/{id}`

### 4.2 Tests (`/tests`)

**Scopo:** elenco completo dei test con filtri e raggruppamento per priorità.

**Filtri:**
- Ricerca testuale (test case name)
- Filtro per area (security / compliance / efficiency)
- Filtro priority da query string (`?priority=critical`)

**Tabella — colonne:**

| Colonna | Descrizione |
|---------|-------------|
| Assets | `+N` con tooltip che elenca gli agenti interrogati |
| Test case | Nome + badge `×N` se run raggruppati |
| Eff. / Comp. / Sec. | Percentuale se presente, altrimenti `—` |
| Schedule | Frequenza se configurata |
| Last run | Data relativa |
| Refresh | Icona (placeholder) |

**Deduplicazione test:**
I test con lo stesso `testCase` vengono mostrati come singola riga con badge `×N` (run count). Nel prototipo i dati mock includono già `runCount` per simulare il raggruppamento dell'ultimo run per test case.

**Raggruppamento:**
- Senza filtro priority: 3 sezioni (Critical, Medium, Low)
- Con filtro priority: singola tabella

**Drawer (click su riga):**
- Badge priority, status, area
- Metriche percentuali
- Overview testuale
- Main takeaways (bullet list)
- Critical actions / Medium actions
- Assets testati
- Bottoni: Refresh, Apri dettaglio

### 4.3 Test Detail (`/tests/[id]`)

**Layout:** split view

| Zona | Contenuto |
|------|-----------|
| Sinistra (scroll) | Findings in accordion: titolo, severity, tags, description, impact, remediation, attack method |
| Destra (fissa) | Overview, last run, preset, schedule, assets ispezionati, bottoni Refresh/Schedule |

### 4.4 Assets (`/assets`)

**Scopo:** inventario di agenti AI, MCP server e skill.

**Filtri:** ricerca testuale, tipo (agent / mcp / skill)

**Tabella — colonne:** Name, Type, Security %, Compliance %, Efficiency %, Status, Active tests, Last tested

**Drawer (click su riga):**
- Tipo e status
- Descrizione
- Score infographic (3 radial bar)
- Lista test attivi su quell'asset
- Bottone: Apri dettaglio

### 4.5 Asset Detail (`/assets/[id]`)

| Zona | Contenuto |
|------|-----------|
| Sinistra | Score infographic, lista test associati (link a `/tests/{id}`) |
| Destra | Overview asset: tipo, status, last tested, active tests |

### 4.6 Schedule (`/schedule`)

Lista dei test con schedule ricorrente configurata. Placeholder per gestione CRUD futura.

### 4.7 Evaluation (`/evaluation`)

Breakdown dettagliato delle tre aree con progress bar. Placeholder per metodologia di scoring.

---

## 5. Design system

### 5.1 Palette (dark mode)

| Token | Uso |
|-------|-----|
| Background | `oklch(0.13 0.01 260)` — blu-notte profondo |
| Primary / Accent | Cyan `oklch(0.78 0.14 195)` — link, highlight, nav attiva |
| Security | Rosso `hsl(0 72% 60%)` |
| Compliance | Blu `hsl(210 70% 55%)` |
| Efficiency | Ambra `hsl(45 80% 55%)` |
| Critical | Rosso con opacity |
| Medium | Ambra con opacity |
| Low / Passed | Verde smeraldo con opacity |

### 5.2 Componenti shadcn utilizzati

`Button`, `Card`, `Badge`, `Table`, `Sheet` (drawer), `Accordion`, `DropdownMenu`, `Input`, `Select`, `Tabs`, `Progress`, `Separator`, `Avatar`, `Tooltip`, `Chart` (Recharts)

### 5.3 Data visualization

| Componente | Libreria | Uso |
|------------|----------|-----|
| Donut chart | Recharts PieChart | Breakdown aree nello score |
| Line chart | Recharts LineChart | Trend assessment 90 giorni |
| Radial bar | Recharts RadialBarChart | Score per area su asset |

---

## 6. Struttura del progetto

```
Hikmaai/
├── Applicazione oggi/          # Screenshot piattaforma attuale (riferimento contenuti)
├── Reference UI/               # Riferimenti grafici (dark dashboard)
├── SPECIFICHE.md               # Questo documento
└── prototype/                  # Applicazione Next.js
    ├── package.json
    ├── components.json         # Config shadcn
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx              # Root layout, dark mode, TooltipProvider
    │   │   ├── page.tsx                # Redirect → /overview
    │   │   ├── globals.css             # Tema custom cybersecurity
    │   │   └── (dashboard)/
    │   │       ├── layout.tsx          # AppShell (topbar + sidebar)
    │   │       ├── overview/page.tsx
    │   │       ├── tests/
    │   │       │   ├── page.tsx
    │   │       │   └── [id]/page.tsx
    │   │       ├── assets/
    │   │       │   ├── page.tsx
    │   │       │   └── [id]/page.tsx
    │   │       ├── schedule/page.tsx
    │   │       └── evaluation/page.tsx
    │   ├── components/
    │   │   ├── layout/
    │   │   │   └── app-shell.tsx       # Topbar + Sidebar
    │   │   ├── dashboard/
    │   │   │   ├── score-card.tsx
    │   │   │   ├── area-breakdown.tsx
    │   │   │   └── trend-chart.tsx
    │   │   ├── tests/
    │   │   │   ├── tests-page.tsx
    │   │   │   ├── test-drawer.tsx
    │   │   │   └── test-detail.tsx
    │   │   ├── assets/
    │   │   │   ├── assets-page.tsx
    │   │   │   ├── asset-drawer.tsx
    │   │   │   └── asset-detail.tsx
    │   │   ├── shared/
    │   │   │   └── score-infographic.tsx
    │   │   └── ui/                     # Componenti shadcn generati
    │   └── lib/
    │       ├── types.ts                # Tipi TypeScript dominio
    │       ├── utils.ts                # cn() helper
    │       ├── utils/format.ts         # Formatter e config badge/colori
    │       └── data/mock.ts            # Dati mock (agenti, test, score)
```

---

## 7. Modello dati (tipi principali)

```typescript
type TestArea = "security" | "compliance" | "efficiency"
type Priority = "critical" | "medium" | "low"
type TestStatus = "passed" | "failed" | "warning" | "running"

interface Agent {
  id, name, type: "agent"|"mcp"|"skill"
  efficiency, compliance, security: number
  status: "active"|"inactive"|"degraded"
  lastTestedAt, activeTests
}

interface TestRun {
  id, testCase, area, priority, status
  agents: string[]          // ID agenti
  efficiency?, compliance?, security?
  schedule?, lastRunAt, preset?
  overview, takeaways[], criticalActions[], mediumActions[]
  findings: TestFinding[]
  runCount                 // Per deduplicazione UI
}

interface TestFinding {
  id, title, severity, area, tags[]
  description, impact, remediation[]
  attackMethod?
}
```

---

## 8. Avvio del prototipo

```bash
cd prototype
npm install
npm run dev
```

Aprire [http://localhost:3000](http://localhost:3000) — redirect automatico a `/overview`.

---

## 9. Roadmap (fuori scope prototipo)

- [ ] Connessione API backend
- [ ] Autenticazione e gestione workspace reali
- [ ] CRUD test e schedule
- [ ] Refresh test con stato loading/progress
- [ ] Gateway, Agent Workstation, Asset Inventory (macro-aree topbar)
- [ ] Notifiche e activity feed
- [ ] Export report PDF
- [ ] Confronto tra run dello stesso test (diff findings)
- [ ] Test responsive mobile

---

## 10. Decisioni UX documentate

| Decisione | Motivazione |
|-----------|-------------|
| Drawer prima della pagina dettaglio | Permette analisi rapida senza perdere il contesto della lista |
| Raggruppamento test per `testCase` + `runCount` | Evita duplicazione visiva di test identici eseguiti più volte |
| Tabella divisa per priorità | Allinea con il flusso "cosa richiede attenzione prima" |
| Metriche parziali (`—` se assente) | Non tutti i test coprono tutte e tre le aree |
| Assets al posto di "Agenti" in sidebar | Copre agenti, MCP e skill con un termine unificato |
| Split layout nel dettaglio | Overview sempre visibile a destra mentre si esplorano i findings |

---

*Documento generato per il team Hikmaai — prototipo UI Red Team v0.1*
