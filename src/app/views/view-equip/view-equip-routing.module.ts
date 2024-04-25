import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewEquipComponent } from './view-equip.component';

const routes: Routes = [
  {
    path: '',
    component: ViewEquipComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewEquipRoutingModule {}
