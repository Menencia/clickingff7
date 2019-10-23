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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    StoryComponent,
    PrepareFightComponent,
    FightComponent,
    LoseComponent,
    WinComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
