import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { DecisionStoreService } from './decision-store.service';
import { MetricsService } from './metrics.service';
import { TradeoffStoreService } from './tradeoff-store.service';
import { Decision } from '../models/decision.model';
import { OutcomeMetric } from '../models/metric.model';
import { Tradeoff } from '../models/tradeoff.model';

export interface DecisionWithOutcomes {
  decision: Decision;
  metrics: OutcomeMetric[];
  tradeoffs: Tradeoff[];
  outcomeScore?: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(
    private decisions: DecisionStoreService,
    private metrics: MetricsService,
    private tradeoffs: TradeoffStoreService
  ) {}

  getDecisionsWithOutcomes(): Observable<DecisionWithOutcomes[]> {
    return combineLatest({
      decisions: this.decisions.decisions$,
      metrics: this.metrics.metrics$,
      tradeoffs: this.tradeoffs.tradeoffs$,
    }).pipe(
      map(({ decisions, metrics, tradeoffs }) =>
        decisions.map((decision) => ({
          decision,
          metrics: metrics.filter((m) => m.decisionId === decision.id),
          tradeoffs: tradeoffs.filter((t) => t.decisionId === decision.id),
          outcomeScore: this.computeOutcomeScore(
            decision,
            metrics.filter((m) => m.decisionId === decision.id)
          ),
        }))
      )
    );
  }

  private computeOutcomeScore(decision: Decision, metrics: OutcomeMetric[]): number | undefined {
    if (metrics.length === 0) return undefined;
    let total = 0;
    let count = 0;
    for (const m of metrics) {
      if (m.actualEvolution.length > 0 && m.targetValue != null) {
        const latest = m.actualEvolution[m.actualEvolution.length - 1].value;
        const pct = Math.min(100, Math.max(0, (latest / m.targetValue) * 100));
        total += pct;
        count++;
      }
    }
    return count === 0 ? undefined : Math.round(total / count);
  }
}
