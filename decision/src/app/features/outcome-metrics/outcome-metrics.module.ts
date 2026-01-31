import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MetricsListComponent } from './metrics-list/metrics-list.component';
import { MetricCreateComponent } from './metric-create/metric-create.component';
import { MetricDetailComponent } from './metric-detail/metric-detail.component';

const routes: Routes = [
  { path: '', component: MetricsListComponent },
  { path: 'create', component: MetricCreateComponent },
  { path: ':id', component: MetricDetailComponent },
];

@NgModule({
  declarations: [MetricsListComponent, MetricCreateComponent, MetricDetailComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class OutcomeMetricsModule {}
