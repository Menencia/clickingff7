import { NgModule } from '@angular/core';

import { ViewEquipRoutingModule } from './view-equip-routing.module';
import { ViewEquipComponent } from './view-equip.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ViewEquipComponent],
  imports: [SharedModule, ViewEquipRoutingModule],
})
export class ViewEquipModule {}
