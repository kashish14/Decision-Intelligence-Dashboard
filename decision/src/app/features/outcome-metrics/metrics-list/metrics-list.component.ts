import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { OutcomeMetric } from '../../../core/models/metric.model';
import { Decision } from '../../../core/models/decision.model';
import { MetricsService } from '../../../core/services/metrics.service';
import { DecisionStoreService } from '../../../core/services/decision-store.service';

@Component({
  selector: 'app-metrics-list',
  templateUrl: './metrics-list.component.html',
  styleUrls: ['./metrics-list.component.scss'],
})
export class MetricsListComponent implements OnInit {
  metricsWithDecision$!: Observable<{ metric: OutcomeMetric; decision?: Decision }[]>;

  constructor(
    private metrics: MetricsService,
    private decisions: DecisionStoreService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.metricsWithDecision$ = combineLatest([
      this.metrics.getAll(),
      this.decisions.decisions$,
    ]).pipe(
      map(([metrics, decisions]) =>
        metrics.map((metric) => ({
          metric,
          decision: decisions.find((d) => d.id === metric.decisionId),
        }))
      )
    );
    this.route.queryParams.subscribe((qp) => {
      if (qp['decisionId']) this.router.navigate(['/metrics/create'], { queryParams: { decisionId: qp['decisionId'] } });
    });
  }

  create(): void {
    this.router.navigate(['/metrics/create']);
  }

  open(id: string): void {
    this.router.navigate(['/metrics', id]);
  }
}
