import { NgModule } from '@angular/core';
import { NgInjectModule } from './ng-inject.module';
import { UiModule } from './ui/ui.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  exports: [
    UiModule,
    TranslateModule,
    NgInjectModule
  ]
})
export class SharedModule { }
