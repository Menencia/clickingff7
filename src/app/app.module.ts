import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoryComponent } from './story/story.component';
import { PrepareFightComponent } from './prepare-fight/prepare-fight.component';
import { FightComponent } from './fight/fight.component';
import { LoseComponent } from './lose/lose.component';
import { WinComponent } from './win/win.component';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CharactersComponent } from './characters/characters.component';
import { CharacterIconComponent } from './character-icon/character-icon.component';
import { UnitComponent } from './unit/unit.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    StoryComponent,
    PrepareFightComponent,
    FightComponent,
    LoseComponent,
    WinComponent,
    CharactersComponent,
    CharacterIconComponent,
    UnitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(faTimes);
  }
}
