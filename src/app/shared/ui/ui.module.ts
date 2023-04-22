import { NgModule } from '@angular/core';
import { UiLayoutDefaultComponent } from './ui-layout-default/ui-layout-default.component';
import { UiNavbarComponent } from './ui-navbar/ui-navbar.component';
import { UiMainContainerComponent } from './ui-main-container/ui-main-container.component';
import { NgInjectModule } from '../ng-inject.module';
import { PipeTimePipe } from './pipes/pipe-time.pipe';
import { UiBarComponent } from './ui-bar/ui-bar.component';



@NgModule({
  declarations: [
    UiLayoutDefaultComponent,
    UiNavbarComponent,
    UiMainContainerComponent,
    PipeTimePipe,
    UiBarComponent
  ],
  imports: [
    NgInjectModule
  ],
  exports: [
    UiLayoutDefaultComponent,
    UiNavbarComponent,
    UiMainContainerComponent,
    PipeTimePipe,
    UiBarComponent
  ]
})
export class UiModule { }
