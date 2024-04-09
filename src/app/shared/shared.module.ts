import { NgModule } from '@angular/core';
import { NgInjectModule } from './ng-inject.module';
import { UiModule } from './ui/ui.module';
import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  exports: [
    UiModule,
    TranslateModule,
    NgInjectModule,
    FontAwesomeModule
  ]
})
export class SharedModule { }
