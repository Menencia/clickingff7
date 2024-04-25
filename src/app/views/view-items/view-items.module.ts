import { NgModule } from '@angular/core';

import { ViewItemsRoutingModule } from './view-items-routing.module';
import { ViewItemsComponent } from './view-items.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ViewItemsComponent],
  imports: [SharedModule, ViewItemsRoutingModule],
})
export class ViewItemsModule {}
