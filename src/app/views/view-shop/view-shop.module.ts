import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewShopRoutingModule } from './view-shop-routing.module';
import { ViewShopComponent } from './view-shop.component';

@NgModule({
  declarations: [ViewShopComponent],
  imports: [SharedModule, ViewShopRoutingModule],
})
export class ViewShopModule {}
