import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoryComponent } from './story/story.component';
import { PrepareFightComponent } from './prepare-fight/prepare-fight.component';
import { FightComponent } from './fight/fight.component';
import { WinComponent } from './win/win.component';
import { CharactersComponent } from './characters/characters.component';
import { UnitComponent } from './unit/unit.component';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'characters', component: CharactersComponent },
  { path: 'unit/:id', component: UnitComponent },
  { path: 'story', component: StoryComponent },
  { path: 'prepareFight', component: PrepareFightComponent },
  { path: 'fight', component: FightComponent },
  { path: 'win', component: WinComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule,
    HttpClientModule
  ],
  providers: [
  ]
})
export class AppRoutingModule {}
