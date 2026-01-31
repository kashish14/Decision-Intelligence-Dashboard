import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Decision } from '../../../core/models/decision.model';
import { DecisionStoreService } from '../../../core/services/decision-store.service';

@Component({
  selector: 'app-decision-list',
  templateUrl: './decision-list.component.html',
  styleUrls: ['./decision-list.component.scss'],
})
export class DecisionListComponent implements OnInit {
  decisions$!: Observable<Decision[]>;

  constructor(
    private store: DecisionStoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.decisions$ = this.store.getAll();
  }

  create(): void {
    this.router.navigate(['/decisions/create']);
  }

  open(id: string): void {
    this.router.navigate(['/decisions', id]);
  }
}
