import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattleGuard } from './core/guards/battle.guard';
import { ZoneGuard } from './core/guards/zone.guard';

const routes: Routes = [
  {
    path: 'game',
    loadChildren: () =>
      import('./views/view-game/view-game.module').then(
        (m) => m.ViewGameModule,
      ),
  },
  {
    path: 'map',
    canActivate: [BattleGuard],
    loadChildren: () =>
      import('./views/view-map/view-map.module').then((m) => m.ViewMapModule),
  },
  {
    path: 'shop',
    canActivate: [BattleGuard],
    loadChildren: () =>
      import('./views/view-shop/view-shop.module').then(
        (m) => m.ViewShopModule,
      ),
  },
  {
    path: 'equip',
    canActivate: [BattleGuard],
    loadChildren: () =>
      import('./views/view-equip/view-equip.module').then(
        (m) => m.ViewEquipModule,
      ),
  },
  {
    path: 'materia',
    canActivate: [BattleGuard],
    loadChildren: () =>
      import('./views/view-materia/view-materia.module').then(
        (m) => m.ViewMateriaModule,
      ),
  },
  {
    path: 'items',
    canActivate: [BattleGuard],
    loadChildren: () =>
      import('./views/view-items/view-items.module').then(
        (m) => m.ViewItemsModule,
      ),
  },
  {
    path: 'config',
    canActivate: [BattleGuard],
    loadChildren: () =>
      import('./views/view-config/view-config.module').then(
        (m) => m.ViewConfigModule,
      ),
  },
  {
    path: 'phs',
    canActivate: [BattleGuard, ZoneGuard],
    loadChildren: () =>
      import('./views/view-phs/view-phs.module').then((m) => m.ViewPhsModule),
  },
  {
    path: 'save',
    canActivate: [BattleGuard],
    loadChildren: () =>
      import('./views/view-save/view-save.module').then(
        (m) => m.ViewSaveModule,
      ),
  },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
