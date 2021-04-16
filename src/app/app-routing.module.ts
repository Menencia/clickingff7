import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'map', component: MapComponent
 },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
