import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { AnalyticsService, DecisionWithOutcomes } from './analytics.service';
import { TradeoffStoreService } from './tradeoff-store.service';

export interface Insight {
  id: string;
  type: 'high_impact' | 'poor_outcome' | 'tradeoff_pattern' | 'reflection';
  title: string;
  description: string;
  decisionId?: string;
  actionable?: boolean;
}

@Injectable({ providedIn: 'root' })
export class InsightService {
  constructor(
    private analytics: AnalyticsService,
    private tradeoffs: TradeoffStoreService
  ) {}

  getInsights(): Observable<Insight[]> {
    return combineLatest([
      this.analytics.getDecisionsWithOutcomes(),
      this.tradeoffs.tradeoffs$,
    ]).pipe(
      map(([withOutcomes, tradeoffs]) => {
        const insights: Insight[] = [];
        const decisions = withOutcomes.map((w) => w.decision);

        withOutcomes.forEach((wo) => {
          if (wo.metrics.length > 0 && (wo.outcomeScore ?? 0) >= 80) {
            insights.push({
              id: `ins_high_${wo.decision.id}`,
              type: 'high_impact',
              title: 'Strong outcome',
              description: `"${wo.decision.title}" is tracking above target. Review what went right.`,
              decisionId: wo.decision.id,
              actionable: true,
            });
          }
          if (wo.metrics.length > 0 && (wo.outcomeScore ?? 100) < 50) {
            insights.push({
              id: `ins_poor_${wo.decision.id}`,
              type: 'poor_outcome',
              title: 'Outcome below expectation',
              description: `"${wo.decision.title}" is underperforming. Consider revisiting assumptions.`,
              decisionId: wo.decision.id,
              actionable: true,
            });
          }
        });

        const speedQuality = tradeoffs.filter(
          (t) =>
            t.title.toLowerCase().includes('speed') ||
            t.title.toLowerCase().includes('quality')
        );
        if (speedQuality.length >= 2) {
          insights.push({
            id: 'ins_pattern_speed_quality',
            type: 'tradeoff_pattern',
            title: 'Repeated trade-off: Speed vs quality',
            description: `You've logged ${speedQuality.length} decisions involving speed vs quality. Look for patterns in outcomes.`,
            actionable: true,
          });
        }

        insights.push({
          id: 'ins_reflect_1',
          type: 'reflection',
          title: 'Reflection prompt',
          description:
            'Which assumption from your last major decision would you stress-test first?',
          actionable: false,
        });

        return insights;
      })
    );
  }
}
