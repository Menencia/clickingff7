import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ViewEquipRoutingModule } from './view-equip-routing.module';
import { ViewEquipComponent } from './view-equip.component';

@NgModule({
  declarations: [ViewEquipComponent],
  imports: [SharedModule, ViewEquipRoutingModule],
})
export class ViewEquipModule {}
