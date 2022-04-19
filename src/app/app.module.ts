import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { TimePipe } from './time.pipe';
import { MapComponent } from './map/map.component';
import { ShopComponent } from './shop/shop.component';
import { EquipComponent } from './equip/equip.component';
import { MateriaComponent } from './materia/materia.component';
import { ItemsComponent } from './items/items.component';
import { ConfigComponent } from './config/config.component';
import { FormsModule } from '@angular/forms';
import { SaveComponent } from './save/save.component';
import { PHSComponent } from './phs/phs.component';
import { BarComponent } from './components/bar/bar.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    TimePipe,
    MapComponent,
    ShopComponent,
    EquipComponent,
    MateriaComponent,
    ItemsComponent,
    ConfigComponent,
    SaveComponent,
    PHSComponent,
    BarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
