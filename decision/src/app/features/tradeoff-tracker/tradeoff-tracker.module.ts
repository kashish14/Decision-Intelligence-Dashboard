import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TradeoffListComponent } from './tradeoff-list/tradeoff-list.component';
import { TradeoffCreateComponent } from './tradeoff-create/tradeoff-create.component';

const routes: Routes = [
  { path: '', component: TradeoffListComponent },
  { path: 'create', component: TradeoffCreateComponent },
];

@NgModule({
  declarations: [TradeoffListComponent, TradeoffCreateComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class TradeoffTrackerModule {}
