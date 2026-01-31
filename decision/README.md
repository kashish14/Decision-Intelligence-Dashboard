# Decision — Decision Intelligence Dashboard

**Decision** is a locally runnable web application that helps product and engineering teams understand *why* decisions were made, *what* trade-offs were involved, and *how* those decisions impacted outcomes. It is not a BI dashboard—it is a **product thinking system** that connects decisions to results.

---

## Why Decision Intelligence Matters

Most teams track *what* shipped. Few systematically capture *why* they chose one path over another, what they assumed, and whether outcomes matched expectations. Decision makes decision-making **explicit and learnable**: you log decisions, capture context and assumptions, document trade-offs, track resulting metrics, and reflect on decision quality over time.

---

## What Decision Does

- **Log important decisions** — Problem statement, options considered, chosen option, assumptions, risks, confidence level, and type (product, tech, process).
- **Capture trade-offs** — Log dimensions (e.g. speed vs quality, cost vs scale) and the rationale behind compromises.
- **Track outcome metrics** — Define success metrics per decision, set intended evolution over time, and record actual outcomes.
- **Link decisions to outcomes** — Associate metrics with decisions and visualize impact timelines (intended vs actual).
- **Surface insights** — High-impact decisions, underperforming outcomes, repeated trade-off patterns, and reflection prompts.

---

## How Decisions Are Modeled

Each decision in Decision includes:

| Field | Purpose |
|-------|--------|
| **Title** | Short, memorable label |
| **Problem statement** | What problem were you solving? |
| **Options considered** | Alternatives you evaluated |
| **Chosen option** | What you decided |
| **Assumptions** | What you assumed to be true |
| **Risks** | What could go wrong |
| **Confidence level** | low / medium / high |
| **Type** | product / tech / process |

Trade-offs are modeled as **dimensions** (e.g. "Speed to market: 80", "Feature completeness: 40") plus a **rationale** explaining the compromise. Outcome metrics are **time-series**: intended evolution (what you expected) and actual evolution (what happened), so you can compare and learn.

---

## Trade-off Tracking Philosophy

Trade-offs are not failures—they are explicit choices. Decision encourages you to name the dimensions you're balancing (speed vs quality, cost vs scale, etc.) and document *why* you chose the balance you did. Over time, patterns emerge: which trade-offs recur, and how often did the chosen balance hold up? This makes future decisions more informed.

---

## Outcome Measurement Strategy

- **Define success per decision** — Each decision can have one or more metrics (e.g. "Event coverage %", "P95 latency").
- **Intended vs actual** — For each metric you define an intended evolution (e.g. 20% → 50% → 80% over 90 days) and record actual values as they come in.
- **Simple scoring** — When a target value exists, Decision computes an outcome score (e.g. actual vs target) to highlight decisions that over- or under-performed.
- **Clarity over complexity** — No heavy math; the goal is clarity and reflection, not optimization.

---

## Architecture Overview

```
src/app/
├── core/                    # Singleton services, layout, models, error handling
│   ├── layout/              # Shell: header, sidebar, layout component
│   ├── models/              # decision.model, tradeoff.model, metric.model
│   ├── services/            # decision-store, metrics, tradeoff-store, analytics, insight, event-bus, logging, local-storage
│   └── error-handler/       # Global error handler
├── shared/                  # Shared module: bar-chart, line-chart, forms, pipes
├── features/
│   ├── dashboard/           # Landing: summary cards, recent decisions, insights
│   ├── decision-log/        # Create, list, detail decisions
│   ├── tradeoff-tracker/    # List and create trade-offs, link to decisions
│   ├── outcome-metrics/     # List, create, detail metrics; intended vs actual
│   └── insights/            # Insight engine output: high-impact, poor outcomes, patterns, reflection
```

- **Feature-based modules** — Each feature is a lazy-loaded module with its own routing.
- **Shared services** — Decision store, metrics service, analytics service, insight service, and event bus (RxJS) enable clean cross-module communication.
- **Data layer** — Mock backend with in-memory stores, async simulation (small delays), and **local persistence** (localStorage) so data survives refresh.

---

## How to Run Locally

**Prerequisites:** Node.js **18 or 20** (LTS). Node 24 can cause `npm install` to fail due to native build (lmdb) issues.

```bash
cd decision
npm install
npm start
```

Then open **http://localhost:4200**.

**If `npm install` fails** (e.g. lmdb/node-gyp errors on Node 24):

1. **Use Node 20** (recommended): `nvm install 20 && nvm use 20`, then remove `node_modules` and `package-lock.json`, run `npm install` again.
2. **Or skip install scripts**: `npm run install:skip-scripts`, then `npm start`. (May work if the dev server doesn’t need the failing optional native module.) The app will:

- Redirect `/` to `/dashboard`.
- Show the dashboard with summary cards, recent decisions with outcome scores, and insights.
- Persist decisions, trade-offs, and metrics in **localStorage** (key prefix: `decisio_*`).

**Build for production:**

```bash
npm run build
```

Output is in `dist/decisio/`.

**Run tests:**

```bash
npm test
```

---

## Tech Stack

- **Angular** 18, **TypeScript**, **RxJS**
- **SCSS** for styles
- **Chart/visualization** — Custom lightweight bar and line chart components (CSS/SVG) for outcome scores and intended vs actual trends
- **Mock backend** — In-memory stores + localStorage; async simulation via `delay()` in services

---

## Future Roadmap

- **Simulate metric changes** — UI to "simulate" or project metric values over time for planning.
- **Export / import** — Export decisions and metrics as JSON; import from other tools.
- **Team collaboration** — Optional backend for shared workspaces and comments.
- **Richer insights** — More pattern detection (e.g. confidence vs outcome correlation) and suggested reflection questions.
- **Themes** — Optional dark/light and accessibility improvements.

---

## Summary

Decision helps teams make decision-making **explicit and learnable**. You log decisions, capture trade-offs, track outcomes, and use a simple insight engine to highlight what’s working and what isn’t. The architecture is modular, the UI is calm and executive-friendly, and the repo is built to signal **product leadership and technical maturity**.

Built with **Angular**, **TypeScript**, **RxJS**, and **SCSS**. Run it locally with `npm install` and `npm start`.
