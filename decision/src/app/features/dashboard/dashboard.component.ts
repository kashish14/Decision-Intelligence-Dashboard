import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalyticsService, DecisionWithOutcomes } from '../../core/services/analytics.service';
import { InsightService, Insight } from '../../core/services/insight.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  decisionsWithOutcomes$!: Observable<DecisionWithOutcomes[]>;
  insights$!: Observable<Insight[]>;

  constructor(
    private analytics: AnalyticsService,
    private insights: InsightService
  ) {}

  ngOnInit(): void {
    this.decisionsWithOutcomes$ = this.analytics.getDecisionsWithOutcomes();
    this.insights$ = this.insights.getInsights();
  }

  totalMetrics(list: DecisionWithOutcomes[]): number {
    return list.reduce((acc, wo) => acc + wo.metrics.length, 0);
  }
}
