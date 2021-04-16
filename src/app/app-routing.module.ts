import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EquipComponent } from './equip/equip.component';
import { GameComponent } from './game/game.component';
import { MapComponent } from './map/map.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'map', component: MapComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'equip', component: EquipComponent },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
