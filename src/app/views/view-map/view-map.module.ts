import { NgModule } from '@angular/core';

import { ViewMapRoutingModule } from './view-map-routing.module';
import { ViewMapComponent } from './view-map.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ViewMapComponent],
  imports: [SharedModule, ViewMapRoutingModule],
})
export class ViewMapModule {}
