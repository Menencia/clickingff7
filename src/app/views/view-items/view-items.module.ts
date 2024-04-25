import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewItemsRoutingModule } from './view-items-routing.module';
import { ViewItemsComponent } from './view-items.component';

@NgModule({
  declarations: [ViewItemsComponent],
  imports: [SharedModule, ViewItemsRoutingModule],
})
export class ViewItemsModule {}
