import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DecisionListComponent } from './decision-list/decision-list.component';
import { DecisionDetailComponent } from './decision-detail/decision-detail.component';
import { DecisionCreateComponent } from './decision-create/decision-create.component';

const routes: Routes = [
  { path: '', component: DecisionListComponent },
  { path: 'create', component: DecisionCreateComponent },
  { path: ':id', component: DecisionDetailComponent },
];

@NgModule({
  declarations: [DecisionListComponent, DecisionDetailComponent, DecisionCreateComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class DecisionLogModule {}
