import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewMapRoutingModule } from './view-map-routing.module';
import { ViewMapComponent } from './view-map.component';

@NgModule({
  declarations: [ViewMapComponent],
  imports: [SharedModule, ViewMapRoutingModule],
})
export class ViewMapModule {}
