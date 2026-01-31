import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Decision } from '../../../core/models/decision.model';
import { OutcomeMetric } from '../../../core/models/metric.model';
import { Tradeoff } from '../../../core/models/tradeoff.model';
import { DecisionStoreService } from '../../../core/services/decision-store.service';
import { MetricsService } from '../../../core/services/metrics.service';
import { TradeoffStoreService } from '../../../core/services/tradeoff-store.service';

@Component({
  selector: 'app-decision-detail',
  templateUrl: './decision-detail.component.html',
  styleUrls: ['./decision-detail.component.scss'],
})
export class DecisionDetailComponent implements OnInit {
  decision$!: Observable<Decision | undefined>;
  metrics$!: Observable<OutcomeMetric[]>;
  tradeoffs$!: Observable<Tradeoff[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: DecisionStoreService,
    private metrics: MetricsService,
    private tradeoffs: TradeoffStoreService
  ) {}

  ngOnInit(): void {
    const id$ = this.route.paramMap.pipe(map((p) => p.get('id')!));
    this.decision$ = id$.pipe(switchMap((id) => this.store.getById(id)));
    this.metrics$ = id$.pipe(switchMap((id) => this.metrics.getByDecisionId(id)));
    this.tradeoffs$ = id$.pipe(switchMap((id) => this.tradeoffs.getByDecisionId(id)));
  }

  back(): void {
    this.router.navigate(['/decisions']);
  }

  createMetric(decisionId: string): void {
    this.router.navigate(['/metrics'], { queryParams: { decisionId } });
  }
}
