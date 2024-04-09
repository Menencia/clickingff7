import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewMateriaComponent } from './view-materia.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

const routes: Routes = [{
  path: '',
  component: ViewMateriaComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewMateriaRoutingModule { }
