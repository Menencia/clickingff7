import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewConfigComponent } from './view-config.component';

const routes: Routes = [{
  path: '',
  component: ViewConfigComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewConfigRoutingModule { }
