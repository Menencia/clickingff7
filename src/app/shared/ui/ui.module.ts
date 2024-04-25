import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { NgInjectModule } from '../ng-inject.module';

import { PipeTimePipe } from './pipes/pipe-time.pipe';
import { UiActionsComponent } from './ui-actions/ui-actions.component';
import { UiBarComponent } from './ui-bar/ui-bar.component';
import { UiFooterComponent } from './ui-footer/ui-footer.component';
import { UiLayoutDefaultComponent } from './ui-layout-default/ui-layout-default.component';
import { UiMainContainerComponent } from './ui-main-container/ui-main-container.component';
import { UiNavbarComponent } from './ui-navbar/ui-navbar.component';

@NgModule({
  declarations: [
    UiLayoutDefaultComponent,
    UiNavbarComponent,
    UiMainContainerComponent,
    PipeTimePipe,
    UiBarComponent,
    UiActionsComponent,
    UiFooterComponent,
  ],
  imports: [NgInjectModule, TranslateModule],
  exports: [
    UiLayoutDefaultComponent,
    UiNavbarComponent,
    UiMainContainerComponent,
    PipeTimePipe,
    UiBarComponent,
    UiActionsComponent,
    UiFooterComponent,
  ],
})
export class UiModule {}
