import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewMapComponent } from './view-map.component';

const routes: Routes = [{
  path: '',
  component: ViewMapComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewMapRoutingModule { }
