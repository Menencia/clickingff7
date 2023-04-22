import { NgModule } from '@angular/core';

import { ViewSaveRoutingModule } from './view-save-routing.module';
import { ViewSaveComponent } from './view-save.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ViewSaveComponent
  ],
  imports: [
    SharedModule,
    ViewSaveRoutingModule
  ]
})
export class ViewSaveModule { }
