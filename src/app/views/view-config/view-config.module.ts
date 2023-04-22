import { NgModule } from '@angular/core';

import { ViewConfigRoutingModule } from './view-config-routing.module';
import { ViewConfigComponent } from './view-config.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ViewConfigComponent
  ],
  imports: [
    SharedModule,
    ViewConfigRoutingModule
  ]
})
export class ViewConfigModule { }
