import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewConfigRoutingModule } from './view-config-routing.module';
import { ViewConfigComponent } from './view-config.component';

@NgModule({
  declarations: [ViewConfigComponent],
  imports: [SharedModule, ViewConfigRoutingModule],
})
export class ViewConfigModule {}
