import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

import { NgInjectModule } from './ng-inject.module';
import { UiModule } from './ui/ui.module';

@NgModule({
  exports: [UiModule, TranslateModule, NgInjectModule, FontAwesomeModule],
})
export class SharedModule {}
