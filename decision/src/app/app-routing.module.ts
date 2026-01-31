import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule) },
      { path: 'decisions', loadChildren: () => import('./features/decision-log/decision-log.module').then((m) => m.DecisionLogModule) },
      { path: 'tradeoffs', loadChildren: () => import('./features/tradeoff-tracker/tradeoff-tracker.module').then((m) => m.TradeoffTrackerModule) },
      { path: 'metrics', loadChildren: () => import('./features/outcome-metrics/outcome-metrics.module').then((m) => m.OutcomeMetricsModule) },
      { path: 'insights', loadChildren: () => import('./features/insights/insights.module').then((m) => m.InsightsModule) },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
