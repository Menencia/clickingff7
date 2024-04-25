import { NgModule } from '@angular/core';

import { ViewPhsRoutingModule } from './view-phs-routing.module';
import { ViewPhsComponent } from './view-phs.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ViewPhsComponent],
  imports: [SharedModule, ViewPhsRoutingModule],
})
export class ViewPhsModule {}
