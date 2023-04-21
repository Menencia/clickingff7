import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpBackend } from '@angular/common/http';
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
import { ActionsComponent } from './game/components/actions/actions.component';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(_httpBackend: HttpBackend) {
  return new MultiTranslateHttpLoader(_httpBackend, [
    {prefix: './assets/i18n/', suffix: '/main.json'},
    {prefix: './assets/i18n/', suffix: '/help.json'}
  ]);
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
    BarComponent,
    ActionsComponent
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
        deps: [HttpBackend]
      }
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
