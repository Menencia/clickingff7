import { NgModule } from '@angular/core';

import { ViewShopRoutingModule } from './view-shop-routing.module';
import { ViewShopComponent } from './view-shop.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ViewShopComponent],
  imports: [SharedModule, ViewShopRoutingModule],
})
export class ViewShopModule {}
