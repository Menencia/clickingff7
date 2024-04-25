import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewPhsComponent } from './view-phs.component';

const routes: Routes = [
  {
    path: '',
    component: ViewPhsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewPhsRoutingModule {}
