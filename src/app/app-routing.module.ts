import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './game/game.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'map', loadChildren: () => import('./views/view-map/view-map.module').then(m => m.ViewMapModule) },
  { path: 'shop', loadChildren: () => import('./views/view-shop/view-shop.module').then(m => m.ViewShopModule) },
  { path: 'equip', loadChildren: () => import('./views/view-equip/view-equip.module').then(m => m.ViewEquipModule) },
  { path: 'materia', loadChildren: () => import('./views/view-materia/view-materia.module').then(m => m.ViewMateriaModule) },
  { path: 'items', loadChildren: () => import('./views/view-items/view-items.module').then(m => m.ViewItemsModule) },
  { path: 'config', loadChildren: () => import('./views/view-config/view-config.module').then(m => m.ViewConfigModule) },
  { path: 'phs', loadChildren: () => import('./views/view-phs/view-phs.module').then(m => m.ViewPhsModule) },
  { path: 'save', loadChildren: () => import('./views/view-save/view-save.module').then(m => m.ViewSaveModule) },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
