import { NgModule } from '@angular/core';

import { ViewMateriaRoutingModule } from './view-materia-routing.module';
import { ViewMateriaComponent } from './view-materia.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ViewMateriaComponent],
  imports: [SharedModule, ViewMateriaRoutingModule],
})
export class ViewMateriaModule {}
