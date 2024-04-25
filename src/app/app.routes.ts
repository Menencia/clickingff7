import { Routes } from '@angular/router';

import { BattleGuard } from './core/guards/battle.guard';
import { ZoneGuard } from './core/guards/zone.guard';

export const routes: Routes = [
  {
    path: 'game',
    loadComponent: () =>
      import('./views/view-game/view-game.component').then(
        (m) => m.ViewGameComponent,
      ),
  },
  {
    path: 'map',
    canActivate: [BattleGuard],
    loadComponent: () =>
      import('./views/view-map/view-map.component').then(
        (m) => m.ViewMapComponent,
      ),
  },
  {
    path: 'shop',
    canActivate: [BattleGuard],
    loadComponent: () =>
      import('./views/view-shop/view-shop.component').then(
        (m) => m.ViewShopComponent,
      ),
  },
  {
    path: 'equip',
    canActivate: [BattleGuard],
    loadComponent: () =>
      import('./views/view-equip/view-equip.component').then(
        (m) => m.ViewEquipComponent,
      ),
  },
  {
    path: 'materia',
    canActivate: [BattleGuard],
    loadComponent: () =>
      import('./views/view-materia/view-materia.component').then(
        (m) => m.ViewMateriaComponent,
      ),
  },
  {
    path: 'items',
    canActivate: [BattleGuard],
    loadComponent: () =>
      import('./views/view-items/view-items.component').then(
        (m) => m.ViewItemsComponent,
      ),
  },
  {
    path: 'config',
    canActivate: [BattleGuard],
    loadComponent: () =>
      import('./views/view-config/view-config.component').then(
        (m) => m.ViewConfigComponent,
      ),
  },
  {
    path: 'phs',
    canActivate: [BattleGuard, ZoneGuard],
    loadComponent: () =>
      import('./views/view-phs/view-phs.component').then(
        (m) => m.ViewPhsComponent,
      ),
  },
  {
    path: 'save',
    canActivate: [BattleGuard],
    loadComponent: () =>
      import('./views/view-save/view-save.component').then(
        (m) => m.ViewSaveComponent,
      ),
  },
  { path: '', redirectTo: '/game', pathMatch: 'full' },
];
