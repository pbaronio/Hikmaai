# Hikmaai Prototype

Prototipo UI dark mode per la piattaforma Hikmaai — cybersecurity testing per agenti AI.

## Stack

- **Next.js 16** (App Router)
- **shadcn/ui** + Tailwind CSS v4
- **Recharts** per data visualization
- **Lucide React** per icone

## Avvio

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## Pagine

| Route | Descrizione |
|-------|-------------|
| `/overview` | Dashboard con score, priority cards, trend chart |
| `/tests` | Lista test filtrabile con drawer |
| `/tests/[id]` | Dettaglio test con findings in accordion |
| `/assets` | Lista agenti/MCP/skill con drawer |
| `/assets/[id]` | Dettaglio asset con score infographic |
| `/schedule` | Test ricorrenti |
| `/evaluation` | Breakdown aree di valutazione |

## Documentazione

Vedi [SPECIFICHE.md](../SPECIFICHE.md) nella root del progetto per il documento completo di specifiche.
