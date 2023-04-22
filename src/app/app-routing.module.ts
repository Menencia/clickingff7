import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfigComponent } from './config/config.component';
import { EquipComponent } from './equip/equip.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'map', loadChildren: () => import('./views/view-map/view-map.module').then(m => m.ViewMapModule) },
  { path: 'shop', loadChildren: () => import('./views/view-shop/view-shop.module').then(m => m.ViewShopModule) },
  { path: 'equip', component: EquipComponent },
  { path: 'materia', loadChildren: () => import('./views/view-materia/view-materia.module').then(m => m.ViewMateriaModule) },
  { path: 'items', loadChildren: () => import('./views/view-items/view-items.module').then(m => m.ViewItemsModule) },
  { path: 'config', component: ConfigComponent },
  { path: 'phs', loadChildren: () => import('./views/view-phs/view-phs.module').then(m => m.ViewPhsModule) },
  { path: 'save', loadChildren: () => import('./views/view-save/view-save.module').then(m => m.ViewSaveModule) },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
