import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { InsightsPageComponent } from './insights-page/insights-page.component';

const routes: Routes = [{ path: '', component: InsightsPageComponent }];

@NgModule({
  declarations: [InsightsPageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class InsightsModule {}
