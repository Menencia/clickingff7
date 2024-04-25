import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewPhsRoutingModule } from './view-phs-routing.module';
import { ViewPhsComponent } from './view-phs.component';

@NgModule({
  declarations: [ViewPhsComponent],
  imports: [SharedModule, ViewPhsRoutingModule],
})
export class ViewPhsModule {}
