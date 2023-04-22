import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigComponent } from './config/config.component';
import { EquipComponent } from './equip/equip.component';
import { GameComponent } from './game/game.component';
import { ItemsComponent } from './items/items.component';
import { MapComponent } from './map/map.component';
import { MateriaComponent } from './materia/materia.component';
import { PHSComponent } from './phs/phs.component';
import { SaveComponent } from './save/save.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'map', component: MapComponent },
  { path: 'shop', loadChildren: () => import('./views/shop/shop.module').then(m => m.ShopModule) },
  { path: 'equip', component: EquipComponent },
  { path: 'materia', component: MateriaComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'phs', component: PHSComponent },
  { path: 'save', component: SaveComponent },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
