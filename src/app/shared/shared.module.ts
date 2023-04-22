import { NgModule } from '@angular/core';
import { I18nModule } from './i18n.module';
import { NgInjectModule } from './ng-inject.module';
import { UiModule } from './ui/ui.module';

@NgModule({
  exports: [
    UiModule,
    I18nModule,
    NgInjectModule
  ]
})
export class SharedModule { }
