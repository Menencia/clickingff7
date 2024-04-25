import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewShopComponent } from './view-shop.component';

const routes: Routes = [
  {
    path: '',
    component: ViewShopComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewShopRoutingModule {}
