import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tradeoff } from '../../../core/models/tradeoff.model';
import { Decision } from '../../../core/models/decision.model';
import { TradeoffStoreService } from '../../../core/services/tradeoff-store.service';
import { DecisionStoreService } from '../../../core/services/decision-store.service';

@Component({
  selector: 'app-tradeoff-list',
  templateUrl: './tradeoff-list.component.html',
  styleUrls: ['./tradeoff-list.component.scss'],
})
export class TradeoffListComponent implements OnInit {
  tradeoffsWithDecision$!: Observable<{ tradeoff: Tradeoff; decision?: Decision }[]>;

  constructor(
    private store: TradeoffStoreService,
    private decisions: DecisionStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tradeoffsWithDecision$ = combineLatest([
      this.store.getAll(),
      this.decisions.decisions$,
    ]).pipe(
      map(([tradeoffs, decisions]) =>
        tradeoffs.map((tradeoff) => ({
          tradeoff,
          decision: tradeoff.decisionId
            ? decisions.find((d) => d.id === tradeoff.decisionId)
            : undefined,
        }))
      )
    );
  }

  create(): void {
    this.router.navigate(['/tradeoffs/create']);
  }
}
