import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewItemsComponent } from './view-items.component';

const routes: Routes = [
  {
    path: '',
    component: ViewItemsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewItemsRoutingModule {}
