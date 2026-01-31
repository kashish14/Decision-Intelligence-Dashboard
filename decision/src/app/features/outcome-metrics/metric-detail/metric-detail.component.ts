import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OutcomeMetric } from '../../../core/models/metric.model';
import { Decision } from '../../../core/models/decision.model';
import { MetricsService } from '../../../core/services/metrics.service';
import { DecisionStoreService } from '../../../core/services/decision-store.service';

@Component({
  selector: 'app-metric-detail',
  templateUrl: './metric-detail.component.html',
  styleUrls: ['./metric-detail.component.scss'],
})
export class MetricDetailComponent implements OnInit {
  metric$!: Observable<OutcomeMetric | undefined>;
  decision$!: Observable<Decision | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metrics: MetricsService,
    private decisions: DecisionStoreService
  ) {}

  ngOnInit(): void {
    const id$ = this.route.paramMap.pipe(map((p) => p.get('id')!));
    this.metric$ = id$.pipe(switchMap((id) => this.metrics.getById(id)));
    this.decision$ = this.metric$.pipe(
      switchMap((m) => (m ? this.decisions.getById(m.decisionId) : of(undefined)))
    );
  }

  back(): void {
    this.router.navigate(['/metrics']);
  }
}
