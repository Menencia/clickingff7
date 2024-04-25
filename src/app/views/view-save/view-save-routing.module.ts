import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewSaveComponent } from './view-save.component';

const routes: Routes = [
  {
    path: '',
    component: ViewSaveComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSaveRoutingModule {}
