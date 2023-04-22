import { NgModule } from '@angular/core';
import { UiLayoutDefaultComponent } from './ui-layout-default/ui-layout-default.component';
import { UiNavbarComponent } from './ui-navbar/ui-navbar.component';
import { UiMainContainerComponent } from './ui-main-container/ui-main-container.component';
import { NgInjectModule } from '../ng-inject.module';



@NgModule({
  declarations: [
    UiLayoutDefaultComponent,
    UiNavbarComponent,
    UiMainContainerComponent
  ],
  imports: [
    NgInjectModule
  ],
  exports: [
    UiLayoutDefaultComponent,
    UiNavbarComponent,
    UiMainContainerComponent
  ]
})
export class UiModule { }
