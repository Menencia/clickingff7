import { NgModule } from '@angular/core';
import { UiLayoutDefaultComponent } from './ui-layout-default/ui-layout-default.component';
import { UiNavbarComponent } from './ui-navbar/ui-navbar.component';
import { UiMainContainerComponent } from './ui-main-container/ui-main-container.component';
import { NgInjectModule } from '../ng-inject.module';
import { PipeTimePipe } from './pipes/pipe-time.pipe';
import { UiBarComponent } from './ui-bar/ui-bar.component';
import { UiActionsComponent } from './ui-actions/ui-actions.component';
import { I18nModule } from '../i18n.module';



@NgModule({
  declarations: [
    UiLayoutDefaultComponent,
    UiNavbarComponent,
    UiMainContainerComponent,
    PipeTimePipe,
    UiBarComponent,
    UiActionsComponent
  ],
  imports: [
    NgInjectModule,
    I18nModule,
  ],
  exports: [
    UiLayoutDefaultComponent,
    UiNavbarComponent,
    UiMainContainerComponent,
    PipeTimePipe,
    UiBarComponent,
    UiActionsComponent
  ]
})
export class UiModule { }
