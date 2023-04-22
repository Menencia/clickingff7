import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { TimePipe } from './time.pipe';
import { MapComponent } from './map/map.component';
import { EquipComponent } from './equip/equip.component';
import { MateriaComponent } from './materia/materia.component';
import { ItemsComponent } from './items/items.component';
import { ConfigComponent } from './config/config.component';
import { SaveComponent } from './save/save.component';
import { PHSComponent } from './phs/phs.component';
import { BarComponent } from './components/bar/bar.component';
import { ActionsComponent } from './game/components/actions/actions.component';
import { ViewsModule } from './views/views.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    TimePipe,
    MapComponent,
    EquipComponent,
    MateriaComponent,
    ItemsComponent,
    ConfigComponent,
    SaveComponent,
    PHSComponent,
    BarComponent,
    ActionsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ViewsModule,
    SharedModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
