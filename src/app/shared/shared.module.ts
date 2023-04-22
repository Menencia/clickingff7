import { NgModule } from '@angular/core';
import { I18nModule } from './i18n.module';
import { NgInjectModule } from './ng-inject.module';

@NgModule({
  exports: [
    I18nModule,
    NgInjectModule
  ]
})
export class SharedModule { }
