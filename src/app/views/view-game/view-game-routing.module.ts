import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewGameComponent } from './view-game.component';

const routes: Routes = [
  {
    path: '',
    component: ViewGameComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewGameRoutingModule {}
