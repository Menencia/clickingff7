import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { EquipComponent } from './equip/equip.component';
import { GameComponent } from './game/game.component';
import { ItemsComponent } from './items/items.component';
import { MapComponent } from './map/map.component';
import { MateriaComponent } from './materia/materia.component';
import { SaveComponent } from './save/save.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'map', component: MapComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'equip', component: EquipComponent },
  { path: 'materia', component: MateriaComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'save', component: SaveComponent },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
