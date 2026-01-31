import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { InsightService, Insight } from '../../../core/services/insight.service';

@Component({
  selector: 'app-insights-page',
  templateUrl: './insights-page.component.html',
  styleUrls: ['./insights-page.component.scss'],
})
export class InsightsPageComponent implements OnInit {
  insights$!: Observable<Insight[]>;

  constructor(
    private insights: InsightService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.insights$ = this.insights.getInsights();
  }

  goToDecision(id: string): void {
    this.router.navigate(['/decisions', id]);
  }
}
